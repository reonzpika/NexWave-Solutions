#!/usr/bin/env tsx

import { readFileSync, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { CrawlRequestSchema } from "../src/features/crawler/schema";
import { crawlAndExtract } from "../src/features/crawler/crawl";

function parseArgs(argv: string[]) {
	const args: Record<string, string> = {};
	for (let i = 2; i < argv.length; i += 2) {
		const key = argv[i];
		const val = argv[i + 1];
		if (!key || !val) break;
		args[key.replace(/^--/, "")] = val;
	}
	return args;
}

async function main() {
	const args = parseArgs(process.argv);
	const configPath = args["config"];
	const outPath = args["out"];
	if (!configPath || !outPath) {
		console.error("Usage: tsx scripts/crawl-export.ts --config request.json --out out.jsonl");
		process.exit(2);
	}
	const json = JSON.parse(readFileSync(resolve(configPath), "utf-8"));
	const parsed = CrawlRequestSchema.parse(json);
	const iterator = crawlAndExtract(parsed);
	const out = createWriteStream(resolve(outPath), { encoding: "utf-8" });
	let lastMetrics: any = null;
	for await (const msg of iterator) {
		if (msg.type === "record") {
			out.write(JSON.stringify(msg.record) + "\n");
		} else if (msg.type === "metrics") {
			lastMetrics = msg.metrics;
		}
	}
	out.end();
	console.log("Metrics:", lastMetrics);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});