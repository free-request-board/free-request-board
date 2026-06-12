import NewRequestForm from "./request-form";

export default function NewRequestPage() {
  return (
    <main className="panel">
      <h1>依頼を投稿する</h1>

      <p className="muted">
        連絡先は管理人が緊急時のみ確認します。公開されません。
      </p>

      <p className="muted">
        依頼を引き受けた方（引受人）へ自身の連絡先を伝えたい場合は、自身の依頼管理画面から、「返信する」ボタンを押してそこに記載してください。依頼受注の申請があった方に届きます。
      </p>

      <p className="muted">
        また、投稿後に表示される管理リンクは、あなたがこの投稿を削除したり、
        依頼の受注状況を確認するのに不可欠なものです。保存してください。
      </p>

      <div className="notice">
        <p>
          自分の依頼は「自分の依頼を確認する」ボタンから逐次確認してください。
        </p>

        <p>
          依頼を受注した方から申請があります。連絡先等が記載されています。
        </p>

        <p>
          引受人、受注者のIDが変わり、うまく申請が届かない場合もございます。
          逐次コメントもご確認ください。
        </p>

        <p>
          もし、IDが変わってしまって自分の依頼を確認できなくなった場合は、
          コメントにその旨を記載し、新しく依頼を掲示してください。
        </p>
      </div>

      <NewRequestForm />
    </main>
  );
}
