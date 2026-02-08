# wikipedian

Wikipedia　を検索する discord スラッシュコマンド。

![聖徳太子を検索している様子](/docs/wikipedian_usage.png)

# 使い方

- `/wikipedia word: 伊藤博文` : 「伊藤博文」を日本語版Wikipedia で検索した結果を表示
- `/wikipedia word: Taylor Swift languages: en` : 「Taylor Swift」を英語版 Wikipediaで検索した結果を表示
- `/wikipedia word: Taylor Swift languages: en,fr` : 「Taylor Swift」を英語版とフランス語版 Wikipedia で検索した結果を表示

# インストール手順

## 実行要件

以下のどちらかが必要

- node.jsが動かせるサーバー
- dockerが動かせるサーバー

## 秘匿情報の取得

1. [discord のapplication 管理リンク](https://discord.com/developers/applications)から、application を作成する。
2. 以下の情報をメモする
    - 作ったapplicationのGeneral Informationタブに書かれている `application id` を押すと得られる `クライアントID`
    - 作ったapplicationの OAuth2タブの Client Secretの下の`Reset Secret`を押すと生成できる `トークン`
2. OAuth タブの URL Generatorから、`applicaitons.commands` にチェックを入れてURLを生成し、そのURLに飛ぶ
3. 追加するサーバーを選び、applicationを追加する。
4. repository内に以下の内容の.envファイルを作成する

```env
WIKIPEDIAN_CLIENT_ID=先ほどメモしたクライアントID
WIKIPEDIAN_TOKEN=先ほどメモしたトークン
```

## 実行(kubernetes を用いる場合)

1. `kubectl create secret generic wikipedian-secret --from-env-file=../.env` でsecretを作成

2. [manifests/wikipedian.yaml](/manifests/wikipedian.yaml)を `kubectl apply -f wikipedian.yaml` でdeploy

## 実行(docker を用いる場合)

`docker pull ghcr.io/yuchiki/wikipedian/wikipedian:latest` を実行。

### コマンド登録

`docker run  --env-file=.env ghcr.io/yuchiki/wikipedian/wikipedian register_commands` と打つ
    - 「Successfully registered application commands.」　と表示されればOK

(kubernetes なら init container にすればよさそう)

### アプリを動かす

`docker run  --env-file=.env ghcr.io/yuchiki/wikipedian/wikipedian` と打つ

## 実行(dockerを用いない場合)

node.js が入っている必要がある

### repositoryの初期化

1. このrepositoryを動かしたいマシンで `git clone https://github.com/yuchiki/wikipedian.git` する。
2. 生成されたrepository内で`npm install`する
3. さらに `npm run tsc` する

### コマンド登録

`npm run register_commands` と打つ

### アプリを動かす

`npm run start &` と打つなど
