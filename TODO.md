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
- mobility の移動時間がわからない場合、週間＋年間で移動距離を設定。

## Excel

- housing の電力消費から EV, PHV の充電分を引く計算の車の移動（km-passenger/car/yr）がタクシー、レンタカー、カーシェアリングの一年あたりの長期休暇などを含めた自動車移動を参照している。

- parameter_org の travel-factor の 20k-30k を 10k-30k に修正。
- option の args に複数の値を設定する場合は、AND 区切りではなく、スペース区切りでお願いします。また、各々の項目の前に"mobility+\_"等、domain+"\_"を加えて下さい。
- 参考）question-answer-to-target, question-answer-to-target-inverse, question-reduction-rate はこれから実装でもしかすると args の内容の変更をお願いするかもしれません。
- parameter の renewable-car-intensity-factor の phv-driving-intensity を phv_driving-intensity に変更する。
- footprint シートの A1=dirAndDomain->dir_domain, B1=itemAndType->item_type へ変更。
- parameter, footprint, option, optionIntensityRate の createdAt, updatedAt を定数に変更。
- longshift->mobility_train_amount, longshift->mobility_bus_amount の値が 0.3333 ではなく 0.5。
- vegan->food_beans_amount の args の単語の区切りを kebab ケースに変更： food_milk_amount food_other-dairy_amount food_eggs_amount food_beef_amount food_pork_amount food_chicken_amount food_other-meat_amount food_processed-meat_amount food_fish_amount food_processed-fish_amount,shift-from-other-items
- food_readymeal_intensity, food_restaurant_intensity, food_barcafe_intensity も同様。
- vegan の domain_item_type も kebab ケースになっていない。修正要。

## Option

- SKIP: RideShare, CarEVPHV, CarEVPHVRE
