"use client";

import { useState } from "react";

export default function ContactForm({ requestId }: { requestId: string }) {
  const [result, setResult] = useState<{ applicationUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    form.set("request_id", requestId);
    const res = await fetch("/api/applications", { method: "POST", body: form });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "送信に失敗しました");
      return;
    }
    setResult({ applicationUrl: json.applicationUrl });
  }

  if (result) {
    return (
      <div className="notice">
        <h2>申請を送りました</h2>
        <p>返信確認用のリンクです。保存してください。依頼者からの返信は、ホームの「申請した依頼を確認する」のボタンからも確認できます。</p>
        <p><a href={result.applicationUrl}>{result.applicationUrl}</a></p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div><label>表示名</label><input name="applicant_name" required placeholder="例：近所の者です、手伝えます" /></div>
      <div><label>依頼者と連絡する連絡先（電話番号とメールアドレスは記載推奨（依頼者が使えない連絡サービスがあるため））</label><input name="applicant_contact" required placeholder="メールアドレスまたは電話番号、その他には各種サービス（LINEなど）を記載" /></div>
      <div><label>依頼者へのメッセージ</label><textarea name="message" required placeholder="対応できること、希望条件、気になることなどを書いてください" /></div>
      {error && <p className="warning">{error}</p>}
      <button className="button" disabled={loading}>{loading ? "送信中..." : "送信する"}</button>
    </form>
  );
}
