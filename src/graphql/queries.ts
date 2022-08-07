/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getFootprint = /* GraphQL */ `
  query GetFootprint($dir_domain: String!, $item_type: String!) {
    getFootprint(dir_domain: $dir_domain, item_type: $item_type) {
      dir_domain
      item_type
      subdomain
      value
      unit
      citation
      createdAt
      updatedAt
    }
  }
`;
export const listFootprints = /* GraphQL */ `
  query ListFootprints(
    $dir_domain: String
    $item_type: ModelStringKeyConditionInput
    $filter: ModelFootprintFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listFootprints(
      dir_domain: $dir_domain
      item_type: $item_type
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        dir_domain
        item_type
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
export const getParameter = /* GraphQL */ `
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
export const listParameters = /* GraphQL */ `
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
export const getOption = /* GraphQL */ `
  query GetOption($option: String!, $domain_item_type: String!) {
    getOption(option: $option, domain_item_type: $domain_item_type) {
      option
      domain_item_type
      value
      args
      operation
      citation
      createdAt
      updatedAt
    }
  }
`;
export const listOptions = /* GraphQL */ `
  query ListOptions(
    $option: String
    $domain_item_type: ModelStringKeyConditionInput
    $filter: ModelOptionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listOptions(
      option: $option
      domain_item_type: $domain_item_type
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        option
        domain_item_type
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
export const getProfile = /* GraphQL */ `
  query GetProfile($id: ID!) {
    getProfile(id: $id) {
      estimated
      id
      shareId
      gender
      age
      region
      mobilityAnswer {
        hasPrivateCar
        carIntensityFactorFirstKey
        carChargingKey
        carPassengersFirstKey
        privateCarAnnualMileage
        trainWeeklyTravelingTime
        busWeeklyTravelingTime
        motorbikeWeeklyTravelingTime
        otherCarWeeklyTravelingTime
        hasTravelingTime
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
        housingInsulationFirstKey
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
      actionIntensityRates {
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
      }
      createdAt
      updatedAt
    }
  }
`;
export const listProfiles = /* GraphQL */ `
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
        estimated
        id
        shareId
        gender
        age
        region
        mobilityAnswer {
          hasPrivateCar
          carIntensityFactorFirstKey
          carChargingKey
          carPassengersFirstKey
          privateCarAnnualMileage
          trainWeeklyTravelingTime
          busWeeklyTravelingTime
          motorbikeWeeklyTravelingTime
          otherCarWeeklyTravelingTime
          hasTravelingTime
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
          housingInsulationFirstKey
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
        actionIntensityRates {
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
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const profilesByShareId = /* GraphQL */ `
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
        estimated
        id
        shareId
        gender
        age
        region
        mobilityAnswer {
          hasPrivateCar
          carIntensityFactorFirstKey
          carChargingKey
          carPassengersFirstKey
          privateCarAnnualMileage
          trainWeeklyTravelingTime
          busWeeklyTravelingTime
          motorbikeWeeklyTravelingTime
          otherCarWeeklyTravelingTime
          hasTravelingTime
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
          housingInsulationFirstKey
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
        actionIntensityRates {
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
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
