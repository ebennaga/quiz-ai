import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { extractText } from '@/lib/extrac-text';
import { chunkText } from '@/lib/chunk';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) throw new Error('File tidak ditemukan');

    const buffer = await file.arrayBuffer();
    const text = await extractText(file, buffer);

    const supabase = await createSupabaseServerClient();

    // 1️⃣ Simpan document
    const { data: doc } = await supabase
      .from('documents')
      .insert({
        filename: file.name,
      })
      .select()
      .single();

    // 2️⃣ Chunking
    const chunks = chunkText(text);

    // 3️⃣ Embedding
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunks,
    });

    // 4️⃣ Simpan chunks
    const rows = chunks.map((content, i) => ({
      document_id: doc.id,
      content,
      embedding: embeddingRes.data[i].embedding,
    }));

    await supabase.from('pdf_chunks').insert(rows);

    return NextResponse.json({
      success: true,
      documentId: doc.id,
      filename: file.name,
      numChunks: chunks.length,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const maxDuration = 30;
