# memo

## parameter

- housing-size の unknown の表に計算式が埋め込まれている。unknown は m2-person として、38.99612182 の固定値にする。
- housing の平均居住人数を db から取得するように変更（現状は定数）。

## schema.graphql

## test case

## Excel

- parameter の renewable-car-intensity-factor の phv-driving-intensity を phv_driving-intensity に変更する。
- footprint シートの A1=dirAndDomain->dir_domain, B1=itemAndType->item_type へ変更。
- parameter, footprint, option, optionIntensityRate の createdAt, updatedAt を定数に変更。
- longshift->mobility_train_amount, longshift->mobility_bus_amount の値が 0.3333 ではなく 0.5。
- vegan->food_beans_amount の args の単語の区切りを kebab ケースに変更： food_milk_amount food_other-dairy_amount food_eggs_amount food_beef_amount food_pork_amount food_chicken_amount food_other-meat_amount food_processed-meat_amount food_fish_amount food_processed-fish_amount,shift-from-other-items
- food_readymeal_intensity, food_restaurant_intensity, food_barcafe_intensity も同様。
- vegan の domain_item_type も kebab ケースになっていない。修正要。
- white-meat-fish の food_readymeal_intensity,food_restaurant_intensity,food_barcafe_intensity が二行ある → おそらく二行目は white-meat-fish ではなく guide-meal
- clothes-accessary -> clothes-accessory
- consumables -> other_kitchengoods_amount, other_paper-stationaries_amount を kitchen-goods, paper-stationery
- zeh も ubangas 等を kebab に変更。
- zeh の housing_electricity_amount は shift-from-other-items で正しいか？計算式が Excel と微妙に異なる。一つの option (zeh) の中に複数の housing_electricity_amount があるのは辛い。
- com-house も imputedrent 等を kebab に変更。
- clothes-home も housing_urban-gas 等を kebab に変更。
- ec のパラメータは正しいか？例：housing_kerosene_amount -0.939197668 になっているが、22.8%では？
- led:housing_electricity_amount=0.0660406 → は-0.0660406。
- car-ev-phv, car-ev-phv-re:amount->intensity へ変更。
- subdomain を kebab に変更。

## Option

- 要確認: zeh(housing_electricity_amount が二つあるのは辛い), ec(option.value が正しくない？)、
