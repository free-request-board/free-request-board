import AccountClient from "./AccountClient";

export default function AccountPage() {
  return (
    <main className="panel">
      <h1>アカウント</h1>
      <p className="muted">
        ログインしている場合は、メールアドレスに紐づいた依頼・申請・一時連絡をここに表示していく予定です。
      </p>

      <AccountClient />

     <section id="temporary-contact" className="account-section">
  <h2>一時連絡</h2>
  <p>
    依頼に関する連絡を一時的に行えます。
  </p>
  <p className="muted">
    ※あくまでも、ユーザーが匿名のまま連絡先を交換するための連絡機能ですので、メールや電話といった連絡ツールで相談することをおすすめします。
    情報量が多くなると、サーバーが不安定になる可能性があります。他の利用者様への思いやりをよろしくお願いいたします。
  </p>
  <div className="notice">
    まだ依頼を何も受けていないか、あなたの依頼が引き受けられていません。
  </div>
</section>

      <section id="accepted-requests" className="account-section">
        <h2>受けた依頼</h2>
        <div className="notice">
          現在、あなたが受けた依頼は表示されていません。
        </div>
      </section>

      <section id="my-requests" className="account-section">
        <h2>自分の依頼</h2>
        <div className="notice">
          現在、あなたのアカウントに紐づいた依頼は表示されていません。
        </div>
      </section>
    </main>
  );
}
