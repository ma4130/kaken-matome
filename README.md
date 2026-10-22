# KAKEN まとめ

これまでに作ったウェブサイトの一覧ページです。

公開URL: https://ma4130.github.io/kaken-matome/

## サイトを追加する

`sites.json` に1件追加して push するだけです。上から順に表示されます。

```json
{
  "title": "サイトの名前",
  "url": "https://ma4130.github.io/xxxx/",
  "desc": "ひとことの説明",
  "tags": ["ゲーム", "カメラ操作"]
}
```

- `title` と `url` は必須。`desc` と `tags` は省略できます。
- 画像を出したいときは `"thumb": "画像のURL"` を足します（なければ頭文字の色付きカードになります）。
- 前の項目との間の `,`（カンマ）を忘れないように。
