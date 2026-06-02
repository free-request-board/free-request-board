"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("ログイン確認中です。");

  useEffect(() => {
    async function handleLoginCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error } = await supabaseBrowser.auth.exchangeCodeForSession(code);

        if (error) {
          setMessage("ログイン処理に失敗しました：" + error.message);
          return;
        }

        setMessage("ログインしました。アカウントページへ移動します。");

        setTimeout(() => {
          router.replace("/account");
        }, 800);

        return;
      }

      const { data } = await supabaseBrowser.auth.getSession();

      if (data.session) {
        setMessage("ログインしました。アカウントページへ移動します。");

        setTimeout(() => {
          router.replace("/account");
        }, 800);

        return;
      }

      setMessage("ログイン確認情報が見つかりませんでした。もう一度ログインをお試しください。");
    }

    handleLoginCallback();
  }, [router]);

  return (
    <main className="panel">
      <h1>ログイン確認</h1>
      <p>{message}</p>
    </main>
  );
}
