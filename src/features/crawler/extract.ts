import * as cheerio from "cheerio";
import { Extraction } from "./schema";

export type ExtractedPage = {
	url: string;
	canonicalUrl: string;
	title?: string;
	headings?: string[];
	publishedAt?: string;
	updatedAt?: string;
	content: string;
};

function normalizeWhitespace(text: string): string {
	return text.replace(/\s+/g, " ").replace(/\u00A0/g, " ").trim();
}

function pickFirst($: cheerio.CheerioAPI, selectors?: string[]): string | undefined {
	if (!selectors) return undefined;
	for (const sel of selectors) {
		const el = $(sel).first();
		if (el && el.length) {
			const contentAttr = el.attr("content");
			if (contentAttr) return normalizeWhitespace(contentAttr);
			const text = el.text();
			if (text) return normalizeWhitespace(text);
		}
	}
	return undefined;
}

function extractDate($: cheerio.CheerioAPI, selectors?: string[]): string | undefined {
	if (!selectors) return undefined;
	for (const sel of selectors) {
		const el = $(sel).first();
		if (el && el.length) {
			const dt = el.attr("datetime") || el.attr("content") || el.text();
			const iso = new Date(dt || "").toISOString();
			if (!Number.isNaN(Date.parse(iso))) return iso;
		}
	}
	return undefined;
}

function getCanonicalUrl($: cheerio.CheerioAPI, baseUrl: string): string {
	const og = $("meta[property='og:url']").attr("content");
	const link = $("link[rel='canonical']").attr("href");
	const picked = og || link || baseUrl;
	try {
		return new URL(picked, baseUrl).toString();
	} catch {
		return baseUrl;
	}
}

function getMainContent($: cheerio.CheerioAPI, selectors: string[]): string {
	// Remove common noise
	["nav", "header", "footer", "script", "style", "noscript", "aside", "form", ".ads", "[role='navigation']", "[aria-label='breadcrumb']"].forEach(
		(sel) => $(sel).remove()
	);
	for (const sel of selectors) {
		const el = $(sel).first();
		if (el.length) {
			const text = normalizeWhitespace(el.text());
			if (text.length > 0) return text;
		}
	}
	// fallback to body text
	return normalizeWhitespace($("body").text());
}

function getHeadings($: cheerio.CheerioAPI, selectors: string[]): string[] {
	const result: string[] = [];
	for (const sel of selectors) {
		$(sel).each((_, el) => {
			const t = normalizeWhitespace($(el).text());
			if (t) result.push(t);
		});
	}
	return Array.from(new Set(result));
}

export function extractFromHtml(url: string, html: string, schema: Extraction): ExtractedPage {
	const $ = cheerio.load(html);
	const canonicalUrl = getCanonicalUrl($, url);
	const title = pickFirst($, schema.title || ["meta[property='og:title']", "title"]) || "";
	const headings = getHeadings($, schema.headingSelectors || ["h1", "h2", "h3"]);
	const publishedAt = extractDate($, schema.publishedTimeSelectors);
	const updatedAt = extractDate($, schema.updatedTimeSelectors);
	const content = getMainContent($, schema.contentSelectors);
	return { url, canonicalUrl, title, headings, publishedAt, updatedAt, content };
}

export const __internal = { normalizeWhitespace, pickFirst, extractDate, getCanonicalUrl, getMainContent, getHeadings };