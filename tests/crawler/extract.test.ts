import { describe, it, expect } from "vitest";
import { extractFromHtml } from "../../src/features/crawler/extract";

const html = `
<!doctype html>
<html>
<head>
<meta property="og:title" content="Clinical Guide A"/>
<meta property="article:published_time" content="2021-05-01T12:00:00Z"/>
<link rel="canonical" href="https://example.com/guide/a"/>
</head>
<body>
<header>Navigation</header>
<main>
<h1>Guide A</h1>
<p>This is a clinical guide with several paragraphs and detailed recommendations for care, including dosage and referral criteria.</p>
<p>Second paragraph with more details and additional instructions for clinicians.</p>
</main>
<footer>Footer text</footer>
</body>
</html>`;

describe("extract", () => {
	it("extracts canonical url, title, headings, dates, and content", () => {
		const result = extractFromHtml("https://example.com/guide/a?utm=x", html, {
			contentSelectors: ["main"],
			headingSelectors: ["h1", "h2"],
			title: ["meta[property='og:title']", "title"],
			publishedTimeSelectors: ["meta[property='article:published_time']"],
			updatedTimeSelectors: ["meta[property='article:modified_time']"],
		});
		expect(result.canonicalUrl).toBe("https://example.com/guide/a");
		expect(result.title).toBe("Clinical Guide A");
		expect(result.headings?.[0]).toBe("Guide A");
		expect(result.publishedAt?.startsWith("2021-05-01")).toBe(true);
		expect(result.content.length).toBeGreaterThan(50);
		// navigation/footer removed
		expect(result.content.includes("Navigation")).toBe(false);
		expect(result.content.includes("Footer")).toBe(false);
	});
});