# Contributor Guide

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

---

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

#### テストのやり方

```bash
amplify mock # モック環境の起動

# 以下は別shellで実施。テスト用のリクエストsrc/post-empty.jsonを読み込んで実行。
amplify mock function profilea2218c7f

? Provide the path to the event JSON object relative to /.../projects/code-for-japan/Footprint-Jibungoto/amplify/backend/function/profilea2218c7f src/post-empty.json

```
