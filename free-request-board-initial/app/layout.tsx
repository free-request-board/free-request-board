import type { Metadata } from "next";
import "./globals.css";
import UserMenu from "./components/UserMenu";

export const metadata: Metadata = {
  title: "関西 小さな依頼掲示板",
  description: "関西圏の小さな困りごと・お手伝い依頼を投稿できる掲示板です。依頼者の連絡先は公開されません。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <a href="/" className="brand">関西 小さな依頼掲示板</a>
            <nav>
              <UserMenu />
            </nav>
          </header>
          {children}
          <footer className="site-footer">
            <p>地域の小さな依頼を、気軽に投稿できる試験運用中の掲示板です。</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
