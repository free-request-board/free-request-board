import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import OwnerActions from "./owner-actions";

export const dynamic = "force-dynamic";

export default async function ManagePage({ params }: { params: { token: string } }) {
  const { data: req, error } = await supabaseAdmin
    .from("requests")
    .select("*")
    .eq("owner_token", params.token)
    .single();

  if (error || !req) notFound();

  const { data: apps } = await supabaseAdmin
    .from("applications")
    .select("*, messages(*)")
    .eq("request_id", req.id)
    .order("created_at", { ascending: false });

  return (
    <main>
      <section className="panel">
        <h1>依頼管理</h1>
        <p><strong>{req.title}</strong></p>
        <p className="muted">このページは管理リンクを持つ人だけが見られます。</p>
        <OwnerActions token={params.token} requestId={req.id} status={req.status} />
      </section>

      <section className="panel">
        <h2>届いた申請</h2>
        {!apps || apps.length === 0 ? (
          <p>まだ申請はありません。</p>
        ) : (
          apps.map((app: any) => (
            <div className="message" key={app.id}>
              <h3>{app.applicant_name}</h3>
              <p>{app.message}</p>
              <p className="muted">非公開連絡先：{app.applicant_contact}</p>
              <details>
                <summary>この人とのメッセージ箱</summary>
                {(app.messages ?? []).sort((a:any,b:any)=>a.created_at.localeCompare(b.created_at)).map((m: any) => (
                  <div className="message" key={m.id}>
                    <strong>{m.sender_role === "owner" ? "依頼者" : "申請者"}：</strong>{m.body}
                  </div>
                ))}
                <form className="form" action="/api/messages" method="post">
                  <input type="hidden" name="token" value={params.token} />
                  <input type="hidden" name="role" value="owner" />
                  <input type="hidden" name="request_id" value={req.id} />
                  <input type="hidden" name="application_id" value={app.id} />
                  <textarea name="body" required placeholder="返信を書く" />
                  <button className="button">返信する</button>
                </form>
              </details>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
