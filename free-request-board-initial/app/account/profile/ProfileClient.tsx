"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";

type Profile = {
  id: string;
  display_name: string | null;
  icon_type: string;
  bio: string | null;
  area: string | null;
};

const iconOptions = [
  { value: "person", label: "人" },
  { value: "house", label: "家" },
  { value: "tool", label: "工具" },
  { value: "cat", label: "猫" },
  { value: "bag", label: "買い物" },
  { value: "bike", label: "自転車" },
  { value: "leaf", label: "葉っぱ" },
];

export default function ProfileClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [iconType, setIconType] = useState("person");
  const [bio, setBio] = useState("");
  const [area, setArea] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);

      const { data: userData, error: userError } = await supabaseBrowser.auth.getUser();

      if (userError || !userData.user) {
        setMessage("プロフィールを編集するにはログインが必要です。");
        setLoading(false);
        return;
      }

      const currentUser = userData.user;
      setUserId(currentUser.id);
      setEmail(currentUser.email ?? "");

      const { data, error } = await supabaseBrowser
        .from("profiles")
        .select("id, display_name, icon_type, bio, area")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) {
        setMessage("プロフィールの読み込みに失敗しました：" + error.message);
        setLoading(false);
        return;
      }

      if (data) {
        const profile = data as Profile;
        setDisplayName(profile.display_name ?? "");
        setIconType(profile.icon_type ?? "person");
        setBio(profile.bio ?? "");
        setArea(profile.area ?? "");
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      setMessage("ログイン状態を確認できませんでした。もう一度ログインしてください。");
      return;
    }

    setSaving(true);
    setMessage("保存しています。");

    const { error } = await supabaseBrowser.from("profiles").upsert({
      id: userId,
      display_name: displayName.trim() || null,
      icon_type: iconType,
      bio: bio.trim() || null,
      area: area.trim() || null,
      last_seen_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      setMessage("保存に失敗しました：" + error.message);
      return;
    }

    setMessage("プロフィールを保存しました。");
  }

  if (loading) {
    return (
      <main>
        <section className="panel">
          <h1>プロフィール編集</h1>
          <p>読み込み中です。</p>
        </section>
      </main>
    );
  }

  if (!userId) {
    return (
      <main>
        <section className="panel">
          <h1>プロフィール編集</h1>
          <p>{message}</p>
          <a className="button" href="/account">
            ログインページへ
          </a>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="panel">
        <h1>プロフィール編集</h1>
        <p className="muted">
          掲示板上で表示される名前やアイコンを設定できます。メールアドレスは公開されません。
        </p>

        <div className="notice">
          <strong>ログイン中：</strong> {email}
        </div>

        <form onSubmit={saveProfile} className="form-stack">
          <label>
            表示名
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="例：大阪の手伝い人"
              maxLength={40}
            />
          </label>

          <label>
            アイコン
            <select value={iconType} onChange={(event) => setIconType(event.target.value)}>
              {iconOptions.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            対応地域
            <input
              value={area}
              onChange={(event) => setArea(event.target.value)}
              placeholder="例：大阪市内、北摂、関西圏など"
              maxLength={80}
            />
          </label>

          <label>
            自己紹介
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="できること、得意なこと、連絡時に伝えておきたいことなど"
              rows={5}
              maxLength={300}
            />
          </label>

          <button className="button" type="submit" disabled={saving}>
            {saving ? "保存中です" : "プロフィールを保存する"}
          </button>
        </form>

        {message && <p className="notice">{message}</p>}

        <p>
          <a href="/account">アカウントページへ戻る</a>
        </p>
      </section>
    </main>
  );
}
