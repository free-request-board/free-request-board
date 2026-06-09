"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

export default function AnonymousAuth() {
  const [status, setStatus] = useState("匿名IDを確認しています。");
  const [anonymousId, setAnonymousId] = useState("");

  useEffect(() => {
    async function setupAnonymousUser() {
      try {
        const { data: sessionData, error: sessionError } =
          await supabaseBrowser.auth.getSession();

        if (sessionError) {
          setStatus("匿名IDの確認に失敗しました：" + sessionError.message);
          return;
        }

        if (sessionData.session?.user) {
          setAnonymousId(sessionData.session.user.id.slice(0, 8));
          setStatus("");
          return;
        }

        const { data, error } = await supabaseBrowser.auth.signInAnonymously();

        if (error) {
          setStatus("匿名IDの作成に失敗しました：" + error.message);
          return;
        }

        if (data.user) {
          setAnonymousId(data.user.id.slice(0, 8));
          setStatus("");
          return;
        }

        setStatus("匿名IDを取得できませんでした。");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "原因不明のエラーです。";

        setStatus("匿名IDの処理中にエラーが起きました：" + errorMessage);
      }
    }

    setupAnonymousUser();
  }, []);

  return (
    <div className="notice">
      {anonymousId ? (
        <>
          あなたの匿名ID：<strong>{anonymousId}</strong>
        </>
      ) : (
        status
      )}
    </div>
  );
}
