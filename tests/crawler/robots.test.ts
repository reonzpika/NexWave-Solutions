import { describe, it, expect } from "vitest";
import { __internal as robotsInternal } from "../../src/features/crawler/robots";

const { parseRobotsText, makeAllowChecker } = robotsInternal as any;

describe("robots", () => {
	it("allows by default when no matching disallow", () => {
		const rules = parseRobotsText(`User-agent: *\nAllow: /public\nDisallow: /private`);
		const isAllowed = makeAllowChecker(rules, "MyUA");
		expect(isAllowed("/public/info")).toBe(true);
		expect(isAllowed("/private/secret")).toBe(false);
	});

	it("longest match precedence", () => {
		const rules = parseRobotsText(`User-agent: *\nAllow: /a/b\nDisallow: /a`);
		const isAllowed = makeAllowChecker(rules, "*");
		expect(isAllowed("/a/b/c")).toBe(true);
		expect(isAllowed("/a/x")).toBe(false);
	});
});