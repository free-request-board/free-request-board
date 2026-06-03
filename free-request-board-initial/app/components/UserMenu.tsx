"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

type UserState = {
  email: string | null;
  loading: boolean;
};

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path
        d="M4.5 20c1.2-4.2 4-6.2 7.5-6.2s6.3 2 7.5 6.2"
        fill="currentColor"
      />
    </svg>
  );
}

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<UserState>({
    email: null,
    loading: true,
  });

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data } = await supabaseBrowser.auth.getUser();

      if (!mounted) return;

      setUser({
        email: data.user?.email ?? null,
        loading: false,
      });
    }

    loadUser();

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        setUser({
          email: session?.user?.email ?? null,
          loading: false,
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

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
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
        <span className="account-icon" aria-hidden="true">
          <PersonIcon />
        </span>
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

          <a href="/account/profile" className="account-menu-item">
            <strong>プロフィールを編集する</strong>
            <span>表示名・在住都道府県名（交通費込みの報酬相談などで重宝します）・自己紹介を設定します。</span>
          </a>

          <a href="/contact-admin" className="account-menu-item">
            <strong>管理人へ質問する</strong>
            <span>ログインできない場合や使い方について相談できます。</span>
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
            <span>依頼に関する連絡を一時的に行えます。</span>
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
