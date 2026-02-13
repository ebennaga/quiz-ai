import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const openai = new OpenAI();

export async function POST(req: Request) {
  const { documentId } = await req.json();
  const supabase = await createSupabaseServerClient();

  // 1️⃣ Ambil context via similarity search
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: "materi utama",
  });

  const { data: chunks } = await supabase.rpc("match_pdf_chunks", {
    query_embedding: embedding.data[0].embedding,
    match_count: 5,
    doc_id: documentId,
  });

  const context = chunks.map((c: any) => c.content).join("\n");

  // 2️⃣ Generate quiz
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
Buat soal pilihan ganda dan essay dari materi berikut:
${context}

Output JSON.
        `,
      },
    ],
  });

  const quizJson = JSON.parse(completion.choices[0].message.content!);

  // 3️⃣ Simpan quiz
  const { data: quiz } = await supabase
    .from("quizzes")
    .insert({
      document_id: documentId,
      content: quizJson,
    })
    .select()
    .single();

  return NextResponse.json({
    quizId: quiz.id,
  });
}
