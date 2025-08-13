import Bottleneck from "bottleneck";
import crypto from "node:crypto";
import { fetchWithRetry } from "./fetch";
import { extractFromHtml } from "./extract";
import { splitIntoWordChunks, prependHeadingToFirstChunk } from "./chunk";
import { CrawlRequest, normalizeCrawlRequest, OutputRecord } from "./schema";
import { fetchRobotsClient } from "./robots";

export type CrawlMetrics = {
	pagesVisited: number;
	pagesEnqueued: number;
	pagesEmitted: number;
	pagesSkipped: number;
	duplicates: number;
	disallowedByRobots: number;
	errors: number;
};

export type CrawlResultLine = { type: "record"; record: OutputRecord } | { type: "metrics"; metrics: CrawlMetrics };

function compilePatterns(patterns: string[]): RegExp[] {
	return patterns.map((p) => new RegExp(p));
}

function normalizeUrl(u: string): string {
	try {
		const url = new URL(u);
		url.hash = "";
		// Remove trailing slash except root
		if (url.pathname !== "/" && url.pathname.endsWith("/")) {
			url.pathname = url.pathname.slice(0, -1);
		}
		return url.toString();
	} catch {
		return u;
	}
}

function shouldEnqueue(url: string, include: RegExp[], exclude: RegExp[]): boolean {
	if (!include.some((re) => re.test(url))) return false;
	if (exclude.some((re) => re.test(url))) return false;
	return true;
}

function sha256(text: string): string {
	return crypto.createHash("sha256").update(text).digest("hex");
}

export async function* crawlAndExtract(input: unknown): AsyncGenerator<CrawlResultLine> {
	const req = normalizeCrawlRequest(input);
	const includeRes = compilePatterns(req.includePatterns);
	const excludeRes = compilePatterns(req.excludePatterns);
	const limiter = new Bottleneck({
		reservoir: req.rateLimit.requestsPerMinute,
		reservoirRefreshInterval: 60 * 1000,
		reservoirRefreshAmount: req.rateLimit.requestsPerMinute,
		maxConcurrent: req.rateLimit.concurrency,
	});
	const robots = await fetchRobotsClient(req.startUrls[0], req.userAgent);

	const visited = new Set<string>();
	const emittedObjectIds = new Set<string>();
	const contentHashes = new Set<string>();
	const queue: Array<{ url: string; depth: number }> = [];
	for (const s of req.startUrls) {
		queue.push({ url: normalizeUrl(s), depth: 0 });
	}
	const metrics: CrawlMetrics = {
		pagesVisited: 0,
		pagesEnqueued: queue.length,
		pagesEmitted: 0,
		pagesSkipped: 0,
		duplicates: 0,
		disallowedByRobots: 0,
		errors: 0,
	};

	while (queue.length > 0 && metrics.pagesVisited < req.maxPages) {
		const { url, depth } = queue.shift()!;
		if (visited.has(url)) { metrics.pagesSkipped++; continue; }
		visited.add(url);
		metrics.pagesVisited++;

		let allowed = true;
		try {
			const path = new URL(url).pathname;
			if (!robots.isAllowed(path)) {
				allowed = false;
				metrics.disallowedByRobots++;
			}
		} catch {}
		if (!allowed) continue;

		try {
			const res = await limiter.schedule(() => fetchWithRetry(url, { userAgent: req.userAgent }));
			if (!res.ok || !res.headers.get("content-type")?.includes("text/html")) {
				continue;
			}
			const html = await res.text();
			const page = extractFromHtml(url, html, req.extractionSchema);
			const chunks = splitIntoWordChunks(page.content, req.chunk.words);
			const withHeading = prependHeadingToFirstChunk(chunks, page.headings?.[0]);
			for (const ch of withHeading) {
				const canonical = normalizeUrl(page.canonicalUrl || url);
				const site = canonical ? (new URL(canonical).hostname.replace(/^www\./, "")) : (new URL(url).hostname.replace(/^www\./, ""));
				const objectID = `${canonical}#c${ch.chunkIndex}`;
				const contentHash = sha256(`${canonical}\n${ch.content}`);
				if (emittedObjectIds.has(objectID) || contentHashes.has(contentHash)) { metrics.duplicates++; continue; }
				emittedObjectIds.add(objectID);
				contentHashes.add(contentHash);
				const record: OutputRecord = {
					objectID,
					site,
					url: canonical,
					title: page.title || "",
					content: ch.content,
					snippet: ch.snippet,
					headings: page.headings,
					publishedAt: page.publishedAt,
					updatedAt: page.updatedAt,
					chunkIndex: ch.chunkIndex,
					contentHash,
				};
				yield { type: "record", record };
				metrics.pagesEmitted++;
			}

			if (depth < req.maxDepth) {
				// Discover links
				const links = Array.from(html.matchAll(/href\s*=\s*"([^"]+)"/gi)).map((m) => m[1]);
				for (const href of links) {
					let nextUrl: string;
					try { nextUrl = new URL(href, url).toString(); } catch { continue; }
					nextUrl = normalizeUrl(nextUrl);
					if (!shouldEnqueue(nextUrl, includeRes, excludeRes)) continue;
					if (visited.has(nextUrl)) continue;
					queue.push({ url: nextUrl, depth: depth + 1 });
					metrics.pagesEnqueued++;
				}
			}
		} catch (e) {
			metrics.errors++;
			continue;
		}
	}

	yield { type: "metrics", metrics };
}