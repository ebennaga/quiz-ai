import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(req: Request) {
  const { topic } = await req.json();

  // 1. embedding query
  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: topic,
  });

  // 2. ambil konteks relevan
  const { data } = await supabase.rpc("match_pdf_chunks", {
    query_embedding: queryEmbedding.data[0].embedding,
    match_count: 10,
  });

  const context = data.map((d: any) => d.content).join("\n");

  // 3. generate soal
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Kamu adalah guru profesional.",
      },
      {
        role: "user",
        content: `
Berdasarkan materi berikut:
${context}

Buatkan:
- 14 soal pilihan ganda (A–D)
- 6 soal esai

Untuk setiap soal:
- Sertakan jawaban benar
- Untuk esai sertakan poin penilaian singkat
`,
      },
    ],
  });

  return Response.json({
    quiz: completion.choices[0].message.content,
  });
}
