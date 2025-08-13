import { CrawlRequest } from "./schema";

export type RobotsRules = {
	userAgents: Record<string, { allow: string[]; disallow: string[] }>;
	crawlDelay?: number;
};

function parseRobotsText(text: string): RobotsRules {
	const lines = text.split(/\r?\n/);
	const rules: RobotsRules = { userAgents: {} };
	let currentUAs: string[] = [];
	for (const rawLine of lines) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) continue;
		const [rawKey, rawVal] = line.split(":", 2);
		if (!rawKey || rawVal === undefined) continue;
		const key = rawKey.trim().toLowerCase();
		const val = rawVal.trim();
		if (key === "user-agent") {
			const ua = val.toLowerCase();
			currentUAs = [ua];
			if (!rules.userAgents[ua]) rules.userAgents[ua] = { allow: [], disallow: [] };
			continue;
		}
		if (key === "allow" || key === "disallow") {
			const arrKey = key as "allow" | "disallow";
			const path = val;
			if (currentUAs.length === 0) {
				currentUAs = ["*"]; // default group
				if (!rules.userAgents["*"]) rules.userAgents["*"] = { allow: [], disallow: [] };
			}
			for (const ua of currentUAs) {
				if (!rules.userAgents[ua]) rules.userAgents[ua] = { allow: [], disallow: [] };
				rules.userAgents[ua][arrKey].push(path);
			}
			continue;
		}
		if (key === "crawl-delay") {
			const n = Number(val);
			if (!Number.isNaN(n)) rules.crawlDelay = n;
		}
	}
	return rules;
}

function wildcardToRegExp(pattern: string): RegExp {
	// robots.txt supports * and $ as special tokens
	const escaped = pattern
		.replace(/[.+?^${}()|[]\\\\]/g, "\\$&")
		.replace(/\\\*/g, ".*");
	const withEnd = escaped.endsWith("$") ? escaped : `${escaped}`;
	return new RegExp(`^${withEnd}`);
}

function makeAllowChecker(rules: RobotsRules, userAgent: string) {
	const ua = userAgent.toLowerCase();
	const group = rules.userAgents[ua] || rules.userAgents["*"] || { allow: [], disallow: [] };
	const allowRules = group.allow.map((p) => ({ p, re: wildcardToRegExp(p) }));
	const disallowRules = group.disallow.map((p) => ({ p, re: wildcardToRegExp(p) }));

	return (path: string) => {
		// Longest match precedence: compare longest allow vs longest disallow that match
		let longestAllow = 0;
		let longestDisallow = 0;
		for (const r of allowRules) if (r.re.test(path)) longestAllow = Math.max(longestAllow, r.p.length);
		for (const r of disallowRules) if (r.re.test(path)) longestDisallow = Math.max(longestDisallow, r.p.length);
		if (longestDisallow > longestAllow) return false;
		return true;
	};
}

export type RobotsClient = {
	isAllowed: (path: string) => boolean;
	crawlDelayMs: number | undefined;
};

export async function fetchRobotsClient(baseUrl: string, userAgent: string): Promise<RobotsClient> {
	try {
		const url = new URL(baseUrl);
		const robotsUrl = `${url.origin}/robots.txt`;
		const res = await fetch(robotsUrl, { headers: { "User-Agent": userAgent } });
		if (!res.ok) throw new Error(`Robots fetch failed: ${res.status}`);
		const text = await res.text();
		const rules = parseRobotsText(text);
		const allowChecker = makeAllowChecker(rules, userAgent);
		const delayMs = typeof rules.crawlDelay === "number" ? rules.crawlDelay * 1000 : undefined;
		return { isAllowed: allowChecker, crawlDelayMs: delayMs };
	} catch {
		// No robots.txt or failure → allow by default
		return { isAllowed: () => true, crawlDelayMs: undefined };
	}
}

// Export internals for testing
export const __internal = { parseRobotsText, wildcardToRegExp, makeAllowChecker };