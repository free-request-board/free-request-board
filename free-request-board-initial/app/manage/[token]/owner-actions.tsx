"use client";

export default function OwnerActions({ token, requestId, status }: { token: string; requestId: string; status: string }) {
  async function closeRequest() {
    if (!confirm("依頼を終了しますか？")) return;
    await fetch("/api/requests/close", {
      method: "POST",
      body: JSON.stringify({ token, requestId }),
      headers: { "Content-Type": "application/json" }
    });
    location.reload();
  }

  async function deleteRequest() {
    if (!confirm("依頼と関連データを削除しますか？元に戻せません。")) return;
    await fetch("/api/requests/delete", {
      method: "POST",
      body: JSON.stringify({ token, requestId }),
      headers: { "Content-Type": "application/json" }
    });
    location.href = "/";
  }

  return (
    <div className="actions">
      {status === "open" && <button className="button secondary" onClick={closeRequest}>取引終了にする</button>}
      <button className="button secondary" onClick={deleteRequest}>削除する</button>
    </div>
  );
}
