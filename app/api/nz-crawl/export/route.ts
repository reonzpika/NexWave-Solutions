import { NextRequest } from "next/server";
import { CrawlRequestSchema } from "../../../../src/features/crawler/schema";
import { crawlAndExtract } from "../../../../src/features/crawler/crawl";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = CrawlRequestSchema.parse(body);
		const iterator = crawlAndExtract(parsed);

		if (parsed.emit?.format === "json") {
			const records: any[] = [];
			let metrics: any = null;
			for await (const msg of iterator) {
				if (msg.type === "record") records.push(msg.record);
				if (msg.type === "metrics") metrics = msg.metrics;
			}
			return Response.json({ records, metrics });
		}

		const encoder = new TextEncoder();
		const stream = new ReadableStream({
			async pull(controller) {
				const { value, done } = await iterator.next();
				if (done) {
					controller.close();
					return;
				}
				if (value.type === "record") {
					controller.enqueue(encoder.encode(JSON.stringify(value.record) + "\n"));
				} else if (value.type === "metrics") {
					controller.enqueue(encoder.encode(JSON.stringify({ type: "metrics", ...value }) + "\n"));
				}
			},
		});

		return new Response(stream as any, {
			headers: {
				"Content-Type": "application/x-ndjson",
				"Cache-Control": "no-store",
			},
		});
	} catch (e: any) {
		return new Response(JSON.stringify({ error: e?.message || "Invalid request" }), { status: 400, headers: { "Content-Type": "application/json" } });
	}
}