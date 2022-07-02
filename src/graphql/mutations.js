"use strict";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.updateProfile = exports.createProfile = exports.deleteOptionIntensityRate = exports.updateOptionIntensityRate = exports.createOptionIntensityRate = exports.deleteOption = exports.updateOption = exports.createOption = exports.deleteParameter = exports.updateParameter = exports.createParameter = exports.deleteFootprint = exports.updateFootprint = exports.createFootprint = void 0;
exports.createFootprint = `
  mutation CreateFootprint(
    $input: CreateFootprintInput!
    $condition: ModelFootprintConditionInput
  ) {
    createFootprint(input: $input, condition: $condition) {
      dirAndDomain
      itemAndType
      subdomain
      value
      unit
      citation
      createdAt
      updatedAt
    }
  }
`;
exports.updateFootprint = `
  mutation UpdateFootprint(
    $input: UpdateFootprintInput!
    $condition: ModelFootprintConditionInput
  ) {
    updateFootprint(input: $input, condition: $condition) {
      dirAndDomain
      itemAndType
      subdomain
      value
      unit
      citation
      createdAt
      updatedAt
    }
  }
`;
exports.deleteFootprint = `
  mutation DeleteFootprint(
    $input: DeleteFootprintInput!
    $condition: ModelFootprintConditionInput
  ) {
    deleteFootprint(input: $input, condition: $condition) {
      dirAndDomain
      itemAndType
      subdomain
      value
      unit
      citation
      createdAt
      updatedAt
    }
  }
`;
exports.createParameter = `
  mutation CreateParameter(
    $input: CreateParameterInput!
    $condition: ModelParameterConditionInput
  ) {
    createParameter(input: $input, condition: $condition) {
      category
      key
      value
      unit
      citation
      createdAt
      updatedAt
    }
  }
`;
exports.updateParameter = `
  mutation UpdateParameter(
    $input: UpdateParameterInput!
    $condition: ModelParameterConditionInput
  ) {
    updateParameter(input: $input, condition: $condition) {
      category
      key
      value
      unit
      citation
      createdAt
      updatedAt
    }
  }
`;
exports.deleteParameter = `
  mutation DeleteParameter(
    $input: DeleteParameterInput!
    $condition: ModelParameterConditionInput
  ) {
    deleteParameter(input: $input, condition: $condition) {
      category
      key
      value
      unit
      citation
      createdAt
      updatedAt
    }
  }
`;
exports.createOption = `
  mutation CreateOption(
    $input: CreateOptionInput!
    $condition: ModelOptionConditionInput
  ) {
    createOption(input: $input, condition: $condition) {
      option
      domainItemAndType
      value
      args
      operation
      citation
      createdAt
      updatedAt
    }
  }
`;
exports.updateOption = `
  mutation UpdateOption(
    $input: UpdateOptionInput!
    $condition: ModelOptionConditionInput
  ) {
    updateOption(input: $input, condition: $condition) {
      option
      domainItemAndType
      value
      args
      operation
      citation
      createdAt
      updatedAt
    }
  }
`;
exports.deleteOption = `
  mutation DeleteOption(
    $input: DeleteOptionInput!
    $condition: ModelOptionConditionInput
  ) {
    deleteOption(input: $input, condition: $condition) {
      option
      domainItemAndType
      value
      args
      operation
      citation
      createdAt
      updatedAt
    }
  }
`;
exports.createOptionIntensityRate = `
  mutation CreateOptionIntensityRate(
    $input: CreateOptionIntensityRateInput!
    $condition: ModelOptionIntensityRateConditionInput
  ) {
    createOptionIntensityRate(input: $input, condition: $condition) {
      option
      defaultValue
      range
      createdAt
      updatedAt
    }
  }
`;
exports.updateOptionIntensityRate = `
  mutation UpdateOptionIntensityRate(
    $input: UpdateOptionIntensityRateInput!
    $condition: ModelOptionIntensityRateConditionInput
  ) {
    updateOptionIntensityRate(input: $input, condition: $condition) {
      option
      defaultValue
      range
      createdAt
      updatedAt
    }
  }
`;
exports.deleteOptionIntensityRate = `
  mutation DeleteOptionIntensityRate(
    $input: DeleteOptionIntensityRateInput!
    $condition: ModelOptionIntensityRateConditionInput
  ) {
    deleteOptionIntensityRate(input: $input, condition: $condition) {
      option
      defaultValue
      range
      createdAt
      updatedAt
    }
  }
`;
exports.createProfile = `
  mutation CreateProfile(
    $input: CreateProfileInput!
    $condition: ModelProfileConditionInput
  ) {
    createProfile(input: $input, condition: $condition) {
      id
      shareId
      mobilityAnswer {
        hasPrivateCar
        carIntensityFactorKey
        carChargingKey
        carPassengersKey
        privateCarAnnualMileage
        trainWeeklyTravelingTime
        busWeeklyTravelingTime
        motorbikeWeeklyTravelingTime
        otherCarWeeklyTravelingTime
        hasWeeklyTravelingTime
        mileageByAreaFirstKey
        otherCarAnnualTravelingTime
        trainAnnualTravelingTime
        busAnnualTravelingTime
        motorbikeAnnualTravelingTime
        airplaneAnnualTravelingTime
        ferryAnnualTravelingTime
      }
      housingAnswer {
        residentCount
        housingSizeKey
        housingInsulationKey
        electricityIntensityKey
        electricityMonthlyConsumption
        electricitySeasonFactorKey
        useGas
        energyHeatIntensityKey
        gasMonthlyConsumption
        gasSeasonFactorKey
        useKerosene
        keroseneMonthlyConsumption
        keroseneMonthCount
        housingAmountByRegionKey
      }
      foodAnswer {
        foodIntakeFactorKey
        foodDirectWasteFactorKey
        foodLeftoverFactorKey
        dishBeefFactorKey
        dishPorkFactorKey
        dishChickenFactorKey
        dishSeafoodFactorKey
        dairyFoodFactorKey
        alcoholFactorKey
        softDrinkSnackFactorKey
        eatOutFactorKey
      }
      otherAnswer {
        dailyGoodsAmountKey
        communicationAmountKey
        applianceFurnitureAmountKey
        serviceFactorKey
        hobbyGoodsFactorKey
        clothesBeautyFactorKey
        leisureSportsFactorKey
        travelFactorKey
      }
      actionIntensityRate {
        option
        value
        defaultValue
        range
      }
      baselines {
        domain
        item
        type
        subdomain
        value
        unit
        citation
      }
      estimations {
        domain
        item
        type
        subdomain
        value
        unit
      }
      actions {
        option
        domain
        item
        type
        subdomain
        value
        unit
        optionValue
        args
        operation
      }
      createdAt
      updatedAt
    }
  }
`;
exports.updateProfile = `
  mutation UpdateProfile(
    $input: UpdateProfileInput!
    $condition: ModelProfileConditionInput
  ) {
    updateProfile(input: $input, condition: $condition) {
      id
      shareId
      mobilityAnswer {
        hasPrivateCar
        carIntensityFactorKey
        carChargingKey
        carPassengersKey
        privateCarAnnualMileage
        trainWeeklyTravelingTime
        busWeeklyTravelingTime
        motorbikeWeeklyTravelingTime
        otherCarWeeklyTravelingTime
        hasWeeklyTravelingTime
        mileageByAreaFirstKey
        otherCarAnnualTravelingTime
        trainAnnualTravelingTime
        busAnnualTravelingTime
        motorbikeAnnualTravelingTime
        airplaneAnnualTravelingTime
        ferryAnnualTravelingTime
      }
      housingAnswer {
        residentCount
        housingSizeKey
        housingInsulationKey
        electricityIntensityKey
        electricityMonthlyConsumption
        electricitySeasonFactorKey
        useGas
        energyHeatIntensityKey
        gasMonthlyConsumption
        gasSeasonFactorKey
        useKerosene
        keroseneMonthlyConsumption
        keroseneMonthCount
        housingAmountByRegionKey
      }
      foodAnswer {
        foodIntakeFactorKey
        foodDirectWasteFactorKey
        foodLeftoverFactorKey
        dishBeefFactorKey
        dishPorkFactorKey
        dishChickenFactorKey
        dishSeafoodFactorKey
        dairyFoodFactorKey
        alcoholFactorKey
        softDrinkSnackFactorKey
        eatOutFactorKey
      }
      otherAnswer {
        dailyGoodsAmountKey
        communicationAmountKey
        applianceFurnitureAmountKey
        serviceFactorKey
        hobbyGoodsFactorKey
        clothesBeautyFactorKey
        leisureSportsFactorKey
        travelFactorKey
      }
      actionIntensityRate {
        option
        value
        defaultValue
        range
      }
      baselines {
        domain
        item
        type
        subdomain
        value
        unit
        citation
      }
      estimations {
        domain
        item
        type
        subdomain
        value
        unit
      }
      actions {
        option
        domain
        item
        type
        subdomain
        value
        unit
        optionValue
        args
        operation
      }
      createdAt
      updatedAt
    }
  }
`;
exports.deleteProfile = `
  mutation DeleteProfile(
    $input: DeleteProfileInput!
    $condition: ModelProfileConditionInput
  ) {
    deleteProfile(input: $input, condition: $condition) {
      id
      shareId
      mobilityAnswer {
        hasPrivateCar
        carIntensityFactorKey
        carChargingKey
        carPassengersKey
        privateCarAnnualMileage
        trainWeeklyTravelingTime
        busWeeklyTravelingTime
        motorbikeWeeklyTravelingTime
        otherCarWeeklyTravelingTime
        hasWeeklyTravelingTime
        mileageByAreaFirstKey
        otherCarAnnualTravelingTime
        trainAnnualTravelingTime
        busAnnualTravelingTime
        motorbikeAnnualTravelingTime
        airplaneAnnualTravelingTime
        ferryAnnualTravelingTime
      }
      housingAnswer {
        residentCount
        housingSizeKey
        housingInsulationKey
        electricityIntensityKey
        electricityMonthlyConsumption
        electricitySeasonFactorKey
        useGas
        energyHeatIntensityKey
        gasMonthlyConsumption
        gasSeasonFactorKey
        useKerosene
        keroseneMonthlyConsumption
        keroseneMonthCount
        housingAmountByRegionKey
      }
      foodAnswer {
        foodIntakeFactorKey
        foodDirectWasteFactorKey
        foodLeftoverFactorKey
        dishBeefFactorKey
        dishPorkFactorKey
        dishChickenFactorKey
        dishSeafoodFactorKey
        dairyFoodFactorKey
        alcoholFactorKey
        softDrinkSnackFactorKey
        eatOutFactorKey
      }
      otherAnswer {
        dailyGoodsAmountKey
        communicationAmountKey
        applianceFurnitureAmountKey
        serviceFactorKey
        hobbyGoodsFactorKey
        clothesBeautyFactorKey
        leisureSportsFactorKey
        travelFactorKey
      }
      actionIntensityRate {
        option
        value
        defaultValue
        range
      }
      baselines {
        domain
        item
        type
        subdomain
        value
        unit
        citation
      }
      estimations {
        domain
        item
        type
        subdomain
        value
        unit
      }
      actions {
        option
        domain
        item
        type
        subdomain
        value
        unit
        optionValue
        args
        operation
      }
      createdAt
      updatedAt
    }
  }
`;
