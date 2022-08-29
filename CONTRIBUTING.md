# Contributor Guide

## アーキテクチャ

### 全体構成

![アーキテクチャ全体構成](doc/img/archtecture.png)

### バックエンド実装方案選定の考え方

#### 経緯

- 様々な主体からカーボンフットプリントの計算に対しての需要があり、それをオープンソース化したい。
- 上記を実現する手段として、計算関数を Code for Japan がホストする API にして公開し、開発者が使いやすい状態にする方案を採用。
- また、API 単体ではの使い方のイメージがつかず広めていくことは難しいため、個人のカーボンフットプリントと削減施策を算出する「じぶんごとプラネット」としてユースケースも同時に作る。

#### 実装方案選定の前提条件

- Code for Japan で使える aws の環境があるためバックエンド環境は aws を採用。
- 計算関数は、基本的にはテーブルルックアップ主体のロジックで、負荷の高い計算は行わないことから lambda で実装する方案を採用。
- データベースはキー読み、JSON の保存ができればよく、複雑なデータの結合は必要ないため dynamodb を採用。
- API は初期バージョンでは REST、将来的には GraphQL もサポートしたい。

上記の前提で開発を効率的に進めるため、本プロジェクトでは aws Amplify を採用。

## バックエンドの開発

### 前提条件

開発には、node, yarn, java, amplify が必要です。node, yarn は最新バージョン、java はバージョン 8 以上をインストールして下さい。なお、m1 mac の場合は JDK の 16.0.1 のバージョンでないとうまく動きません（2022 年 6 月時点）。また、amplify cli のバージョンは 8.3.1 にあわせて下さい（2022 年 6 月時点）。インストールされているバージョンは以下で確認できます。また、aws cli も必要に応じてインストール下さい。

```bash
node -v; yarn -v; java --version; amplify --version; aws --version
# 以下は実行結果の例
v16.13.0 # Node.jsのバージョン
1.22.17 # yarnのバージョン、npmでなくyarnを使って下さい。
openjdk 16.0.1 2021-04-20 # 注：M1 Macの場合はこのバージョンでないとうまく動きません（2020/6/11現在）。
OpenJDK Runtime Environment (build 16.0.1+9-24)
OpenJDK 64-Bit Server VM (build 16.0.1+9-24, mixed mode, sharing)
8.3.1 # amplifyのバージョン
aws-cli/2.7.7 Python/3.9.11 Darwin/21.5.0 exe/x86_64 prompt/off # aws cliのバージョン
```

### ローカルのでの開発方法

#### 環境構築

Amplify Studio にユーザー登録する必要がありますので、Owner/Contributor に相談下さい。本リポジトリを fork して、開発環境に pull した後、以下のコマンドで amplify のバックエンド環境を pull して下さい。[appId]は Amplify Studio の右上のメニューから確認できます。

```bash
amplify pull --appId [appId] --envName dev
```

#### DynamoDB/GraphQL の構築方法

amplify/backend/api/JibungotoPlanetGql/schema.graphql に DynamoDB のスキーマを定義すると、DynamoDB のデータベースと GraphQL の CRUD インターフェースが自動生成されます。また`amplify mock`コマンドでクライアント上に DynamoDB と GraphQL のモック環境が立ち上がります。[http://localhost:20002](http://localhost:20002)にアクセスすると GraphiQL のインターフェースから GraphQL のインターフェースにアクセスできます（2022 年 6 月時点、m1 mac の場合は firefox でないと一部表示がうまく出ません）。

なお、モック環境の DynamoDB を初期化したい場合は、amplify/mock-data フォルダ以下を削除して下さい。

データのインポートは dynamodb-csv をインストールして実行します。data 以下にインストール用、モック環境へのデータインポート用のスクリプトを用意しています。

```bash
cd data
./install.sh
./load-local.sh # モック環境のDynamoDBへデータを読み込み。
```

#### REST API の作り方

Amplify で DynamoDB にアクセスする lambda の REST API を開発するためには、

1. REST API でアクセスする DynamoDB を import する。
2. REST API を追加する。
3. インポートした DynamoDB へのアクセス権を設定する。

上記の３ステップが必要です。以下、Profile-dikfjlx7xncgpo5s3xzv5x56ie-dev という DynamoDB のテーブルにアクセスする、profilea2218c7f という名前の lambda を作成する例です。アクセスするテーブルを増やす場合は、`amplify update function`コマンドを実行ください。

```bash
$ amplify import storage

? Select from one of the below mentioned services: DynamoDB table - NoSQL Database
✔ Select the DynamoDB Table you want to import: · Parameter-dikfjlx7xncgpo5s3xzv5x56ie-dev

✅ DynamoDB Table 'Parameter-dikfjlx7xncgpo5s3xzv5x56ie-dev' was successfully imported.

Next steps:
- This resource can now be accessed from REST APIs (`amplify add api`) and Functions (`amplify add function`)

$ amplify import storage

? Select from one of the below mentioned services: DynamoDB table - NoSQL Database
✔ Select the DynamoDB Table you want to import: · Profile-dikfjlx7xncgpo5s3xzv5x56ie-dev

✅ DynamoDB Table 'Profile-dikfjlx7xncgpo5s3xzv5x56ie-dev' was successfully imported.

Next steps:
- This resource can now be accessed from REST APIs (`amplify add api`) and Functions (`amplify add function`)

$ amplify add api

? Select from one of the below mentioned services: REST
✔ Would you like to add a new path to an existing REST API: (y/N) · no
✔ Provide a friendly name for your resource to be used as a label for this category in the project: · profilea2218c7f

✔ Provide a path (e.g., /book/{isbn}): · /profiles/{id}
✔ Choose a Lambda source · Create a new Lambda function
? Provide an AWS Lambda function name: profilea2218c7f
? Choose the runtime that you want to use: NodeJS
? Choose the function template that you want to use: CRUD function for DynamoDB (Integrati
on with API Gateway)
? Choose a DynamoDB data source option Use DynamoDB table configured in the current Amplif
y project
? Choose from one of the already configured DynamoDB tables Profiledikfjlx7xncgpo5s3xzv5x5
6iedev

Available advanced settings:
- Resource access permissions
- Scheduled recurring invocation
- Lambda layers configuration
- Environment variables configuration
- Secret values configuration

? Do you want to configure advanced settings? No
? Do you want to edit the local lambda function now? No
Successfully added resource profilea2218c7f locally.

Next steps:
Check out sample function code generated in <project-dir>/amplify/backend/function/profile/src
"amplify function build" builds all of your functions currently in the project
"amplify mock function <functionName>" runs your function locally
To access AWS resources outside of this Amplify app, edit the /.../projects/code-for-japan/Footprint-Jibungoto/amplify/backend/function/profile/custom-policies.json
"amplify push" builds all of your local backend resources and provisions them in the cloud
"amplify publish" builds all of your local backend and front-end resources (if you added hosting category) and provisions them in the cloud
✅ Successfully added the Lambda function locally
✔ Restrict API access? (Y/n) · no
✔ Do you want to add another path? (y/N) · no
✅ Successfully added resource profile locally

✅ Some next steps:
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

```

#### lambda の開発

[Amplify Function を TypeScript で開発し、ESLint, Prettier で解析する CI/CD 環境](https://qiita.com/t-kurasawa/items/3275d37053f4b0bea983)に基づいて Typescript の環境を整備してもらいました！amplify/backend/function/[function 名]/lib にある typescript のコードを編集下さい。

#### テストのやり方（mock での簡易テスト）

```bash
amplify mock # モック環境の起動

# 以下は別shellで実施。テスト用のリクエストsrc/post-empty.jsonを読み込んで実行。
amplify mock function profilea2218c7f

? Provide the path to the event JSON object relative to /.../projects/code-for-japan/Footprint-Jibungoto/amplify/backend/function/profilea2218c7f src/post-empty.json

```

#### テストのやり方(jest+supertest)

jest+supertest でのローカルテスト環境を構築しています。以下のパッケージを導入しました。

```bash
yarn add --dev jest ts-jest supertest eslint-plugin-jest @types/jest @types/supertest
```

.eslintrc.json の extends に"plugin:jest/recommended", plugins に"jest"を追加します。.eslintrc.json は以下のようになります。

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "plugin:jest/recommended", "prettier"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "jest"],
  "root": true,
  "rules": {}
}
```

tsconfig.json をプロジェクトルートに作成します。内容は以下です。

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

jest.config.js をプロジェクトルートに作成します。内容は以下です。

```javascript
module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
}
```

package.json の scripts にテストを実行するコマンドを追加します。`yarn test`で事前準備を全て実行してテスト、`yarn jest`で事前準備をスキップしてテストを実施します。テストコードを修正しただけの場合は、`yarn jest`の実行で十分です。

```json
  "scripts": {
    ... 中略
    "amplify:footprintf523f2c8": "cd amplify/backend/function/footprintf523f2c8 && tsc -p ./tsconfig.json && cd -",
    "amplify:profilea2218c7f": "cd amplify/backend/function/profilea2218c7f && tsc -p ./tsconfig.json && cd -",
    "amplify:shareb311c853": "cd amplify/backend/function/shareb311c853 && tsc -p ./tsconfig.json && cd -",
    "tc:all": "yarn amplify:footprintf523f2c8 && yarn amplify:profilea2218c7f && yarn amplify:shareb311c853",
    "yarn:footprintf523f2c8": "cd amplify/backend/function/footprintf523f2c8/src && yarn && cd -",
    "yarn:profilea2218c7f": "cd amplify/backend/function/profilea2218c7f/src && yarn && cd -",
    "yarn:shareb311c853": "cd amplify/backend/function/shareb311c853/src && yarn && cd -",
    "yarn:all": "yarn && yarn yarn:footprintf523f2c8 && yarn yarn:profilea2218c7f && yarn yarn:shareb311c853",
    "test": "yarn yarn:all && yarn tc:all && jest",
    "jest": "jest",
    ... 中略
  }
```

現状、lambda のソースは app.js でクライアントからのリクエストを listen していますが、テスト時に listen があると不都合なことから、app.js の以下のコードを index.js へ移行します。

```javascript
app.listen(3000, function () {
  console.log('App started')
})
```

`src/tests`にテストコードを保存します。`amplify mock`を別シェルで実行後、`yarn test`もしくは`yarn jest`を実行下さい。

#### テストツール

テストの効率化のため、Excel からテストケース、期待する結果を読み込んで検証する仕組みを構築しました。`src/tests/xxx-xxx-test-cases.xlsx`の answers シートにテストケース（xxxAnswer の値を設定）を作成し、case 名と同じ名前のシートに期待する結果を記入します。一行目が黄色の列のデータを取り込み、テストを実施します。

> **Note**
> github に push する際は `yarn test` が動くため、`amplify mock`で mock 環境を立ち上げておいてください。

## バックエンドの運用方法

### Amplify の環境

以下の３つの環境を用意していますが、運用においては後述する課題があります。
|環境|名前|用途|
|---|---|---|
|dev|開発環境|主にバックエンドの開発用に利用|
|stg|テスト環境|主にフロントエンドの開発用に利用|
|prd|本番環境|本番で利用|

### データの更新方法

Footprint, Parameter, Option のデータは data/aws フォルダの `load-dev.sh`, `load-stg.sh`, `load-prd.sh` スクリプトを実行することで各環境のデータを更新できます。各テーブルのデータを全削除して再ロードします。左記のスクリプトを実行するためには、data/aws/config.ini に AWS_ACCESS_KEY_ID, AWS_SECRET_KEY, REGION を設定する必要があります。data/aws/sample.config.ini にサンプルの設定を記載していますでコピーして書き換えて下さい。

各々のスクリプトでは、`data/footprint.csv`, `data/parameter.csv`, `data/option.csv` をテーブルにロードしますが、これらの csv ファイルは別途管理する Excel ファイルから生成されます。注意事項としては、

- ロードに使っている dynamodb-csv が対応する文字コードは UTF8 になります。Excel が出力する UTF8 は BOM 付き UTF8 で、dynamodb-csv では読めません。
- 上記から、parameter.csv ファイルを生成する際は、日本語が含まれていますので一旦 Shift JIS の csv ファイルで保存してもらい、テキストエディタ等 UTF8 に変換して下さい。

### 特記事項

#### dynamodb のテーブル名

GraphQL と REST で同じ dynamodb を参照するため、Amplify が自動生成する dynamodb のテーブルを REST から参照・更新する構成にしています。自動生成されたテーブル名のためかなり長い名前になります。

| 環境 | テーブル名                               | 説明                                               |
| ---- | ---------------------------------------- | -------------------------------------------------- |
| dev  | Footprint-3uyvqum6jrc4pf63cde7njsxei-dev | フットプリントの数量、原単位の全国標準情報         |
| dev  | Parameter-3uyvqum6jrc4pf63cde7njsxei-dev | 個人のフットプリントの計算に必要なパラメーター情報 |
| dev  | Option-3uyvqum6jrc4pf63cde7njsxei-dev    | 削減施策を計算するためのパラメータ情報             |
| dev  | Profile-3uyvqum6jrc4pf63cde7njsxei-dev   | 個人のフットプリントの計算結果を保存               |
| stg  | Footprint-epwhhio5abgdthpzpwfkaox4ba-stg | フットプリントの数量、原単位の全国標準情報         |
| stg  | Parameter-epwhhio5abgdthpzpwfkaox4ba-stg | 個人のフットプリントの計算に必要なパラメーター情報 |
| stg  | Option-epwhhio5abgdthpzpwfkaox4ba-stg    | 削減施策を計算するためのパラメータ情報             |
| stg  | Profile-epwhhio5abgdthpzpwfkaox4ba-stg   | 個人のフットプリントの計算結果を保存               |
| prd  | Footprint-z6dhum3edrgfpb2gc4mmjdexpu-prd | フットプリントの数量、原単位の全国標準情報         |
| prd  | Parameter-z6dhum3edrgfpb2gc4mmjdexpu-prd | 個人のフットプリントの計算に必要なパラメーター情報 |
| prd  | Option-z6dhum3edrgfpb2gc4mmjdexpu-prd    | 削減施策を計算するためのパラメータ情報             |
| prd  | Profile-z6dhum3edrgfpb2gc4mmjdexpu-prd   | 個人のフットプリントの計算結果を保存               |

#### lambda から dynamodb へのアクセス設定

REST API から上記の dynamodb へアクセスする場合は`amplify update function`で上記のテーブルへのアクセス権を付与する必要があります（dev, stg, prd 各々に設定する必要があります）。アクセス権の設定は lambda への環境変数で渡されますが（ソースコードの`/* Amplify Params - DO NOT EDIT ... Amplify Params - DO NOT EDIT */`内に記載されています）、アクセスするテーブル数が多いと環境変数の容量制限に引っかかります。

profile 編集用の lambda(profilea2218c7f)がこの制約に引っかかっており、3 つの環境へのアクセス設定ができない状況です。現状は dev はアクセス可能な状況にしておいて、stg に`amplify push`する際は stg のテーブルにアクセス許可を付与し、prd に`amplify push`するときは stg のテーブルへのアクセス許可を解除して、prd へのアクセス許可を付与する設定変更を実施しています。開発が落ち着いたら stg は廃止して、dev, prd の２環境で運用保守を進めることで上記の問題は解消できます。

## 残課題

- parameter テーブル、option テーブルについては更新頻度も少なく、データとして他の用途に流用することもないので、json に変換して、lambda のプログラムの一部として読みこむ方案も考えられる。これにより dynamodb へのアクセスが減りレスポンスも向上する。
