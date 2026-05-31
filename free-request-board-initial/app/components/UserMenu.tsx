"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

type UserState = {
  email: string | null;
  loading: boolean;
};

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserState>({
    email: null,
    loading: true
  });

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data } = await supabaseBrowser.auth.getUser();

      if (!mounted) return;

      setUser({
        email: data.user?.email ?? null,
        loading: false
      });
    }

    loadUser();

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        setUser({
          email: session?.user?.email ?? null,
          loading: false
        });
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const label = user.loading
    ? "確認中"
    : user.email
      ? user.email
      : "ユーザー / 未認証";

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="account-button"
        onClick={() => setOpen(!open)}
        aria-label="アカウントメニューを開く"
      >
        <span className="account-icon">人</span>
      </button>

      {open && (
        <div className="account-panel">
          <div className="account-status">
            <p className="account-panel-title">アカウント</p>
            <p className="account-user-label">{label}</p>
          </div>

          <a href="/account" className="account-menu-item">
            <strong>アカウントページ</strong>
            <span>ログイン状態やメール認証を確認します。</span>
          </a>

          <a href="/new" className="account-menu-item">
            <strong>依頼をする</strong>
            <span>困りごとや手伝ってほしいことを投稿します。</span>
          </a>

          <a href="/" className="account-menu-item">
            <strong>依頼を見る</strong>
            <span>掲載中の依頼を確認します。</span>
          </a>

          <a href="/account#temporary-contact" className="account-menu-item">
            <strong>一時連絡</strong>
            <span>成立した依頼関係がある場合だけ使える私信箱です。</span>
          </a>

          <a href="/account#accepted-requests" className="account-menu-item">
            <strong>受けた依頼を確認する</strong>
            <span>自分が引き受けた依頼を確認します。</span>
          </a>

          <a href="/account#my-requests" className="account-menu-item">
            <strong>自分の依頼を確認する</strong>
            <span>自分が投稿した依頼を確認します。</span>
          </a>
        </div>
      )}
    </div>
  );
}
