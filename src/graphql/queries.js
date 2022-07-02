"use strict";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.profilesByShareId = exports.listProfiles = exports.getProfile = exports.listOptionIntensityRates = exports.getOptionIntensityRate = exports.listOptions = exports.getOption = exports.listParameters = exports.getParameter = exports.listFootprints = exports.getFootprint = void 0;
exports.getFootprint = `
  query GetFootprint($dirAndDomain: String!, $itemAndType: String!) {
    getFootprint(dirAndDomain: $dirAndDomain, itemAndType: $itemAndType) {
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
exports.listFootprints = `
  query ListFootprints(
    $dirAndDomain: String
    $itemAndType: ModelStringKeyConditionInput
    $filter: ModelFootprintFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listFootprints(
      dirAndDomain: $dirAndDomain
      itemAndType: $itemAndType
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        dirAndDomain
        itemAndType
        subdomain
        value
        unit
        citation
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getParameter = `
  query GetParameter($category: String!, $key: String!) {
    getParameter(category: $category, key: $key) {
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
exports.listParameters = `
  query ListParameters(
    $category: String
    $key: ModelStringKeyConditionInput
    $filter: ModelParameterFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listParameters(
      category: $category
      key: $key
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        category
        key
        value
        unit
        citation
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getOption = `
  query GetOption($option: String!, $domainItemAndType: String!) {
    getOption(option: $option, domainItemAndType: $domainItemAndType) {
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
exports.listOptions = `
  query ListOptions(
    $option: String
    $domainItemAndType: ModelStringKeyConditionInput
    $filter: ModelOptionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOptions(
      option: $option
      domainItemAndType: $domainItemAndType
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        option
        domainItemAndType
        value
        args
        operation
        citation
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getOptionIntensityRate = `
  query GetOptionIntensityRate($option: String!) {
    getOptionIntensityRate(option: $option) {
      option
      defaultValue
      range
      createdAt
      updatedAt
    }
  }
`;
exports.listOptionIntensityRates = `
  query ListOptionIntensityRates(
    $option: String
    $filter: ModelOptionIntensityRateFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOptionIntensityRates(
      option: $option
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        option
        defaultValue
        range
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
exports.getProfile = `
  query GetProfile($id: ID!) {
    getProfile(id: $id) {
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
exports.listProfiles = `
  query ListProfiles(
    $id: ID
    $filter: ModelProfileFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProfiles(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
    }
  }
`;
exports.profilesByShareId = `
  query ProfilesByShareId(
    $shareId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    profilesByShareId(
      shareId: $shareId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
