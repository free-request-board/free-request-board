"use client";

import { useEffect, useState } from "react";

type SavedRequest = {
  title: string;
  manageUrl: string;
  savedAt: string;
};

export default function MyRequestsPage() {
  const [items, setItems] = useState<SavedRequest[]>([]);

  useEffect(() => {
    const text = window.localStorage.getItem("my_request_manage_links");
    setItems(text ? JSON.parse(text) : []);
  }, []);

  function removeItem(manageUrl: string) {
    const next = items.filter((item) => item.manageUrl !== manageUrl);
    setItems(next);
    window.localStorage.setItem("my_request_manage_links", JSON.stringify(next));
  }

  return (
    <main>
      <section className="panel">
        <h1>自分の依頼を確認する</h1>

        <p className="muted">
          この端末・このブラウザで投稿した依頼の管理リンクを表示します。
          ブラウザの履歴、Cookie、サイトデータを削除すると、この一覧も消える場合があります。
        </p>

        {items.length === 0 ? (
          <p className="notice">
            このブラウザには、保存された依頼管理リンクがありません。
          </p>
        ) : (
          <div className="request-list">
            {items.map((item) => (
              <article className="request-card" key={item.manageUrl}>
                <h2>{item.title}</h2>

                <p className="muted">
                  保存日時：{new Date(item.savedAt).toLocaleString("ja-JP")}
                </p>

                <div className="actions">
                  <a className="button" href={item.manageUrl}>
                    管理画面を開く
                  </a>

                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => removeItem(item.manageUrl)}
                  >
                    この一覧から消す
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <p>
          <a href="/">ホームへ戻る</a>
        </p>
      </section>
    </main>
  );
}
