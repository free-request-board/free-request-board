"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";

type AdminQuestion = {
  id: string;
  name: string | null;
  contact: string | null;
  body: string;
  status: string;
  created_at: string;
};

export default function AdminQuestionsPage() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        setMessage("");

        const { data: userData } = await supabaseBrowser.auth.getUser();

        if (!userData.user) {
          setMessage("管理人としてログインしてください。");
          setLoading(false);
          return;
        }

        const { data, error } = await supabaseBrowser
          .from("admin_questions")
          .select("id, name, contact, body, status, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          setMessage("質問一覧を読み込めませんでした：" + error.message);
          setLoading(false);
          return;
        }

        setQuestions((data ?? []) as AdminQuestion[]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "原因不明のエラーです。";

        setMessage("読み込み中にエラーが起きました：" + errorMessage);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  async function markAsRead(id: string) {
    const { error } = await supabaseBrowser
      .from("admin_questions")
      .update({ status: "read" })
      .eq("id", id);

    if (error) {
      setMessage("既読にできませんでした：" + error.message);
      return;
    }

    setQuestions((current) =>
      current.map((question) =>
        question.id === id ? { ...question, status: "read" } : question
      )
    );
  }

  if (loading) {
    return (
      <main>
        <section className="panel">
          <h1>管理人への質問一覧</h1>
          <p>読み込み中です。</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="panel">
        <h1>管理人への質問一覧</h1>

        <p className="muted">
          利用者から送られた質問を確認できます。このページは管理人用です。
        </p>

        {message && <p className="notice">{message}</p>}

        {questions.length === 0 ? (
          <p className="notice">現在、質問は届いていません。</p>
        ) : (
          <div className="request-list">
            {questions.map((question) => (
              <article key={question.id} className="request-card">
                <h2>
                  {question.status === "read" ? "確認済み" : "未確認"}の質問
                </h2>

                <p className="meta">
                  送信日時：
                  {new Date(question.created_at).toLocaleString("ja-JP")}
                </p>

                <p>
                  <strong>お名前・呼び名：</strong>
                  {question.name || "未入力"}
                </p>

                <p>
                  <strong>返信先・連絡先：</strong>
                  {question.contact || "未入力"}
                </p>

                <div className="details">
                  <strong>質問内容</strong>
                  <p>{question.body}</p>
                </div>

                {question.status !== "read" && (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => markAsRead(question.id)}
                  >
                    確認済みにする
                  </button>
                )}
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
