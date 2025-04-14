import { OpenAI } from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
	const { results } = await req.json();

	const content = `
    Summarize all the search results in maximum of 2 sentences only for a user, make it compact, make it comprehensive and don't start with "The search result":
    ${JSON.stringify(results)}
  `;

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant that summarizes search results.",
				},
				{ role: "user", content },
			],
			temperature: 0.5,
		});

		const summary = completion.choices[0].message?.content;
		return Response.json({ summary });
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: "Failed to summarize" }), {
			status: 500,
		});
	}
}
