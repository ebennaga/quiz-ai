import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { embedding } = await req.json();

    if (!embedding) {
      return NextResponse.json(
        { error: "Embedding tidak ditemukan" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("match_pdf_chunks", {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 8,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      context: data.map((d: any) => d.content).join("\n"),
      matches: data,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
