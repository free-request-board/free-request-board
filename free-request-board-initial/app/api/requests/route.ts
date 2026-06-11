import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { makeToken } from "../../../lib/tokens";

export async function POST(request: Request) {
  const form = await request.formData();

  const title = String(form.get("title") ?? "").trim();
  const area = String(form.get("area") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const owner_contact = String(form.get("owner_contact") ?? "").trim();

  if (!title || !area || !body || !owner_contact) {
    return NextResponse.json(
      { error: "必須項目が不足しています" },
      { status: 400 }
    );
  }

  const owner_token = makeToken("owner");

  const { error } = await supabaseAdmin.from("requests").insert({
    title,
    area,
    body,
    reward: String(form.get("reward") ?? "").trim() || null,
    desired_time: String(form.get("desired_time") ?? "").trim() || null,
    skills: String(form.get("skills") ?? "").trim() || null,
    risk_notes: String(form.get("risk_notes") ?? "").trim() || null,
    nickname: String(form.get("nickname") ?? "").trim() || null,
    owner_contact,
    owner_token,
    status: "open",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const url = new URL(request.url);
  const manageUrl = `${url.origin}/manage/${owner_token}`;

  return NextResponse.json({ manageUrl });
}
