import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function ApplicationPage({ params }: { params: { token: string } }) {
  const { data: app, error } = await supabaseAdmin
    .from("applications")
    .select("*, requests(title, area), messages(*)")
    .eq("applicant_token", params.token)
    .single();

  if (error || !app) notFound();

  return (
    <main className="panel">
      <h1>申請控え</h1>
      <p><strong>{app.requests?.title}</strong> / {app.requests?.area}</p>
      <p>あなたの申請文：</p>
      <div className="message">{app.message}</div>

      <h2>メッセージ箱</h2>
      {(app.messages ?? []).length === 0 ? (
        <p>まだ返信はありません。</p>
      ) : (
        (app.messages ?? []).sort((a:any,b:any)=>a.created_at.localeCompare(b.created_at)).map((m: any) => (
          <div className="message" key={m.id}>
            <strong>{m.sender_role === "owner" ? "依頼者" : "申請者"}：</strong>{m.body}
          </div>
        ))
      )}

      <form className="form" action="/api/messages" method="post">
        <input type="hidden" name="token" value={params.token} />
        <input type="hidden" name="role" value="applicant" />
        <input type="hidden" name="request_id" value={app.request_id} />
        <input type="hidden" name="application_id" value={app.id} />
        <textarea name="body" required placeholder="返信を書く" />
        <button className="button">返信する</button>
      </form>
    </main>
  );
}
