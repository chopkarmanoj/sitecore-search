// pages/api/openai-search.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // store in .env (NOT NEXT_PUBLIC_)
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { searchKeyword  , dataForAI} = req.body;

  console.log("Search Keyword:", searchKeyword);
  console.log("Data for AI:", dataForAI);

  const relevantEntries = dataForAI?.filter(entry => {
    const text = JSON.stringify(entry).toLowerCase();
    return text.includes(searchKeyword.toLowerCase());
  });

  if (relevantEntries?.length === 0) {
    return res.json({ abstract: `No relevant content found for "${searchKeyword}".` });
  }
const prompt = `
You are an AI search assistant that generates a concise and engaging "AI Overview"-style summary.

Task:
Using only the provided dataset, create a 3–6 sentence summary focused entirely on the given keyword.

Rules:
- Topic must be specific to Sitecore.
- Group related ideas together for flow and readability.
- Write in clear, reader-friendly language that appeals to both technical and non-technical readers.
- Avoid copying text verbatim from the dataset—rephrase naturally.
- Do not include raw URLs unless absolutely necessary.
- Highlight the key features, benefits, and use cases.
- Ensure the style matches an AI-generated search snippet.

Dataset:
${JSON.stringify(relevantEntries, null, 2)}

Keyword:${searchKeyword}
`;


  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You summarize search results into abstracts." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    res.json({ abstract: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
