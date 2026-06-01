"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

export default function AccountClient() {
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("確認中です。");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabaseBrowser.auth.getUser();

      if (data.user?.email) {
        setCurrentEmail(data.user.email);
        setMessage("ログイン中です。");
      } else {
        setCurrentEmail(null);
        setMessage("現在は未認証ユーザーです。");
      }
    }

    loadUser();

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user?.email) {
          setCurrentEmail(session.user.email);
          setMessage("ログイン中です。");
        } else {
          setCurrentEmail(null);
          setMessage("現在は未認証ユーザーです。");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loginWithEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("ログイン用メールを送信しています。");

    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/account"
      }
    });

    setLoading(false);

    if (error) {
      setMessage("送信に失敗しました：" + error.message);
      return;
    }

    setMessage("ログイン用メールを送信しました。メール内のリンクを押してください。");
  }

  async function logout() {
    setLoading(true);
    await supabaseBrowser.auth.signOut();
    setLoading(false);
    setCurrentEmail(null);
    setMessage("ログアウトしました。");
  }

  return (
    <section className="account-section">
      <h2>ログイン状態</h2>

      <div className="notice">
        <p>{message}</p>
        <p>
          <strong>現在の表示：</strong>
          {currentEmail ? currentEmail : "ユーザー / 未認証"}
        </p>
      </div>

      {!currentEmail ? (
        <form className="form account-login-form" onSubmit={loginWithEmail}>
          <div>
            <label>メールアドレス</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="メールアドレスを入力"
            />
          </div>

          <button className="button" disabled={loading}>
            {loading ? "送信中..." : "メールでログインする"}
          </button>
        </form>
      ) : (
        <button className="button secondary" onClick={logout} disabled={loading}>
          ログアウト
        </button>
      )}
    </section>
  );
}
