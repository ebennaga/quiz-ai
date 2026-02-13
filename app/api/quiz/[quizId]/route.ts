import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(
  req: Request,
  context: { params: Promise<{ quizId: string }> },
) {
  const { quizId } = await context.params;

  const { data, error } = await supabase
    .from("questions")
    .select("id, question, type, options, correct_answer")
    .eq("quiz_id", quizId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ questions: data });
}
