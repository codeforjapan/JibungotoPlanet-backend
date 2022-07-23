# memo

## parameter

- housing-size の unknown の表に計算式が埋め込まれている。unknown は m2-person として、38.99612182 の固定値にする。
- gas-season-factor に november がない → schema.graphql も修正要。
- electricity-season-factor に november がない → schema.graphql も修正要。

## schema.graphql

- energyHeatIntensityKey: String # ガスの種類　 urban-gas|lpg|kerosene の kerosene がいらない。
