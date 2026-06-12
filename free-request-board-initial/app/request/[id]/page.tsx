import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import ContactForm from "./contact-form";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, error } = await supabaseAdmin
    .from("requests")
    .select(
      "id,title,area,body,reward,desired_time,skills,risk_notes,nickname,status,created_at"
    )
    .eq("id", params.id)
    .eq("status", "open")
    .single();

  if (error || !data) notFound();

  return (
    <main>
      <article className="request-card">
        <h1>{data.title}</h1>

        <div className="meta">
          <span className="tag">{data.area}</span>
          {data.reward && <span className="tag">報酬：{data.reward}</span>}
          {data.desired_time && (
            <span className="tag">希望：{data.desired_time}</span>
          )}
        </div>

        <p>{data.body}</p>

        {data.skills && (
          <p>
            <strong>必要な技術・資格：</strong>
            {data.skills}
          </p>
        )}

        {data.risk_notes && (
          <p>
            <strong>危険性・注意点：</strong>
            {data.risk_notes}
          </p>
        )}
      </article>

      <section className="panel">
        <h2>この依頼に連絡する</h2>

        <p className="muted">
          依頼者が申請内容を確認します。
          連絡先を書いておかなければ、依頼者が連絡を取れません。
          連絡先は電話番号とメールアドレスの二種を記載しておくことをおすすめします。
        </p>

        <ContactForm requestId={data.id} />
      </section>
    </main>
  );
}
