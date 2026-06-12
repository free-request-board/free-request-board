"use client";

import { useState } from "react";

type SavedRequest = {
  title: string;
  manageUrl: string;
  savedAt: string;
};

export default function NewRequestForm() {
  const [result, setResult] = useState<{ manageUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function saveManageUrl(title: string, manageUrl: string) {
    const key = "my_request_manage_links";

    try {
      const currentText = window.localStorage.getItem(key);
      const current: SavedRequest[] = currentText ? JSON.parse(currentText) : [];

      const next: SavedRequest[] = [
        {
          title,
          manageUrl,
          savedAt: new Date().toISOString(),
        },
        ...current.filter((item) => item.manageUrl !== manageUrl),
      ];

      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // localStorageが使えない場合でも、投稿自体は成功させます。
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const title = String(form.get("title") ?? "").trim();

    const res = await fetch("/api/requests", { method: "POST", body: form });
    const json = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "投稿に失敗しました");
      return;
    }

    if (json.manageUrl) {
      saveManageUrl(title || "無題の依頼", json.manageUrl);
    }

    setResult({ manageUrl: json.manageUrl });
  }

  if (result) {
    return (
      <div className="notice">
        <h2>依頼を投稿しました</h2>

        <p>
          このリンクを保存してください。依頼の終了・削除、申請確認に使います。
          ホームの「自分の依頼を確認する」ボタンからも同じリンクに飛べます。
        </p>

        <p>
          IDが変更されると自分の依頼を操作、申請の確認ができなくなります。
          できなくなった場合は、掲示中の依頼のコメントに掲示終了と書き込み、
          新たに依頼を立ち上げてください。
        </p>

        <p>
          <a href={result.manageUrl}>{result.manageUrl}</a>
        </p>

        <p className="warning">このリンクを他人に見せないでください。</p>

        <p>
          この依頼は、この端末・このブラウザの「自分の依頼を確認する」ページにも保存されました。
        </p>

        <div className="actions">
          <a className="button" href="/">
            一覧へ戻る
          </a>

          <a className="button secondary" href="/my-requests">
            自分の依頼を確認する
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div>
        <label>依頼タイトル</label>
        <input name="title" required placeholder="例：猫を探しています" />
      </div>

      <div>
        <label>地域</label>
        <input name="area" required placeholder="例：大阪市北区周辺" />
      </div>

      <div>
        <label>依頼内容</label>
        <textarea
          name="body"
          required
          placeholder="依頼内容を自由に書いてください"
        />
      </div>

      <div className="grid">
        <div>
          <label>報酬・謝礼</label>
          <input
            name="reward"
            placeholder="例：3,000円、相談、昼食あり"
          />
        </div>

        <div>
          <label>希望日時</label>
          <input
            name="desired_time"
            placeholder="例：今週中、土日、相談"
          />
        </div>
      </div>

      <div>
        <label>必要な技術・資格</label>
        <input
          name="skills"
          placeholder="例：特になし、軽トラがある方、力仕事に慣れている方"
        />
      </div>

      <div>
        <label>危険性・注意点</label>
        <input
          name="risk_notes"
          placeholder="例：階段あり、重いものあり、屋外作業"
        />
      </div>

      <div className="grid">
        <div>
          <label>表示名</label>
          <input
            name="nickname"
            placeholder="例：依頼者A、匿名希望"
          />
        </div>

        <div>
          <label>
            連絡先
            <span className="field-help">
              先述した通り、管理人が緊急時のみ確認する連絡先です。
              サイト上には非公開です。
            </span>
          </label>
          <input
            name="owner_contact"
            required
            placeholder="メールアドレスまたは電話番号"
          />
        </div>
      </div>

      {error && <p className="warning">{error}</p>}

      <button className="button" disabled={loading}>
        {loading ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}
