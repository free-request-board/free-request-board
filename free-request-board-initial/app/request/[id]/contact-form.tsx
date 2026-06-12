"use client";

import { useState } from "react";

type SavedApplication = {
  title: string;
  applicationUrl: string;
  savedAt: string;
};

export default function ContactForm({ requestId }: { requestId: string }) {
  const [result, setResult] = useState<{ applicationUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function saveApplicationUrl(title: string, applicationUrl: string) {
    const key = "my_application_links";

    try {
      const currentText = window.localStorage.getItem(key);
      const current: SavedApplication[] = currentText
        ? JSON.parse(currentText)
        : [];

      const next: SavedApplication[] = [
        {
          title,
          applicationUrl,
          savedAt: new Date().toISOString(),
        },
        ...current.filter((item) => item.applicationUrl !== applicationUrl),
      ];

      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // localStorageが使えない場合でも、申請自体は成功させます。
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    form.set("request_id", requestId);

    const applicantName = String(form.get("applicant_name") ?? "").trim();
    const email = String(form.get("applicant_email") ?? "").trim();
    const phone = String(form.get("applicant_phone") ?? "").trim();
    const other = String(form.get("applicant_other_contact") ?? "").trim();

    const contactLines = [
      email ? `メールアドレス：${email}` : "",
      phone ? `電話番号：${phone}` : "",
      other ? `その他の連絡方法：${other}` : "",
    ].filter(Boolean);

    if (contactLines.length === 0) {
      setError("メールアドレス、電話番号、その他の連絡方法のいずれかを入力してください。");
      setLoading(false);
      return;
    }

    form.set("applicant_contact", contactLines.join("\n"));

    const res = await fetch("/api/applications", {
      method: "POST",
      body: form,
    });

    const json = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "送信に失敗しました");
      return;
    }

    if (json.applicationUrl) {
      saveApplicationUrl(applicantName || "申請した依頼", json.applicationUrl);
    }

    setResult({ applicationUrl: json.applicationUrl });
  }

  if (result) {
    return (
      <div className="notice">
        <h2>申請を送りました</h2>

        <p>
          返信確認用のリンクです。保存してください。依頼者からの返信は、
          ホームの「申請した依頼を確認する」ボタンからも確認できます。
        </p>

        <p>
          IDが変わったり、ブラウザの履歴、Cookie、サイトデータを削除したりすると、
          申請内容を確認できなくなる場合があります。
        </p>

        <p>
          <a href={result.applicationUrl}>{result.applicationUrl}</a>
        </p>

        <p>
          この申請は、この端末・このブラウザの「申請した依頼を確認する」ページにも保存されました。
        </p>

        <div className="actions">
          <a className="button" href="/">
            一覧へ戻る
          </a>

          <a className="button secondary" href="/my-applications">
            申請した依頼を確認する
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div>
        <label>表示名（件名）</label>
        <input
          name="applicant_name"
          required
          placeholder="例：近所の者です、手伝えます"
        />
      </div>

      <div>
        <label>
          メールアドレス
          <span className="field-help">
            依頼者が連絡を取るために使います。入力できる場合は記載してください。
          </span>
        </label>
        <input
          name="applicant_email"
          type="email"
          placeholder="例：example@example.com"
        />
      </div>

      <div>
        <label>
          電話番号
          <span className="field-help">
            メールが使えない場合に備えて、電話番号も記載しておくことをおすすめします。
          </span>
        </label>
        <input
          name="applicant_phone"
          type="tel"
          placeholder="例：090-0000-0000"
        />
      </div>

      <div>
        <label>
          その他の連絡方法
          <span className="field-help">
            LINE、SNS、その他の連絡方法があれば記載してください。
          </span>
        </label>
        <input
          name="applicant_other_contact"
          placeholder="例：LINE、X、その他の連絡方法など"
        />
      </div>

      <div>
        <label>依頼者へのメッセージ</label>
        <textarea
          name="message"
          required
          placeholder="対応できること、希望条件、気になることなどを書いてください"
        />
      </div>

      {error && <p className="warning">{error}</p>}

      <button className="button" disabled={loading}>
        {loading ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
