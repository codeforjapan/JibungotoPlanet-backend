import { stringify } from 'csv/sync'
import * as fs from 'fs'
const JSONStream = require('JSONStream')

interface Estimation {
  updatedAt: Date
  createdAt: Date

  index: string

  domain: string
  item: string
  type: string
  subdomain: string
  value: number
  unit: string
}

interface Action {
  updatedAt: Date
  createdAt: Date

  index: string

  option: string
  domain: string
  item: string
  type: string
  subdomain: string
  value: number
  unit: string
}

interface Profile {
  updatedAt: Date
  createdAt: Date

  index: string
  gender: string
  age: string
  region: string

  //
  // mobilityAnswer
  //
  hasPrivateCar: boolean
  carIntensityFactorFirstKey: string
  carChargingKey: string
  carPassengersFirstKey: string
  privateCarAnnualMileage: number
  trainWeeklyTravelingTime: number
  busWeeklyTravelingTime: number
  motorbikeWeeklyTravelingTime: number
  otherCarWeeklyTravelingTime: number
  hasTravelingTime: boolean
  mileageByAreaFirstKey: string
  otherCarAnnualTravelingTime: number
  trainAnnualTravelingTime: number
  busAnnualTravelingTime: number
  motorbikeAnnualTravelingTime: number
  airplaneAnnualTravelingTime: number
  ferryAnnualTravelingTime: number

  //
  // housingAnswer
  //
  residentCount: number
  housingSizeKey: string
  housingInsulationFirstKey: string
  electricityIntensityKey: string
  electricityMonthlyConsumption: number
  electricitySeasonFactorKey: string
  useGas: boolean
  energyHeatIntensityKey: string
  gasMonthlyConsumption: number
  gasSeasonFactorKey: string
  useKerosene: boolean
  keroseneMonthlyConsumption: number
  keroseneMonthCount: number
  housingAmountByRegionFirstKey: string

  //
  // foodAnswer
  //
  foodIntakeFactorKey: string
  foodDirectWasteFactorKey: string
  foodLeftoverFactorKey: string
  dishBeefFactorKey: string
  dishPorkFactorKey: string
  dishChickenFactorKey: string
  dishSeafoodFactorKey: string
  dairyFoodFactorKey: string
  alcoholFactorKey: string
  softDrinkSnackFactorKey: string
  eatOutFactorKey: string

  //
  // otherAnswer
  //
  dailyGoodsAmountKey: string
  communicationAmountKey: string
  applianceFurnitureAmountKey: string
  serviceFactorKey: string
  hobbyGoodsFactorKey: string
  clothesBeautyFactorKey: string
  leisureSportsFactorKey: string
  travelFactorKey: string

  //
  // actionIntensityRates
  //
  zehRate: Number
  selfReRate: Number
  gridReRate: Number
  comHouseRate: Number
  insrenovRate: Number
  clothesHomeRate: Number
  ecRate: Number
  acRate: Number
  ledRate: Number
  enenudgeRate: Number
  teleworkRate: Number
  closeworkRate: Number
  mictourismRate: Number
  closeserviceRate: Number
  dailyshiftRate: Number
  longshiftRate: Number
  rideshareRate: Number
  carshareRate: Number
  carEvPhvRate: Number
  carEvPhvReRate: Number
  veganRate: Number
  vegetarianRate: Number
  whiteMeatFishRate: Number
  guideMealRate: Number
  guideSnackDrinkRate: Number
  lossRate: Number
  seasonalRate: Number
  localRate: Number
  clothesAccessoryR: Number
  electronicsFurnitureRate: Number
  hobbyRate: Number
  consumablesRate: Number
  booksRate: Number
  ecoTourismRate: Number
}

const toEstimations = (rec: any, index: number): Estimation[] => {
  const updatedAt = new Date(Date.parse(rec.updatedAt.S))
  const createdAt = new Date(Date.parse(rec.createdAt.S))
  if (rec.estimations) {
    const estimations = rec.estimations.L
    return estimations.map((e: any) => ({
      updatedAt,
      createdAt,
      index,
      domain: e?.M?.domain?.S,
      item: e?.M?.item?.S,
      type: e?.M?.type?.S,
      subdomain: e?.M?.subdomain?.S,
      value: e?.M?.value?.N,
      unit: e?.M?.unit?.S
    }))
  } else {
    return []
  }
}

const toActions = (rec: any, index: number): Action[] => {
  const updatedAt = new Date(Date.parse(rec.updatedAt.S))
  const createdAt = new Date(Date.parse(rec.createdAt.S))
  if (rec.actions) {
    const actions = rec.actions.L
    return actions.map((a: any) => ({
      updatedAt,
      createdAt,
      index,
      option: a.M.option.S,
      domain: a.M.domain.S,
      item: a.M.item.S,
      type: a.M.type.S,
      subdomain: a.M.subdomain.S,
      value: a.M.value.N,
      unit: a.M.unit.S
    }))
  } else {
    return []
  }
}

const toProfile = (rec: any, index: number): Profile => {
  const mobilityAnswer = rec?.mobilityAnswer?.M || {}
  const housingAnswer = rec?.housingAnswer?.M || {}
  const foodAnswer = rec?.foodAnswer?.M || {}
  const otherAnswer = rec?.otherAnswer?.M || {}
  const actionIntensityRates = rec?.actionIntensityRates?.L || []

  const air = (option: String) =>
    actionIntensityRates.find((rate: any) => rate.M.option.S === option)?.M
      .value.N ?? 0

  return {
    updatedAt: new Date(Date.parse(rec.updatedAt.S)),
    createdAt: new Date(Date.parse(rec.createdAt.S)),

    index: index.toString(),
    gender: rec?.gender?.S,
    age: rec?.age?.S,
    region: rec?.region?.S,

    //
    // mobilityAnswer
    //
    hasPrivateCar: mobilityAnswer?.hasPrivateCar?.BOOL,
    carIntensityFactorFirstKey: mobilityAnswer?.carIntensityFactorFirstKey?.S,
    carChargingKey: mobilityAnswer?.carChargingKey?.S,
    carPassengersFirstKey: mobilityAnswer?.carPassengersFirstKey?.S,
    privateCarAnnualMileage: mobilityAnswer?.privateCarAnnualMileage?.N,
    trainWeeklyTravelingTime: mobilityAnswer?.trainWeeklyTravelingTime?.N,
    busWeeklyTravelingTime: mobilityAnswer?.busWeeklyTravelingTime?.N,
    motorbikeWeeklyTravelingTime:
      mobilityAnswer?.motorbikeWeeklyTravelingTime?.N,
    otherCarWeeklyTravelingTime: mobilityAnswer?.otherCarWeeklyTravelingTime?.N,
    hasTravelingTime: mobilityAnswer?.hasTravelingTime?.N,
    mileageByAreaFirstKey: mobilityAnswer?.mileageByAreaFirstKey?.S,
    otherCarAnnualTravelingTime: mobilityAnswer?.otherCarAnnualTravelingTime?.N,
    trainAnnualTravelingTime: mobilityAnswer?.trainAnnualTravelingTime?.N,
    busAnnualTravelingTime: mobilityAnswer?.busAnnualTravelingTime?.N,
    motorbikeAnnualTravelingTime:
      mobilityAnswer?.motorbikeAnnualTravelingTime?.N,
    airplaneAnnualTravelingTime: mobilityAnswer?.airplaneAnnualTravelingTime?.N,
    ferryAnnualTravelingTime: mobilityAnswer?.ferryAnnualTravelingTime?.N,

    //
    // housingAnswer
    //
    residentCount: housingAnswer?.residentCount?.N,
    housingSizeKey: housingAnswer?.housingSizeKey?.S,
    housingInsulationFirstKey: housingAnswer?.housingInsulationFirstKey?.S,
    electricityIntensityKey: housingAnswer?.electricityIntensityKey?.S,
    electricityMonthlyConsumption:
      housingAnswer?.electricityMonthlyConsumption?.N,
    electricitySeasonFactorKey: housingAnswer?.electricitySeasonFactorKey?.S,
    useGas: housingAnswer?.useGas?.BOOL,
    energyHeatIntensityKey: housingAnswer?.energyHeatIntensityKey?.S,
    gasMonthlyConsumption: housingAnswer?.gasMonthlyConsumption?.N,
    gasSeasonFactorKey: housingAnswer?.gasSeasonFactorKey?.S,
    useKerosene: housingAnswer?.useKerosene?.BOOL,
    keroseneMonthlyConsumption: housingAnswer?.keroseneMonthlyConsumption?.N,
    keroseneMonthCount: housingAnswer?.keroseneMonthCount?.N,
    housingAmountByRegionFirstKey:
      housingAnswer?.housingAmountByRegionFirstKey?.S,

    //
    // foodAnswer
    //
    foodIntakeFactorKey: foodAnswer?.foodIntakeFactorKey?.S,
    foodDirectWasteFactorKey: foodAnswer?.foodDirectWasteFactorKey?.S,
    foodLeftoverFactorKey: foodAnswer?.foodLeftoverFactorKey?.S,
    dishBeefFactorKey: foodAnswer?.dishBeefFactorKey?.S,
    dishPorkFactorKey: foodAnswer?.dishPorkFactorKey?.S,
    dishChickenFactorKey: foodAnswer?.dishChickenFactorKey?.S,
    dishSeafoodFactorKey: foodAnswer?.dishSeafoodFactorKey?.S,
    dairyFoodFactorKey: foodAnswer?.dairyFoodFactorKey?.S,
    alcoholFactorKey: foodAnswer?.alcoholFactorKey?.S,
    softDrinkSnackFactorKey: foodAnswer?.softDrinkSnackFactorKey?.S,
    eatOutFactorKey: foodAnswer?.eatOutFactorKey?.S,

    //
    // otherAnswer
    //
    dailyGoodsAmountKey: otherAnswer?.dailyGoodsAmountKey?.S,
    communicationAmountKey: otherAnswer?.communicationAmountKey?.S,
    applianceFurnitureAmountKey: otherAnswer?.applianceFurnitureAmountKey?.S,
    serviceFactorKey: otherAnswer?.serviceFactorKey?.S,
    hobbyGoodsFactorKey: otherAnswer?.hobbyGoodsFactorKey?.S,
    clothesBeautyFactorKey: otherAnswer?.clothesBeautyFactorKey?.S,
    leisureSportsFactorKey: otherAnswer?.leisureSportsFactorKey?.S,
    travelFactorKey: otherAnswer?.travelFactorKey?.S,

    //
    // actionIntensityRates
    //
    zehRate: air('zeh'),
    selfReRate: air('self-re'),
    gridReRate: air('grid-re'),
    comHouseRate: air('com-house'),
    insrenovRate: air('insrenov'),
    clothesHomeRate: air('clothes-home'),
    ecRate: air('ec'),
    acRate: air('ac'),
    ledRate: air('led'),
    enenudgeRate: air('enenudge'),
    teleworkRate: air('telework'),
    closeworkRate: air('closework'),
    mictourismRate: air('mictourism'),
    closeserviceRate: air('closeservice'),
    dailyshiftRate: air('dailyshift'),
    longshiftRate: air('longshift'),
    rideshareRate: air('rideshare'),
    carshareRate: air('carshare'),
    carEvPhvRate: air('car-ev-phv'),
    carEvPhvReRate: air('car-ev-phv-re'),
    veganRate: air('vegan'),
    vegetarianRate: air('vegetarian'),
    whiteMeatFishRate: air('white-meat-fish'),
    guideMealRate: air('guide-meal'),
    guideSnackDrinkRate: air('guide-snack-drink'),
    lossRate: air('loss'),
    seasonalRate: air('seasonal'),
    localRate: air('local'),
    clothesAccessoryR: air('clothes-accessory'),
    electronicsFurnitureRate: air('electronics-furniture'),
    hobbyRate: air('hobby'),
    consumablesRate: air('consumables'),
    booksRate: air('books'),
    ecoTourismRate: air('eco-tourism')
  }
}

const profiles: Profile[] = []
const estimations: Estimation[] = []
const actions: Action[] = []

const suffix = 'prd'

let index = 0
const stream = fs
  .createReadStream(`local/profile-${suffix}.json`)
  .pipe(JSONStream.parse('Items.*'))

stream.on('data', (rec: any) => {
  const createdAt = new Date(Date.parse(rec.createdAt.S))
  const serviceInDate = new Date(2022, 8 - 1, 31, 12, 0) // 月は0〜11
  if (createdAt > serviceInDate) {
    profiles.push(toProfile(rec, index))
    estimations.push(...toEstimations(rec, index))
    actions.push(...toActions(rec, index))
    ++index
  }
})

stream.on('end', () => {
  console.log('writing profile: ' + profiles.length)

  fs.writeFileSync(
    `local/profile-${suffix}.csv`,
    stringify(profiles, {
      header: true,
      cast: {
        date: (value) => value.toLocaleString(),
        boolean: (value) => (value ? 'true' : 'false')
      }
    })
  )

  console.log('writing estimations: ' + estimations.length)

  fs.writeFileSync(
    `local/estimation-${suffix}.csv`,
    stringify(estimations, {
      header: true,
      cast: {
        date: (value) => value.toLocaleString(),
        boolean: (value) => (value ? 'true' : 'false')
      }
    })
  )

  console.log('writing action: ' + actions.length)

  fs.writeFileSync(
    `local/action-${suffix}.csv`,
    stringify(actions, {
      header: true,
      cast: {
        date: (value) => value.toLocaleString(),
        boolean: (value) => (value ? 'true' : 'false')
      }
    })
  )
})
