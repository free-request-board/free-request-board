import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "なんでも依頼掲示板",
  description:
    "個々人の依頼をその程度が大きいものから小さいものまで幅広く掲示できる掲示板です。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <a href="/" className="home-button" aria-label="ホームに戻る">
              <span className="home-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 10.8L12 3l9 7.8"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 10.5V21h13V10.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 21v-6h5v6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>ホーム</span>
            </a>

            <nav className="header-links" aria-label="サイトメニュー">
              <a href="/contact-admin">管理人へ質問する</a>
              <a href="/help">ヘルプ</a>
            </nav>
          </header>

          {children}

          <footer className="site-footer">
            <p>
              個人の依頼を掲示しその受注（引受け）ができる掲示板・コミュニティです。
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
