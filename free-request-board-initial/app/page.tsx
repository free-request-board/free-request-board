import { supabaseAdmin } from "../lib/supabaseAdmin";
import AnonymousAuth from "./components/AnonymousAuth";

type RequestRow = {
  id: string;
  title: string;
  area: string;
  body: string;
  reward: string | null;
  desired_time: string | null;
  skills: string | null;
  risk_notes: string | null;
  nickname: string | null;
  status: string;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data, error } = await supabaseAdmin
    .from("requests")
    .select("id,title,area,body,reward,desired_time,skills,risk_notes,nickname,status,created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    return <main className="panel"><h1>読み込みに失敗しました</h1><p>{error.message}</p></main>;
  }

  const requests = (data ?? []) as RequestRow[];

  return (
    <main>
      <section className="hero">
        <h1>小さな依頼を、気軽に掲示できます。</h1>
        <p className="muted">
          掃除、片付け、買い物、空き家確認、軽作業、探しもの相談など、地域の小さな困りごとを投稿できる試験運用中の掲示板です。
        </p>

        <AnonymousAuth />
      </section>

      <section className="panel">
        <h2>安心してご利用いただくために</h2>
        <p>
          依頼内容、条件、報酬、日時、必要な技術や危険性については、依頼者と引き受ける方の間でよく確認してください。
          公序良俗に反しない範囲で、秩序あるご利用をお願いします。
        </p>
        <p>
          特別な技術や危険が伴う依頼については、必要な資格・道具・作業範囲・危険性を事前に確認し、双方の合意のうえで進めてください。
        </p>
      </section>

      <section>
        <h2>掲載中の依頼</h2>
        {requests.length === 0 ? (
          <div className="panel">
            <p>現在、掲載中の依頼はありません。</p>
            <a className="button secondary" href="/new">依頼を投稿する</a>
          </div>
        ) : (
          <div className="request-list">
            {requests.map((r) => (
              <article className="request-card" key={r.id}>
                <h2>{r.title}</h2>
                <div className="meta">
                  <span className="tag">{r.area}</span>
                  {r.reward && <span className="tag">報酬：{r.reward}</span>}
                  {r.desired_time && <span className="tag">希望：{r.desired_time}</span>}
                </div>
                <details className="details">
                  <summary>詳細を見る</summary>
                  <p>{r.body}</p>
                  {r.skills && <p><strong>必要な技術・資格：</strong>{r.skills}</p>}
                  {r.risk_notes && <p><strong>危険性・注意点：</strong>{r.risk_notes}</p>}
                  <div className="actions">
                    <a className="button" href={`/request/${r.id}`}>この依頼に連絡する</a>
                  </div>
                </details>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
