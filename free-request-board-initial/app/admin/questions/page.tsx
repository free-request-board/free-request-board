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
  archived_at: string | null;
};

export default function AdminQuestionsPage() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [showArchive, setShowArchive] = useState(false);
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
          .select("id, name, contact, body, status, created_at, archived_at")
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

  async function archiveQuestion(id: string) {
    const now = new Date().toISOString();

    const { error } = await supabaseBrowser
      .from("admin_questions")
      .update({
        status: "archived",
        archived_at: now,
      })
      .eq("id", id);

    if (error) {
      setMessage("アーカイブできませんでした：" + error.message);
      return;
    }

    setQuestions((current) =>
      current.map((question) =>
        question.id === id
          ? { ...question, status: "archived", archived_at: now }
          : question
      )
    );
  }

  async function deleteQuestion(id: string) {
    const confirmed = window.confirm("この質問を削除しますか？");

    if (!confirmed) return;

    const { error } = await supabaseBrowser
      .from("admin_questions")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("削除できませんでした：" + error.message);
      return;
    }

    setQuestions((current) =>
      current.filter((question) => question.id !== id)
    );
  }

  const visibleQuestions = questions.filter((question) => {
    if (showArchive) {
      return question.status === "archived";
    }

    return question.status !== "archived";
  });

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
          利用者から送られた質問を確認できます。確認済みの質問はアーカイブに移動できます。
        </p>

        <div className="actions">
          <button
            className={!showArchive ? "button" : "button secondary"}
            type="button"
            onClick={() => setShowArchive(false)}
          >
            未確認・対応中を見る
          </button>

          <button
            className={showArchive ? "button" : "button secondary"}
            type="button"
            onClick={() => setShowArchive(true)}
          >
            アーカイブを見る
          </button>
        </div>

        {message && <p className="notice">{message}</p>}

        {visibleQuestions.length === 0 ? (
          <p className="notice">
            {showArchive
              ? "現在、アーカイブ済みの質問はありません。"
              : "現在、未確認・対応中の質問はありません。"}
          </p>
        ) : (
          <div className="request-list">
            {visibleQuestions.map((question) => (
              <article key={question.id} className="request-card">
                <h2>
                  {question.status === "archived"
                    ? "アーカイブ済みの質問"
                    : "未確認・対応中の質問"}
                </h2>

                <p className="meta">
                  送信日時：
                  {new Date(question.created_at).toLocaleString("ja-JP")}
                </p>

                {question.archived_at && (
                  <p className="meta">
                    アーカイブ日時：
                    {new Date(question.archived_at).toLocaleString("ja-JP")}
                  </p>
                )}

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

                <div className="actions">
                  {question.status !== "archived" && (
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => archiveQuestion(question.id)}
                    >
                      確認済みにしてアーカイブ
                    </button>
                  )}

                  {question.status === "archived" && (
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => deleteQuestion(question.id)}
                    >
                      削除する
                    </button>
                  )}
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
