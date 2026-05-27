import NewRequestForm from "./request-form";

export default function NewRequestPage() {
  return (
    <main className="panel">
      <h1>依頼を投稿する</h1>
      <p className="muted">
        連絡先は公開されません。投稿後に表示される管理リンクを保存してください。
      </p>
      <NewRequestForm />
    </main>
  );
}
