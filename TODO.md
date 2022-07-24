# memo

## parameter

- housing-size の unknown の表に計算式が埋め込まれている。unknown は m2-person として、38.99612182 の固定値にする。
- gas-season-factor に november がない → schema.graphql も修正要。
- electricity-season-factor に november がない → schema.graphql も修正要。

## schema.graphql

- energyHeatIntensityKey: String # ガスの種類　 urban-gas|lpg|kerosene の kerosene がいらない。

-

## test case

- november の parameter を追加した後で、テストケース housing11 を追加。
- november の parameter を追加した後で、テストケース housing12 の検証データを修正（今は 11 月のデータになっている）。

## Excel

- housing の電力消費から EV, PHV の充電分を引く計算の車の移動（km-passenger/car/yr）がタクシー、レンタカー、カーシェアリングの一年あたりの長期休暇などを含めた自動車移動を参照している。

- parameter_org の travel-factor の 20k-30k を 10k-30k に修正。
- option の args に複数の値を設定する場合は、AND 区切りではなく、スペース区切りでお願いします。また、各々の項目の前に"mobility*"等、domain+"*"を加えて下さい。
- 参考）question-answer-to-target, question-answer-to-target-inverse, question-reduction-rate はこれから実装でもしかすると args の内容の変更をお願いするかもしれません。
