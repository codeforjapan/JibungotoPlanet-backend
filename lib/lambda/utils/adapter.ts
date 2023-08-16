import {
  AlcoholFrequency,
  ApplianceFurnitureExpenses,
  CarCharging,
  CarPassengers,
  CarType,
  ClothesBeautyExpenses,
  CommunicationExpenses,
  DailyGoodsExpenses,
  DairyFoodFrequency,
  Diagnosis,
  DishFrequency,
  EatOutExpenses,
  ElectricityType,
  FoodAnswer,
  FoodDirectWasteFrequency,
  FoodIntake,
  FoodLeftoverFrequency,
  GasItem,
  HobbyGoodsExpenses,
  HousingAnswer,
  HousingInsulation,
  HousingSize,
  LeisureSportsExpenses,
  LivingRegion,
  MobilityAnswer,
  Month,
  OtherAnswer,
  ResidentialAreaSize,
  ServiceExpenses,
  SoftDrinkSnackExpenses,
  TravelExpenses,
  enumerateBaselines
} from 'cfp-calc'
import { Domain } from 'cfp-calc'
import {
  Action as ActionEntity,
  Footprint as FootprintEntity
} from 'cfp-calc/entity'

type Baseline = {
  domain: string
  item: string
  type: string
  subdomain: String
  value: number
  unit: string
}

type Footprint = Baseline & { citation: string; dir: string }

type Action = {
  domain: string
  subdomain: string
  item: string
  type: string
  value: number
  unit: string
  option: string
}

export const toBaseline = (baseline: FootprintEntity): Baseline => ({
  domain: baseline.domain,
  item: baseline.item,
  type: baseline.type,
  subdomain: baseline.subdomain,
  value: baseline.value,
  unit: baseline.unit
})

export const toAction = (action: ActionEntity): Action => ({
  domain: action.domain,
  subdomain: action.subdomain,
  item: action.item,
  type: action.type,
  value: action.value,
  unit: action.unit,
  option: action.option
})

export const toFootprint = (footprint: FootprintEntity): Footprint => {
  return {
    dir: footprint.directory,
    domain: footprint.domain,
    item: footprint.item,
    type: footprint.type,
    subdomain: footprint.subdomain,
    value: footprint.value,
    unit: footprint.unit,
    citation: footprint.citation
  }
}

/**
 * baselinesの取得
 */
export const enumerateBaselinesBy = (domain: Domain): Baseline[] => {
  return enumerateBaselines()
    .filter((baseline: FootprintEntity) => baseline.domain === domain)
    .map((baseline) => toBaseline(baseline))
}

/**
 * housingAnswerとmobilityAnswerをcfp-calcのHousingAnswerに変換
 * @param answers excelのanswer
 * @returns HousingAnswer
 */
export const toHousingAnswer = (
  housingAnswer: any,
  mobilityAnswer: any
): HousingAnswer => {
  const answer: any = { ...housingAnswer, ...mobilityAnswer }

  return {
    housingSize: answer.housingSizeKey as HousingSize,
    residentCount: answer.residentCount as number,
    housingInsulation: answer.housingInsulationFirstKey as HousingInsulation,
    // 電気
    electricity: {
      electricityType: answer.electricityIntensityKey as ElectricityType,
      // 電気の月間消費量または居住地域
      consumptionOrLivingRegion:
        answer.electricityMonthlyConsumption !== undefined &&
        answer.electricitySeasonFactorKey !== undefined
          ? {
              monthlyConsumption:
                answer.electricityMonthlyConsumption as number,
              month: answer.electricitySeasonFactorKey as Month
            }
          : {
              livingRegion: answer.housingAmountByRegionFirstKey as LivingRegion
            },
      // 自家用車
      privateCar:
        answer.hasPrivateCar === true
          ? {
              carType: answer.carIntensityFactorFirstKey as CarType,
              annualMileage: answer.privateCarAnnualMileage as number,
              carCharging: answer.carChargingKey as CarCharging
            }
          : undefined
    },
    // ガス
    gas:
      answer.useGas === true
        ? {
            item: answer.energyHeatIntensityKey as GasItem,
            // ガスの月間消費量または居住地域
            consumptionOrLivingRegion:
              answer.gasMonthlyConsumption !== undefined &&
              answer.gasSeasonFactorKey !== undefined
                ? {
                    monthlyConsumption: answer.gasMonthlyConsumption as number,
                    month: answer.gasSeasonFactorKey as Month
                  }
                : {
                    livingRegion:
                      answer.housingAmountByRegionFirstKey as LivingRegion
                  }
          }
        : undefined,
    // 灯油
    kerosene:
      answer.useKerosene === true
        ? // 灯油の月間消費量または居住地域
          answer.keroseneMonthlyConsumption !== undefined &&
          answer.keroseneMonthCount !== undefined
          ? {
              monthlyConsumption: answer.keroseneMonthlyConsumption as number,
              monthCount: answer.keroseneMonthCount as number
            }
          : {
              livingRegion: answer.housingAmountByRegionFirstKey as LivingRegion
            }
        : undefined
  }
}

export const estimateHousing = (
  housingAnswer: any,
  mobilityAnswer: any,
  diagnosis: Diagnosis
) => {
  diagnosis.answerHousing(toHousingAnswer(housingAnswer, mobilityAnswer))
}

/**
 * housingAnswerとmobilityAnswerをcfp-calcのMobilityAnswerに変換
 * @param answers excelのanswer
 * @returns MobilityAnswer
 */
export const toMobilityAnswer = (
  housingAnswer: any,
  mobilityAnswer: any
): MobilityAnswer => {
  const answer = { ...housingAnswer, ...mobilityAnswer }
  return {
    privateCarAnnualMileage:
      answer.hasPrivateCar === true &&
      typeof answer.privateCarAnnualMileage === 'number'
        ? answer.privateCarAnnualMileage
        : undefined,
    carType: answer.carIntensityFactorFirstKey as CarType,
    carPassengers: answer.carPassengersFirstKey as CarPassengers,
    carCharging: answer.carChargingKey as CarCharging,
    electricityType: answer.electricityIntensityKey as ElectricityType,

    travelingTimeOrResidentialAreaSize:
      answer.hasTravelingTime === true
        ? {
            trainWeeklyTravelingTime: answer.trainWeeklyTravelingTime ?? 0,
            trainAnnualTravelingTime: answer.trainAnnualTravelingTime ?? 0,

            busWeeklyTravelingTime: answer.busWeeklyTravelingTime ?? 0,
            busAnnualTravelingTime: answer.busAnnualTravelingTime ?? 0,

            motorbikeWeeklyTravelingTime:
              answer.motorbikeWeeklyTravelingTime ?? 0,
            motorbikeAnnualTravelingTime:
              answer.motorbikeAnnualTravelingTime ?? 0,
            otherCarWeeklyTravelingTime:
              answer.otherCarWeeklyTravelingTime ?? 0,
            otherCarAnnualTravelingTime:
              answer.otherCarAnnualTravelingTime ?? 0,

            airplaneAnnualTravelingTime:
              answer.airplaneAnnualTravelingTime ?? 0,

            ferryAnnualTravelingTime: answer.ferryAnnualTravelingTime ?? 0
          }
        : answer.hasTravelingTime !== undefined
        ? {
            residentialAreaSize:
              answer.mileageByAreaFirstKey as ResidentialAreaSize
          }
        : undefined
  }
}

export const estimateMobility = (
  housingAnswer: any,
  mobilityAnswer: any,
  diagnosis: Diagnosis
) => {
  const answer = diagnosis.answerMobility(
    toMobilityAnswer(housingAnswer, mobilityAnswer)
  )
}

/**
 * foodAnswerをcfp-calcのFoodAnswerをfoodAnswerに変換
 * @param answers excelのanswer
 * @returns FoodAnswer
 */
export const toFoodAnswer = (answer: any): FoodAnswer => ({
  foodDirectWasteFrequency:
    answer.foodDirectWasteFactorKey as FoodDirectWasteFrequency,
  foodLeftoverFrequency: answer.foodLeftoverFactorKey as FoodLeftoverFrequency,
  foodIntake: answer.foodIntakeFactorKey as FoodIntake,
  alcoholFrequency: answer.alcoholFactorKey as AlcoholFrequency,
  dairyFoodFrequency: answer.dairyFoodFactorKey as DairyFoodFrequency,
  beefDishFrequency: answer.dishBeefFactorKey as DishFrequency,
  porkDishFrequency: answer.dishPorkFactorKey as DishFrequency,
  chickenDishFrequency: answer.dishChickenFactorKey as DishFrequency,
  seafoodDishFrequency: answer.dishSeafoodFactorKey as DishFrequency,
  softDrinkSnackExpenses:
    answer.softDrinkSnackFactorKey as SoftDrinkSnackExpenses,
  eatOutExpenses: answer.eatOutFactorKey as EatOutExpenses
})

export const estimateFood = (foodAnswer: any, diagnosis: Diagnosis) => {
  diagnosis.answerFood(toFoodAnswer(foodAnswer))
}

/** housingAnswer, otherAnswerをcfp-calcのOtherAnswerに変換 */
export const toOtherAnswer = (
  housingAnswer: any,
  otherAnswer: any
): OtherAnswer => {
  const answer = { ...housingAnswer, ...otherAnswer }
  return {
    residentCount: answer.residentCount as number,
    travelExpenses: answer.travelFactorKey as TravelExpenses,
    applianceFurnitureExpenses:
      answer.applianceFurnitureAmountKey as ApplianceFurnitureExpenses,
    clothesBeautyExpenses:
      answer.clothesBeautyFactorKey as ClothesBeautyExpenses,
    hobbyGoodsExpenses: answer.hobbyGoodsFactorKey as HobbyGoodsExpenses,
    serviceExpenses: answer.serviceFactorKey as ServiceExpenses,
    dailyGoodsExpenses: answer.dailyGoodsAmountKey as DailyGoodsExpenses,
    leisureSportsExpenses:
      answer.leisureSportsFactorKey as LeisureSportsExpenses,
    communicationExpenses:
      answer.communicationAmountKey as CommunicationExpenses
  }
}

export const estimateOther = (
  housingAnswer: any,
  otherAnswer: any,
  diagnosis: Diagnosis
) => {
  diagnosis.answerOther(toOtherAnswer(housingAnswer, otherAnswer))
}
