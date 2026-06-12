import NewRequestForm from "./request-form";

export default function NewRequestPage() {
  return (
    <main className="panel">
      <h1>依頼を投稿する</h1>

      <p className="muted">
        連絡先は公開されません。投稿後に表示される管理リンクを保存してください。
      </p>

      <p className="notice">
        自分の依頼を「自分の依頼を確認する」ボタンから逐次確認してください。
        もし、IDが変わってしまって自分の依頼を確認できなくなった場合は、
        コメントにその旨を記載し、新しく依頼を掲示してください。
      </p>

      <NewRequestForm />
    </main>
  );
}
