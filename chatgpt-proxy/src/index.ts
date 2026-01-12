const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
	async fetch(request: Request, env: any): Promise<Response> {
		if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });

		try {
			const { command, data } = (await request.json()) as any;

			// Set a deadline to prevent Worker-level timeout (30s limit)
			const controller = new AbortController();
			const id = setTimeout(() => controller.abort(), 27000);

			const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${env.OPENAI_API_KEY}`,
					'Content-Type': 'application/json',
				},
				signal: controller.signal,
				body: JSON.stringify({
					model: 'gpt-4o-mini',
					messages: [
						{ role: 'system', content: command },
						{ role: 'user', content: typeof data === 'string' ? data : JSON.stringify(data) },
					],
					temperature: 0.1,
					max_tokens: 2000,
					response_format: { type: 'json_object' },
				}),
			});

			clearTimeout(id);

			if (openaiRes.status === 429) {
				return new Response(JSON.stringify({ error: 'AI is busy, try again.' }), {
					status: 429,
					headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
				});
			}

			const json: any = await openaiRes.json();
			return new Response(JSON.stringify({ result: json.choices[0].message.content }), {
				status: 200,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		} catch (err: any) {
			const message = err.name === 'AbortError' ? 'AI Request Timeout' : err.message;
			return new Response(JSON.stringify({ error: message }), {
				status: 500,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		}
	},
};
