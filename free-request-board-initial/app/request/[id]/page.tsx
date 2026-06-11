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

        <p className="notice">
          依頼の取引終了後に依頼の掲示を削除するか、
          「管理人へ質問する」ボタンから、管理人に削除してほしい旨をお伝えください。
        </p>

        <p className="notice">
          申請者から申請内容と一緒に、連絡先、メールアドレスや電話番号が送られます。
          もしわからないことや、その連絡方法が難しい場合は、コメントか、
          「申請者へ返信する」ボタンの内容にその旨をご記載ください。
        </p>
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
