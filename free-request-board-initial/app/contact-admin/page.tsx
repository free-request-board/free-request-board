"use client";

import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

export default function ContactAdminPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function sendQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!body.trim()) {
      setMessage("質問内容を入力してください。");
      return;
    }

    try {
      setSending(true);
      setMessage("送信しています。");

      const { error } = await supabaseBrowser.from("admin_questions").insert({
        name: name.trim() || null,
        contact: contact.trim() || null,
        body: body.trim(),
      });

      if (error) {
        setMessage("送信に失敗しました：" + error.message);
        return;
      }

      setName("");
      setContact("");
      setBody("");
      setMessage("送信しました。管理人からの返信をお待ちください。");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "原因不明のエラーです。";

      setMessage("送信中にエラーが起きました：" + errorMessage);
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <section className="panel">
        <h1>管理人への質問</h1>

        <p className="muted">
          サイトの使い方、ログインできない場合、依頼の投稿方法などについて管理人へ連絡できます。
          メールアドレスでのログインは不要です。
        </p>

        <form onSubmit={sendQuestion} className="form-stack">
          <label>
            <span>お名前・呼び名</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="例：質問者、近所の利用者など"
              maxLength={40}
            />
          </label>

          <label>
            <span>返信先・連絡先 任意</span>
            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="メール、電話番号、その他の連絡方法など"
              maxLength={120}
            />
          </label>

          <label>
            <span>質問内容</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="質問したい内容を書いてください。"
              rows={8}
              maxLength={1000}
            />
          </label>

          <button className="button" type="submit" disabled={sending}>
            {sending ? "送信中です" : "管理人へ送信する"}
          </button>
        </form>

        {message && <p className="notice">{message}</p>}

        <p>
          <a href="/">ホームへ戻る</a>
        </p>
      </section>
    </main>
  );
}
