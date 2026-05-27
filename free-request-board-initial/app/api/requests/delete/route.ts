import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const { token, requestId } = await request.json();
  const { error } = await supabaseAdmin
    .from("requests")
    .delete()
    .eq("id", requestId)
    .eq("owner_token", token);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
