# wikipedian

Wikipedia　を検索する discord スラッシュコマンド。

![聖徳太子を検索している様子](/docs/wikipedian_usage.png)

# 使い方

- `/wikipedia word: 伊藤博文` : 「伊藤博文」を日本語版Wikipedia で検索した結果を表示
- `/wikipedia word: Taylor Swift languages: en` : 「Taylor Swift」を英語版 Wikipediaで検索した結果を表示
- `/wikipedia word: Taylor Swift languages: en,fr` : 「Taylor Swift」を英語版とフランス語版 Wikipedia で検索した結果を表示


# インストール手順

## 実行要件

- インターネットに疎通できるどこかのマシンの上でアプリを動かしっぱなしにできる。
    - node.jsが入っている必要あり。

## 事前準備


### repositoryの初期化

1. このrepositoryを動かしたいマシンで `git clone https://github.com/yuchiki/wikipedian.git` する。
2. 生成されたrepository内で`npm install`する

## 秘匿情報の取得

1. [discord のapplication 管理リンク](https://discord.com/developers/applications)から、application を作成する。
2. 以下の情報をメモする
    - 作ったapplicationのGeneral Informationタブに書かれている `application id` を押すと得られる `クライアントID`
    - 作ったapplicationの OAuth2タブの Client Secretの下の`Reset Secret`を押すと生成できる `トークン`
2. OAuth タブの URL Generatorから、`applicaitons.commands` にチェックを入れてURLを生成し、そのURLに飛ぶ
3. 追加するサーバーを選び、applicationを追加する。
4. 以下の情報をメモする
    - discordを開き、当該サーバーのアイコンを右クリックして出てくる `IDをコピー`というメニューを押すと得られる `サーバー ID`
5. repository内に以下の内容の.envファイルを作成する

```env
WIKIPEDIAN_CLIENT_ID=先ほどメモしたクライアントID
WIKIPEDIAN_GUILD_IDS=先ほどメモしたサーバーID　（複数のサーバーにapplicationを追加した場合は、空白を入れない「,」区切りで羅列する）
WIKIPEDIAN_TOKEN=先ほどメモしたトークン
```

## コマンド登録

`npm run register_commands` と打つ 
    - 「Successfully registered application commands.」　と表示されればOK
    
## アプリを動かす

### 簡易的な方法

`npm run start &` と打つ
