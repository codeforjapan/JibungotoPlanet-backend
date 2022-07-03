/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createFootprint = /* GraphQL */ `
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
export const updateFootprint = /* GraphQL */ `
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
export const deleteFootprint = /* GraphQL */ `
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
export const createParameter = /* GraphQL */ `
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
export const updateParameter = /* GraphQL */ `
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
export const deleteParameter = /* GraphQL */ `
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
export const createOption = /* GraphQL */ `
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
export const updateOption = /* GraphQL */ `
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
export const deleteOption = /* GraphQL */ `
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
export const createOptionIntensityRate = /* GraphQL */ `
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
export const updateOptionIntensityRate = /* GraphQL */ `
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
export const deleteOptionIntensityRate = /* GraphQL */ `
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
export const createProfile = /* GraphQL */ `
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
        housingAmountByRegionFirstKey
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
export const updateProfile = /* GraphQL */ `
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
        housingAmountByRegionFirstKey
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
export const deleteProfile = /* GraphQL */ `
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
        housingAmountByRegionFirstKey
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
