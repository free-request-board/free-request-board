"use client";

import { useState } from "react";

export default function NewRequestForm() {
  const [result, setResult] = useState<{ manageUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/requests", { method: "POST", body: form });
    const json = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "投稿に失敗しました");
      return;
    }

    setResult({ manageUrl: json.manageUrl });
  }

  if (result) {
    return (
      <div className="notice">
        <h2>依頼を投稿しました</h2>

        <p>
          この管理リンクを保存してください。依頼の終了・削除、申請確認に使います。
        </p>

        <p>
          <a href={result.manageUrl}>{result.manageUrl}</a>
        </p>

        <p className="warning">このリンクを他人に見せないでください。</p>

        <a className="button" href="/">
          一覧へ戻る
        </a>
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
            非公開連絡先
            <span className="field-help">
              管理人が非常時のみ確認する連絡先です。サイト上には公開されません。
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

.field-help {
  display: block;
  margin-top: 6px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 400;
  color: #667085;
  line-height: 1.6;
}

.header-links {
  display: flex;
  gap: 16px;
  align-items: center;
}
