import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { chunkText } from "@/lib/chunk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const { text, documentId } = await req.json();

  const chunks = chunkText(text);

  for (const chunk of chunks) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
    });

    await supabase.from("pdf_embeddings").insert({
      document_id: documentId,
      content: chunk,
      embedding: embedding.data[0].embedding,
    });
  }

  return Response.json({ success: true });
}
