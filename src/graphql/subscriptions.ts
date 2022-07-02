/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateFootprint = /* GraphQL */ `
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
export const onUpdateFootprint = /* GraphQL */ `
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
export const onDeleteFootprint = /* GraphQL */ `
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
export const onCreateParameter = /* GraphQL */ `
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
export const onUpdateParameter = /* GraphQL */ `
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
export const onDeleteParameter = /* GraphQL */ `
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
export const onCreateOption = /* GraphQL */ `
  subscription OnCreateOption {
    onCreateOption {
      option
      domainItemAndType
      value
      args
      operation
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateOption = /* GraphQL */ `
  subscription OnUpdateOption {
    onUpdateOption {
      option
      domainItemAndType
      value
      args
      operation
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteOption = /* GraphQL */ `
  subscription OnDeleteOption {
    onDeleteOption {
      option
      domainItemAndType
      value
      args
      operation
      createdAt
      updatedAt
    }
  }
`;
export const onCreateOptionIntensityRate = /* GraphQL */ `
  subscription OnCreateOptionIntensityRate {
    onCreateOptionIntensityRate {
      option
      defaultValue
      minValue
      maxValue
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateOptionIntensityRate = /* GraphQL */ `
  subscription OnUpdateOptionIntensityRate {
    onUpdateOptionIntensityRate {
      option
      defaultValue
      minValue
      maxValue
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteOptionIntensityRate = /* GraphQL */ `
  subscription OnDeleteOptionIntensityRate {
    onDeleteOptionIntensityRate {
      option
      defaultValue
      minValue
      maxValue
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProfile = /* GraphQL */ `
  subscription OnCreateProfile {
    onCreateProfile {
      id
      shareId
      mobilityAnswer {
        hasPrivateCar
        privateCarType
        carCharging
        carPassengers
        privateCarAnnualMileage
        trainWeeklyTravelingTime
        busWeeklyTravelingTime
        motorbikeWeeklyTravelingTime
        otherCarWeeklyTravelingTime
        weeklyDetailedMobilityUnknown
        livingAreaSize
        otherCarAnnualTravelingTime
        trainAnnuallyTravelingTime
        busAnnualTravelingTime
        motorbikeAnnualTravelingTime
        airplaneAnnualTravelingTime
        ferryAnnualTravelingTime
      }
      housingAnswer {
        numberOfPeople
        housingSize
        housingInsulation
        electricityIntensity
        howManyElectricity
        electricitySeasonFactor
        useGas
        energyHeatIntensity
        howManyGas
        gasSeasonFactor
        useKerosene
        howManyKerosene
        howManyKeroseneMonth
        housingAmountByRegion
      }
      foodAnswer {
        foodIntake
        foodDirectwaste
        foodLeftover
        dishBeef
        dishPork
        dishChicken
        dishSeafood
        dairyFood
        alcohol
        softdrinkSnack
        eatout
      }
      otherAnswer {
        dailyGoods
        communication
        applianceFurniture
        service
        hobbyGoods
        clothesBeauty
        leisureSports
        travel
      }
      actionIntensityRate {
        option
        value
        defaultValue
        minValue
        maxValue
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
export const onUpdateProfile = /* GraphQL */ `
  subscription OnUpdateProfile {
    onUpdateProfile {
      id
      shareId
      mobilityAnswer {
        hasPrivateCar
        privateCarType
        carCharging
        carPassengers
        privateCarAnnualMileage
        trainWeeklyTravelingTime
        busWeeklyTravelingTime
        motorbikeWeeklyTravelingTime
        otherCarWeeklyTravelingTime
        weeklyDetailedMobilityUnknown
        livingAreaSize
        otherCarAnnualTravelingTime
        trainAnnuallyTravelingTime
        busAnnualTravelingTime
        motorbikeAnnualTravelingTime
        airplaneAnnualTravelingTime
        ferryAnnualTravelingTime
      }
      housingAnswer {
        numberOfPeople
        housingSize
        housingInsulation
        electricityIntensity
        howManyElectricity
        electricitySeasonFactor
        useGas
        energyHeatIntensity
        howManyGas
        gasSeasonFactor
        useKerosene
        howManyKerosene
        howManyKeroseneMonth
        housingAmountByRegion
      }
      foodAnswer {
        foodIntake
        foodDirectwaste
        foodLeftover
        dishBeef
        dishPork
        dishChicken
        dishSeafood
        dairyFood
        alcohol
        softdrinkSnack
        eatout
      }
      otherAnswer {
        dailyGoods
        communication
        applianceFurniture
        service
        hobbyGoods
        clothesBeauty
        leisureSports
        travel
      }
      actionIntensityRate {
        option
        value
        defaultValue
        minValue
        maxValue
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
export const onDeleteProfile = /* GraphQL */ `
  subscription OnDeleteProfile {
    onDeleteProfile {
      id
      shareId
      mobilityAnswer {
        hasPrivateCar
        privateCarType
        carCharging
        carPassengers
        privateCarAnnualMileage
        trainWeeklyTravelingTime
        busWeeklyTravelingTime
        motorbikeWeeklyTravelingTime
        otherCarWeeklyTravelingTime
        weeklyDetailedMobilityUnknown
        livingAreaSize
        otherCarAnnualTravelingTime
        trainAnnuallyTravelingTime
        busAnnualTravelingTime
        motorbikeAnnualTravelingTime
        airplaneAnnualTravelingTime
        ferryAnnualTravelingTime
      }
      housingAnswer {
        numberOfPeople
        housingSize
        housingInsulation
        electricityIntensity
        howManyElectricity
        electricitySeasonFactor
        useGas
        energyHeatIntensity
        howManyGas
        gasSeasonFactor
        useKerosene
        howManyKerosene
        howManyKeroseneMonth
        housingAmountByRegion
      }
      foodAnswer {
        foodIntake
        foodDirectwaste
        foodLeftover
        dishBeef
        dishPork
        dishChicken
        dishSeafood
        dairyFood
        alcohol
        softdrinkSnack
        eatout
      }
      otherAnswer {
        dailyGoods
        communication
        applianceFurniture
        service
        hobbyGoods
        clothesBeauty
        leisureSports
        travel
      }
      actionIntensityRate {
        option
        value
        defaultValue
        minValue
        maxValue
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
