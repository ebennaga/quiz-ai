import OpenAI from "openai";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // 1️⃣ Embedding pertanyaan
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: prompt,
  });

  const embedding = embeddingRes.data[0].embedding;

  const supabase = await createSupabaseServerClient();

  // 2️⃣ Ambil konteks dari Supabase
  const { data, error } = await supabase.rpc("match_pdf_chunks", {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: 10,
  });

  if (error) throw error;

  const context = data.map((d: any) => d.content).join("\n");

  // 3️⃣ Generate soal
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Kamu adalah AI pembuat soal edukasi.",
      },
      {
        role: "user",
        content: `
Gunakan konteks berikut untuk membuat soal.

${context}

Buat:
- 5 soal pilihan ganda
- 2 soal essay
`,
      },
    ],
  });

  return Response.json({
    quiz: completion.choices[0].message.content,
  });
}
