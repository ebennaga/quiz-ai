import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } },
) {
  const { data, error } = await supabase
    .from("questions")
    .select("id, question, type, options, correct_answer")
    .eq("quiz_id", params.quizId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ questions: data });
}
