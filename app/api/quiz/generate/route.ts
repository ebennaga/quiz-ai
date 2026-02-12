import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// export async function POST(req: Request) {
//   try {
//     const { documentId, mcq, essay } = await req.json();

//     if (!documentId) {
//       return Response.json(
//         { error: "documentId is required" },
//         { status: 400 },
//       );
//     }

//     // 1️⃣ Ambil semua chunk dari document itu
//     const { data, error } = await supabase
//       .from("pdf_chunks")
//       .select("content")
//       .eq("document_id", documentId);
//     console.log("data2", data);
//     if (error) {
//       return Response.json({ error: error.message }, { status: 500 });
//     }

//     if (!data || data.length === 0) {
//       return Response.json(
//         { error: "No content found for this document" },
//         { status: 404 },
//       );
//     }

//     const context = data.map((d: any) => d.content).join("\n");
//     console.log("context", context);
//     // 2️⃣ Generate quiz
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: "Kamu adalah guru profesional.",
//         },
//         {
//           role: "user",
//           content: `
// Berdasarkan materi berikut:
// ${context}

// Buatkan:
// - ${mcq ?? 14} soal pilihan ganda (A–D)
// - ${essay ?? 6} soal esai

// Untuk setiap soal:
// - Sertakan jawaban benar
// - Untuk esai sertakan poin penilaian singkat
// `,
//         },
//       ],
//     });

//     return Response.json({
//       quiz: completion.choices[0].message.content,
//     });
//   } catch (err: any) {
//     console.error("SERVER ERROR:", err);
//     return Response.json({ error: err.message }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    const { documentId, mcq, essay } = await req.json();

    if (!documentId) {
      return Response.json(
        { error: "documentId is required" },
        { status: 400 },
      );
    }

    // 1️⃣ ambil chunk
    const { data: chunks, error } = await supabase
      .from("pdf_chunks")
      .select("content")
      .eq("document_id", documentId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const context = chunks?.map((d: any) => d.content).join("\n");

    // 2️⃣ generate quiz
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Kamu adalah guru profesional dan output HARUS JSON.",
        },
        {
          role: "user",
          content: `
Buatkan quiz dalam format JSON seperti ini:

{
  "questions": [
    {
      "type": "mcq",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A"
    },
    {
      "type": "essay",
      "question": "...",
      "correct_answer": "..."
    }
  ]
}

Materi:
${context}
        `,
        },
      ],
    });

    let raw = completion.choices[0].message.content || "";

    // 🔥 Hapus markdown ```json ... ```
    raw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(raw);

    // 3️⃣ insert quiz
    const { data: quizData, error: quizError } = await supabase
      .from("quizzes")
      .insert({ document_id: documentId })
      .select()
      .single();

    if (quizError) {
      return Response.json({ error: quizError.message }, { status: 500 });
    }

    // 4️⃣ insert questions
    const questionsToInsert = parsed.questions.map((q: any) => ({
      quiz_id: quizData.id,
      question: q.question,
      type: q.type,
      options: q.options ?? null,
      correct_answer: q.correct_answer,
    }));

    const { error: questionError } = await supabase
      .from("questions")
      .insert(questionsToInsert);

    if (questionError) {
      return Response.json({ error: questionError.message }, { status: 500 });
    }

    return Response.json({
      quizId: quizData.id,
    });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
