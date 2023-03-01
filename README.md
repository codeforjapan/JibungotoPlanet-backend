# じぶんごとプラネット バックエンド

## データソース

この API では、国立環境研究所のカーボンフットプリントに関する研究成果を活用し、移動・住居・食・モノとサービスに関する簡単な設問への回答からユーザー個人のカーボンフットプリントを算出し、それぞれのユーザーに合った脱炭素アクションの選択肢をカーボンフットプリントの削減量とともに提案します。

カーボンフットプリントおよび脱炭素アクションによる削減効果の推計に用いているデータソースは次のとおりです。

### ユーザーのカーボンフットプリント推計

選択式の設問に基づき、ユーザーの消費量と排出原単位が日本の平均からどの程度乖離しているかの推定を行っています。日本の平均フットプリントは、衣食住の家計消費を網羅したカーボンフットプリントのデータベース 1,2 を用いています。ユーザーのカーボンフットプリント推計に用いたデータソースは次の通りです。

#### 電力消費量の季節調整

総務省統計局. 2015. 電気使用量の推移 平成 27 年 2 月 27 日より算出

#### ガス消費量の季節調整

環境省. 2015. 家庭からの二酸化炭素排出量の推計に係る実態調査 全国試験調査 平成 26 年 10 月～平成 27 年 9 月より算出

#### ガスと灯油の熱量換算

資源エネルギー庁. 2006. 市町村別エネルギー消費統計作成のためのガイドラインより算出

#### 平均世帯人数

総務省統計局. 2015. 国勢調査より算出

#### 自動車 1 台当たりの乗車人数

国土交通省. 2015. 全国道路・街路交通情勢調査 自動車起終点調査（OD 調査）より算出

#### 食品摂取量（カロリー）

農林水産省. n.d. 食事バランスガイド. 厚生労働省. 2015. 国民健康・栄養調査より算出

#### 食品ロス（食べ残し・直接廃棄）の頻度と発生量

東京都環境局. 2017. 家庭系食品ロス発生要因等調査より算出

#### 食品ロス（食べ残し・直接廃棄）の割合

農林水産省. 2016. 食品ロス統計調査報告（世帯調査）より算出

#### 肉類・魚介類の摂取頻度

日本食肉消費総合センター. 2020. 食肉に関する意識調査報告書より算出

#### 乳製品・卵の摂取頻度

農畜産業振興機構. 2025. 牛乳・乳製品の消費動向に関する調査. 一般社団法人 JC 総研. 2015. たまごの消費行動調査の概要より算出

#### 飲酒の頻度

国税庁. n.d. お酒に関するアンケートの集計より算出

特に記載が無いものはデータソース 1,2 を用いています。

### 脱炭素アクションのカーボンフットプリント削減効果推計

カーボンフットプリントの推計結果に基づき、ユーザーのライフスタイルの特徴を踏まえた脱炭素アクションのカーボンフットプリント削減効果を推計しています。

脱炭素アクションは、データソース 1,2 で文献レビューに基づき特定された 65 の脱炭素型ライフスタイル転換の選択肢の中から、主要な選択肢を抜粋し、類似した選択肢は平均値を取ることで抽出したアクションが含まれています。削減効果の推定にあたり、ユーザーのカーボンフットプリント推計結果をベースラインとして用いた上で、Web ツールの実装用に簡易化した削減効果のパラメーターに基づき計算を行なっています。

削減効果は、それぞれの脱炭素アクションを最大限取り入れた場合を実施率 100%とし、ユーザーが選択した実施率に応じて、カーボンフットプリントの最大削減効果に実施率を乗ずることにより算出しています。脱炭素アクションについての詳細はデータソース 1,2 を参照ください。

1. Ryu Koide et al. 2021. Exploring Carbon Footprint Reduction Pathways through Urban Lifestyle Changes: A Practical Approach Applied to Japanese Cities. _Environmental Research Letters_. 16 084001
2. 国立環境研究所. 2021. 国内 52 都市における脱炭素型ライフスタイルの選択肢：カーボンフットプリントと削減効果データブック

## ソースコードの利用

MIT ライセンス記載の事項に加え、以下の事項を遵守いただくようお願いいたします。

本ソースコードを利活用したソフトウェア又はこれを用いたサービスを開発・公開する場合、[こちらのフォーム](https://forms.gle/GshrYmBn2D22Q8Uq6)から報告をお願いいたします。派生版ソフトウェア及びこれを用いたサービスについての情報は、関連ウェブサイト等において紹介することがあります。

本ソースコード及びこれに含まれるデータの利用並びに推計方法、データソース又は表示方法に対して行われたいかなる改変によって生じた不利益については、一般社団法人 コード・フォー・ジャパン及び国立研究開発法人 国立環境研究所は何ら責任を負いません。

また、本ソースコード及びこれに含まれるデータを用いた分析結果及びその解釈について、一般社団法人 コード・フォー・ジャパン及び国立研究開発法人 国立環境研究所は何ら正当性を保証いたしません。

## 関連するソースコード

一般社団法人コード・フォー・ジャパンでは本ソースコードを用いて[じぶんごとプラネット](https://jibungoto-planet.jp)というサービスを提供しています。じぶんごとプラネットのフロント側のソースコードは下記となります。

[https://github.com/codeforjapan/JibungotoPlanet](https://github.com/codeforjapan/JibungotoPlanet)

## REST API

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

開発は aws CDK で環境を作成しています（2023 年 2 月現在）。詳細は[CONTRIBUTING](CONTRIBUTING.md)を参照下さい。

## Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

### Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
