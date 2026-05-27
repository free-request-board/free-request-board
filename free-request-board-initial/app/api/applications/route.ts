import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { makeToken } from "@/lib/tokens";

export async function POST(request: Request) {
  const form = await request.formData();
  const request_id = String(form.get("request_id") ?? "").trim();
  const applicant_name = String(form.get("applicant_name") ?? "").trim();
  const applicant_contact = String(form.get("applicant_contact") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (!request_id || !applicant_name || !applicant_contact || !message) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  const applicant_token = makeToken("app");

  const { error } = await supabaseAdmin.from("applications").insert({
    request_id,
    applicant_name,
    applicant_contact,
    message,
    applicant_token
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const url = new URL(request.url);
  const applicationUrl = `${url.origin}/application/${applicant_token}`;
  return NextResponse.json({ applicationUrl });
}
