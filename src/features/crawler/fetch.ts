type FetcherOptions = {
	userAgent: string;
	timeoutMs?: number;
	maxRetries?: number;
};

function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

export async function fetchWithRetry(url: string, options: FetcherOptions): Promise<Response> {
	const { userAgent, timeoutMs = 15000, maxRetries = 3 } = options;
	let attempt = 0;
	let lastError: any;
	while (attempt <= maxRetries) {
		try {
			const controller = new AbortController();
			const t = setTimeout(() => controller.abort(), timeoutMs);
			const res = await fetch(url, {
				headers: {
					"User-Agent": userAgent,
					"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
					"Accept-Encoding": "gzip, deflate, br",
				},
				signal: controller.signal,
				redirect: "follow",
			});
			clearTimeout(t);
			if (res.status >= 500 || res.status === 429) {
				throw new Error(`Retryable status ${res.status}`);
			}
			return res;
		} catch (err: any) {
			lastError = err;
			if (attempt === maxRetries) break;
			const backoff = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 250, 8000);
			await sleep(backoff);
			attempt++;
		}
	}
	throw lastError;
}