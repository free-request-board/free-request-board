"use client";

import { useEffect, useState } from "react";

type SavedApplication = {
  title: string;
  applicationUrl: string;
  savedAt: string;
};

export default function MyApplicationsPage() {
  const [items, setItems] = useState<SavedApplication[]>([]);

  useEffect(() => {
    const text = window.localStorage.getItem("my_application_links");
    setItems(text ? JSON.parse(text) : []);
  }, []);

  function removeItem(applicationUrl: string) {
    const next = items.filter((item) => item.applicationUrl !== applicationUrl);
    setItems(next);
    window.localStorage.setItem("my_application_links", JSON.stringify(next));
  }

  return (
    <main>
      <section className="panel">
        <h1>申請した依頼を確認する</h1>

        <p className="muted">
          この端末・このブラウザで申請した依頼の確認リンクを表示します。
          ブラウザの履歴、Cookie、サイトデータを削除すると、この一覧も消える場合があります。
        </p>

        {items.length === 0 ? (
          <p className="notice">
            このブラウザには、保存された申請確認リンクがありません。
          </p>
        ) : (
          <div className="request-list">
            {items.map((item) => (
              <article className="request-card" key={item.applicationUrl}>
                <h2>{item.title}</h2>

                <p className="muted">
                  保存日時：{new Date(item.savedAt).toLocaleString("ja-JP")}
                </p>

                <div className="actions">
                  <a className="button" href={item.applicationUrl}>
                    申請確認画面を開く
                  </a>

                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => removeItem(item.applicationUrl)}
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
