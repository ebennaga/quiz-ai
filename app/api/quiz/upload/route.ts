import { NextResponse } from "next/server";
import OpenAI from "openai";
import { extractText } from "@/lib/extrac-text";
import { chunkText } from "@/lib/chunk";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ✅ Service role client (bypass RLS)
const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1️⃣ Extract text
    const buffer = await file.arrayBuffer();
    const text = await extractText(file, buffer);

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "PDF kosong atau gagal diekstrak" },
        { status: 400 },
      );
    }

    // 2️⃣ Simpan document
    const { data: doc, error: docError } = await serviceSupabase
      .from("documents")
      .insert({
        user_id: userId,
        filename: file.name,
      })
      .select()
      .single();

    if (docError || !doc) {
      return NextResponse.json(
        { error: docError?.message || "Gagal simpan document" },
        { status: 500 },
      );
    }

    // 3️⃣ Chunking
    const chunks = chunkText(text);

    if (chunks.length === 0) {
      return NextResponse.json({ error: "Chunk kosong" }, { status: 400 });
    }

    // 4️⃣ Generate embeddings
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks,
    });

    // 5️⃣ Simpan chunks
    const rows = chunks.map((content, i) => ({
      document_id: doc.id,
      content,
      embedding: embeddingRes.data[i].embedding,
    }));

    const { error: chunkError } = await serviceSupabase
      .from("pdf_chunks")
      .insert(rows);

    if (chunkError) {
      console.error("CHUNK INSERT ERROR:", chunkError);
      return NextResponse.json({ error: chunkError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      documentId: doc.id,
      filename: file.name,
      numChunks: chunks.length,
    });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const maxDuration = 30;
