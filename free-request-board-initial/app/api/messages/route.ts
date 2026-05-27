import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  const role = String(form.get("role") ?? "");
  const request_id = String(form.get("request_id") ?? "");
  const application_id = String(form.get("application_id") ?? "");
  const body = String(form.get("body") ?? "").trim();

  if (!token || !role || !request_id || !application_id || !body) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  if (role === "owner") {
    const { data } = await supabaseAdmin.from("requests").select("id").eq("id", request_id).eq("owner_token", token).single();
    if (!data) return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  } else if (role === "applicant") {
    const { data } = await supabaseAdmin.from("applications").select("id").eq("id", application_id).eq("applicant_token", token).single();
    if (!data) return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  } else {
    return NextResponse.json({ error: "roleが不正です" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("messages").insert({
    request_id,
    application_id,
    sender_role: role,
    body
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const url = new URL(request.url);
  if (role === "owner") redirect(`/manage/${token}`);
  redirect(`/application/${token}`);
}
