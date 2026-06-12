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
          掃除、片付け、買い物、空き家確認、軽作業、探しもの相談など、個人の小さな困りごとから大きな困りごとまで幅広く投稿できる掲示板です。
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

      <div className="notice">
  <strong>ご利用前にご確認ください</strong>
  <ul>
    <li>この掲示板は、同じ端末・同じブラウザでの利用を前提にしています。</li>
    <li>ブラウザの履歴、Cookie、サイトデータを削除すると、匿名IDが変わる場合があります。</li>
    <li>連絡先は掲示板上に直接書かず、依頼者への依頼引き受けの申請時に申請内容としてご記載ください。</li>
    <li>申請と申請内容の記載は、掲示板上の依頼の詳細を確認するをクリックすると「この依頼に連絡する」ボタンが現れるので、クリックすると申請できます。</li>
    <li>依頼内容、報酬、日時、危険性などは当事者同士でよく確認してください。</li>
  </ul>
</div>

<div className="actions">
  <a href="/new" className="button">
    依頼を投稿する
  </a>

  <a href="/my-requests" className="button secondary">
    自分の依頼を確認する
  </a>
</div>

<section className="panel">
  <h2>依頼の流れ</h2>

  <ol>
    <li>依頼者が依頼を投稿します。</li>

    <li>
      引き受けたい人が、依頼ページのコメントで質問します。
    </li>

    <li>
      引受人が「この依頼に連絡する」ボタンから、依頼引き受けの申請をします。
    </li>

    <li>
      依頼人が申請を確認し、記載されている連絡先を用いて申請者へ連絡を取ります。
      または「返信する」ボタンから、申請内容について確認します。
      記載された連絡先で相談することをおすすめします。
      本サイトでは履歴が消える可能性があり、セキュリティ面から見ても外部サービスでの相談を推奨します。
    </li>

    <li>
      双方の合意が固まり次第、依頼成立です。
      依頼人は掲示板上の本件依頼を削除するか、
      管理人に削除を申請してください。
      管理人への削除申請は、ホームの「管理人へ質問する」ボタンから行えます。
    </li>
  </ol>

  <p>
    <a href="/help">詳しい使い方を見る</a>
  </p>
</section>
      
<p className="muted">
  下へスクロールすると、掲載中の依頼を確認できます。
</p>

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
