import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ hasDocument: false }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("documents")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (error) {
    return NextResponse.json({ hasDocument: false }, { status: 500 });
  }

  return NextResponse.json({
    hasDocument: data.length > 0,
  });
}
