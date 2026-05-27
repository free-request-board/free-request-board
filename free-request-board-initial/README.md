# free-request-board

関西圏向けの小さな依頼掲示板の初期版です。

## 必要な環境変数

Vercel の Environment Variables に以下を入れてください。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

`SUPABASE_SERVICE_ROLE_KEY` は絶対に `NEXT_PUBLIC_` を付けないでください。

## Supabase 側の準備

`supabase/schema.sql` を Supabase の SQL Editor に貼り付けて実行してください。

## 仕組み

- 依頼は公開されます。
- 依頼者の連絡先は公開されません。
- 引受希望者は「この依頼に連絡する」から申請します。
- 依頼者は、投稿後に表示される管理リンクで申請内容を確認できます。
- 申請者は、申請後に表示される控えリンクで返信を確認できます。
- 連絡先交換や支払いは当事者間で行います。
