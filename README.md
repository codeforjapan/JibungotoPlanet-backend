# ジブンゴト Planet バックエンド

ジブンゴト Planet のバックエンドのプロジェクトです。個人のカーボンフットプリントを推定するアンケートのための API を提供します。

## REST API

REST API のエンドポイントは Owner に問合せ下さい。

### 個人のカーボンフットプリントプロフィールの作成

空の JSON を渡すと空のプロフィールが作成されます。また、質問への回答を併せて POST するとプロフィールを計算して返します。レスポンスの中に[id]が記載されていますので、以降の更新用に localStorage や cookie に保存して下さい。

```bash
POST [REST API endpoint]/profiles
```

### 質問への回答の更新

POST で返されるレスポンスの中に[id]が記載されています。その[id]をキーに回答を更新して下さい。

```bash
PUT [REST API endpoint]/profiles/[id]
```

### カーボンフットプリントプロフィールの取得

```bash
GET [REST API endpoint]/profiles/[id]
```

### カーボンフットプリントプロフィールの取得（シェア用）

POST で返されるレスポンスの中に[shareId]も記載されています。その[shareId]をキーにシェア用の情報を取得して下さい。

```bash
GET [REST API endpoint]/shares/[shareId]
```

### ベースラインデータの取得

各々の domain(housing|mobility|food|other) のベースライン情報を取得します。

```bash
GET [REST API endpoint]/footprints/baseline/[domain]
```

### リクエストとレスポンスの内容

[schema.graphql](amplify/backend/api/JibungotoPlanetGql/schema.graphql)の Profile の定義を確認下さい。2022 年 6 月現在、JSON 形式のみサポートされています。なお、シェア用には各種回答情報と[id]が削除されたレスポンスが返ります。

### Profile の baselines, estimations, actions の使い方

Profile に個人のカーボンフットプリントの推定結果が格納されています。

- baselines: 2015 年の日本全国の平均値。全ての domain_item の値が格納されています。
- estimations: 回答結果に基づき計算された個人の活動量、原単位の推定値。回答があった活動量、原単位のみ格納されています。
- actions: option で指定された削減施策を実施した場合の活動量、原単位の値が格納されています。option で効果のある活動量、原単位のみ格納されています。

Baseline, Estimation, Action が個別のデータ項目で、domain+item+type がキーになります。

- カーボンフットプリントの値が直接格納されているわけでわなく、カーボンンフットプリントを構成する活動量(amount)、原単位(intensity)が格納されていますので（type で指定されています）、カーボンフットプリントを取得するためにはこれらを domain_item 単位に掛け合わせて下さい。
- subdomain 単位でカーボンフットプリントを取得したい場合は、domain_item 単位に掛け合わせて取得したカーボンフットプリントを subdomain 単位で合計して下さい。

| 配列        | データ 1                                                                             | データ 2                                                                          | データ 3                                                  | データ 4                                                      | データ 5 | データ 6 | データ 7 |
| ----------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------- | -------- | -------- | -------- |
| baselines   | domain=mobility<br>item=airplane<br>type=amount<br>value=1000                        | domain=mobility<br>item=airplane<br>type=intensity<br>value=0.1                   | domain=mobility<br>item=train<br>type=amount<br>value=600 | domain=mobility<br>item=train<br>type=intensity<br>value=0.15 | ...      |
| estimations | domain=mobility<br>item=airplane<br>type=amount<br>value=1200                        | domain=mobility<br>item=train<br>type=amount<br>value=800                         | ...                                                       |
| actions     | option=micro-tourism<br>domain=mobility<br>item=airplane<br>type=amount<br>value=500 | option=long-shift<br>domain=mobility<br>item=airplane<br>type=amount<br>value=600 | ...                                                       |

上記のデータは、

- 個人のカーボンフットプリント値を取得する際は、domain_item 毎に estimations 値があるときはそちらを使い、値がないときは baselines の値を利用下さい。上記の例ですと mobility_airplane, mobility_train の amount に関しては、estimations の値を、intensity は baselines の値を使用下さい。
- 削減施策も同様の考え方で、actions に値があるときはそれを使いない場合は estimations, baselines の順で値を探して値を使用下さい。

各々の計算に用いる各種データは以下を確認下さい。
| データ | ファイル |
| ---- | ---- |
| カーボンフットプリントベースラインデータ |[footprint.csv](data/footprint.csv)|
| カーボンフットプリントを計算する各種係数 |[parameter.csv](data/parameter.csv)|
| 削減施策を計算する各種係数 |[option.csv](data/option.csv)|

## バックエンドの開発について

開発は aws Amplify の環境で進めています（2022 年 6 月現在）。詳細は[CONTRIBUTING](CONTRIBUTING.md)を参照下さい。
