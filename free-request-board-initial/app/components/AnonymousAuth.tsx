"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

export default function AnonymousAuth() {
  const [anonymousId, setAnonymousId] = useState("");

  useEffect(() => {
    async function setupAnonymousUser() {
      const { data: sessionData } = await supabaseBrowser.auth.getSession();

      if (sessionData.session?.user) {
        setAnonymousId(sessionData.session.user.id.slice(0, 8));
        return;
      }

      const { data, error } = await supabaseBrowser.auth.signInAnonymously();

      if (error) {
        console.error("匿名IDの作成に失敗しました", error.message);
        return;
      }

      if (data.user) {
        setAnonymousId(data.user.id.slice(0, 8));
      }
    }

    setupAnonymousUser();
  }, []);

  if (!anonymousId) {
    return null;
  }

  return (
    <div className="notice">
      あなたの匿名ID：{anonymousId}
    </div>
  );
}
