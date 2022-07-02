"use strict";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDeleteProfile = exports.onUpdateProfile = exports.onCreateProfile = exports.onDeleteOptionIntensityRate = exports.onUpdateOptionIntensityRate = exports.onCreateOptionIntensityRate = exports.onDeleteOption = exports.onUpdateOption = exports.onCreateOption = exports.onDeleteParameter = exports.onUpdateParameter = exports.onCreateParameter = exports.onDeleteFootprint = exports.onUpdateFootprint = exports.onCreateFootprint = void 0;
exports.onCreateFootprint = `
  subscription OnCreateFootprint {
    onCreateFootprint {
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
exports.onUpdateFootprint = `
  subscription OnUpdateFootprint {
    onUpdateFootprint {
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
exports.onDeleteFootprint = `
  subscription OnDeleteFootprint {
    onDeleteFootprint {
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
exports.onCreateParameter = `
  subscription OnCreateParameter {
    onCreateParameter {
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
exports.onUpdateParameter = `
  subscription OnUpdateParameter {
    onUpdateParameter {
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
exports.onDeleteParameter = `
  subscription OnDeleteParameter {
    onDeleteParameter {
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
exports.onCreateOption = `
  subscription OnCreateOption {
    onCreateOption {
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
exports.onUpdateOption = `
  subscription OnUpdateOption {
    onUpdateOption {
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
exports.onDeleteOption = `
  subscription OnDeleteOption {
    onDeleteOption {
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
exports.onCreateOptionIntensityRate = `
  subscription OnCreateOptionIntensityRate {
    onCreateOptionIntensityRate {
      option
      defaultValue
      range
      createdAt
      updatedAt
    }
  }
`;
exports.onUpdateOptionIntensityRate = `
  subscription OnUpdateOptionIntensityRate {
    onUpdateOptionIntensityRate {
      option
      defaultValue
      range
      createdAt
      updatedAt
    }
  }
`;
exports.onDeleteOptionIntensityRate = `
  subscription OnDeleteOptionIntensityRate {
    onDeleteOptionIntensityRate {
      option
      defaultValue
      range
      createdAt
      updatedAt
    }
  }
`;
exports.onCreateProfile = `
  subscription OnCreateProfile {
    onCreateProfile {
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
exports.onUpdateProfile = `
  subscription OnUpdateProfile {
    onUpdateProfile {
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
exports.onDeleteProfile = `
  subscription OnDeleteProfile {
    onDeleteProfile {
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
