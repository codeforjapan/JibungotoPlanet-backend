"use strict";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
exports.__esModule = true;
exports.profilesByShareId = exports.listProfiles = exports.getProfile = exports.listOptionIntensityRates = exports.getOptionIntensityRate = exports.listOptions = exports.getOption = exports.listParameters = exports.getParameter = exports.listFootprints = exports.getFootprint = void 0;
exports.getFootprint = "\n  query GetFootprint($dirAndDomain: String!, $itemAndType: String!) {\n    getFootprint(dirAndDomain: $dirAndDomain, itemAndType: $itemAndType) {\n      dirAndDomain\n      itemAndType\n      subdomain\n      value\n      unit\n      citation\n      createdAt\n      updatedAt\n    }\n  }\n";
exports.listFootprints = "\n  query ListFootprints(\n    $dirAndDomain: String\n    $itemAndType: ModelStringKeyConditionInput\n    $filter: ModelFootprintFilterInput\n    $limit: Int\n    $nextToken: String\n    $sortDirection: ModelSortDirection\n  ) {\n    listFootprints(\n      dirAndDomain: $dirAndDomain\n      itemAndType: $itemAndType\n      filter: $filter\n      limit: $limit\n      nextToken: $nextToken\n      sortDirection: $sortDirection\n    ) {\n      items {\n        dirAndDomain\n        itemAndType\n        subdomain\n        value\n        unit\n        citation\n        createdAt\n        updatedAt\n      }\n      nextToken\n    }\n  }\n";
exports.getParameter = "\n  query GetParameter($category: String!, $key: String!) {\n    getParameter(category: $category, key: $key) {\n      category\n      key\n      value\n      unit\n      citation\n      createdAt\n      updatedAt\n    }\n  }\n";
exports.listParameters = "\n  query ListParameters(\n    $category: String\n    $key: ModelStringKeyConditionInput\n    $filter: ModelParameterFilterInput\n    $limit: Int\n    $nextToken: String\n    $sortDirection: ModelSortDirection\n  ) {\n    listParameters(\n      category: $category\n      key: $key\n      filter: $filter\n      limit: $limit\n      nextToken: $nextToken\n      sortDirection: $sortDirection\n    ) {\n      items {\n        category\n        key\n        value\n        unit\n        citation\n        createdAt\n        updatedAt\n      }\n      nextToken\n    }\n  }\n";
exports.getOption = "\n  query GetOption($option: String!, $domainItemAndType: String!) {\n    getOption(option: $option, domainItemAndType: $domainItemAndType) {\n      option\n      domainItemAndType\n      value\n      args\n      operation\n      citation\n      createdAt\n      updatedAt\n    }\n  }\n";
exports.listOptions = "\n  query ListOptions(\n    $option: String\n    $domainItemAndType: ModelStringKeyConditionInput\n    $filter: ModelOptionFilterInput\n    $limit: Int\n    $nextToken: String\n    $sortDirection: ModelSortDirection\n  ) {\n    listOptions(\n      option: $option\n      domainItemAndType: $domainItemAndType\n      filter: $filter\n      limit: $limit\n      nextToken: $nextToken\n      sortDirection: $sortDirection\n    ) {\n      items {\n        option\n        domainItemAndType\n        value\n        args\n        operation\n        citation\n        createdAt\n        updatedAt\n      }\n      nextToken\n    }\n  }\n";
exports.getOptionIntensityRate = "\n  query GetOptionIntensityRate($option: String!) {\n    getOptionIntensityRate(option: $option) {\n      option\n      defaultValue\n      range\n      createdAt\n      updatedAt\n    }\n  }\n";
exports.listOptionIntensityRates = "\n  query ListOptionIntensityRates(\n    $option: String\n    $filter: ModelOptionIntensityRateFilterInput\n    $limit: Int\n    $nextToken: String\n    $sortDirection: ModelSortDirection\n  ) {\n    listOptionIntensityRates(\n      option: $option\n      filter: $filter\n      limit: $limit\n      nextToken: $nextToken\n      sortDirection: $sortDirection\n    ) {\n      items {\n        option\n        defaultValue\n        range\n        createdAt\n        updatedAt\n      }\n      nextToken\n    }\n  }\n";
exports.getProfile = "\n  query GetProfile($id: ID!) {\n    getProfile(id: $id) {\n      id\n      shareId\n      mobilityAnswer {\n        hasPrivateCar\n        carIntensityFactorKey\n        carChargingKey\n        carPassengersKey\n        privateCarAnnualMileage\n        trainWeeklyTravelingTime\n        busWeeklyTravelingTime\n        motorbikeWeeklyTravelingTime\n        otherCarWeeklyTravelingTime\n        hasWeeklyTravelingTime\n        mileageByAreaFirstKey\n        otherCarAnnualTravelingTime\n        trainAnnualTravelingTime\n        busAnnualTravelingTime\n        motorbikeAnnualTravelingTime\n        airplaneAnnualTravelingTime\n        ferryAnnualTravelingTime\n      }\n      housingAnswer {\n        residentCount\n        housingSizeKey\n        housingInsulationKey\n        electricityIntensityKey\n        electricityMonthlyConsumption\n        electricitySeasonFactorKey\n        useGas\n        energyHeatIntensityKey\n        gasMonthlyConsumption\n        gasSeasonFactorKey\n        useKerosene\n        keroseneMonthlyConsumption\n        keroseneMonthCount\n        housingAmountByRegionKey\n      }\n      foodAnswer {\n        foodIntakeFactorKey\n        foodDirectWasteFactorKey\n        foodLeftoverFactorKey\n        dishBeefFactorKey\n        dishPorkFactorKey\n        dishChickenFactorKey\n        dishSeafoodFactorKey\n        dairyFoodFactorKey\n        alcoholFactorKey\n        softDrinkSnackFactorKey\n        eatOutFactorKey\n      }\n      otherAnswer {\n        dailyGoodsAmountKey\n        communicationAmountKey\n        applianceFurnitureAmountKey\n        serviceFactorKey\n        hobbyGoodsFactorKey\n        clothesBeautyFactorKey\n        leisureSportsFactorKey\n        travelFactorKey\n      }\n      actionIntensityRate {\n        option\n        value\n        defaultValue\n        range\n      }\n      baselines {\n        domain\n        item\n        type\n        subdomain\n        value\n        unit\n        citation\n      }\n      estimations {\n        domain\n        item\n        type\n        subdomain\n        value\n        unit\n      }\n      actions {\n        option\n        domain\n        item\n        type\n        subdomain\n        value\n        unit\n        optionValue\n        args\n        operation\n      }\n      createdAt\n      updatedAt\n    }\n  }\n";
exports.listProfiles = "\n  query ListProfiles(\n    $id: ID\n    $filter: ModelProfileFilterInput\n    $limit: Int\n    $nextToken: String\n    $sortDirection: ModelSortDirection\n  ) {\n    listProfiles(\n      id: $id\n      filter: $filter\n      limit: $limit\n      nextToken: $nextToken\n      sortDirection: $sortDirection\n    ) {\n      items {\n        id\n        shareId\n        mobilityAnswer {\n          hasPrivateCar\n          carIntensityFactorKey\n          carChargingKey\n          carPassengersKey\n          privateCarAnnualMileage\n          trainWeeklyTravelingTime\n          busWeeklyTravelingTime\n          motorbikeWeeklyTravelingTime\n          otherCarWeeklyTravelingTime\n          hasWeeklyTravelingTime\n          mileageByAreaFirstKey\n          otherCarAnnualTravelingTime\n          trainAnnualTravelingTime\n          busAnnualTravelingTime\n          motorbikeAnnualTravelingTime\n          airplaneAnnualTravelingTime\n          ferryAnnualTravelingTime\n        }\n        housingAnswer {\n          residentCount\n          housingSizeKey\n          housingInsulationKey\n          electricityIntensityKey\n          electricityMonthlyConsumption\n          electricitySeasonFactorKey\n          useGas\n          energyHeatIntensityKey\n          gasMonthlyConsumption\n          gasSeasonFactorKey\n          useKerosene\n          keroseneMonthlyConsumption\n          keroseneMonthCount\n          housingAmountByRegionKey\n        }\n        foodAnswer {\n          foodIntakeFactorKey\n          foodDirectWasteFactorKey\n          foodLeftoverFactorKey\n          dishBeefFactorKey\n          dishPorkFactorKey\n          dishChickenFactorKey\n          dishSeafoodFactorKey\n          dairyFoodFactorKey\n          alcoholFactorKey\n          softDrinkSnackFactorKey\n          eatOutFactorKey\n        }\n        otherAnswer {\n          dailyGoodsAmountKey\n          communicationAmountKey\n          applianceFurnitureAmountKey\n          serviceFactorKey\n          hobbyGoodsFactorKey\n          clothesBeautyFactorKey\n          leisureSportsFactorKey\n          travelFactorKey\n        }\n        actionIntensityRate {\n          option\n          value\n          defaultValue\n          range\n        }\n        baselines {\n          domain\n          item\n          type\n          subdomain\n          value\n          unit\n          citation\n        }\n        estimations {\n          domain\n          item\n          type\n          subdomain\n          value\n          unit\n        }\n        actions {\n          option\n          domain\n          item\n          type\n          subdomain\n          value\n          unit\n          optionValue\n          args\n          operation\n        }\n        createdAt\n        updatedAt\n      }\n      nextToken\n    }\n  }\n";
exports.profilesByShareId = "\n  query ProfilesByShareId(\n    $shareId: String!\n    $sortDirection: ModelSortDirection\n    $filter: ModelProfileFilterInput\n    $limit: Int\n    $nextToken: String\n  ) {\n    profilesByShareId(\n      shareId: $shareId\n      sortDirection: $sortDirection\n      filter: $filter\n      limit: $limit\n      nextToken: $nextToken\n    ) {\n      items {\n        id\n        shareId\n        mobilityAnswer {\n          hasPrivateCar\n          carIntensityFactorKey\n          carChargingKey\n          carPassengersKey\n          privateCarAnnualMileage\n          trainWeeklyTravelingTime\n          busWeeklyTravelingTime\n          motorbikeWeeklyTravelingTime\n          otherCarWeeklyTravelingTime\n          hasWeeklyTravelingTime\n          mileageByAreaFirstKey\n          otherCarAnnualTravelingTime\n          trainAnnualTravelingTime\n          busAnnualTravelingTime\n          motorbikeAnnualTravelingTime\n          airplaneAnnualTravelingTime\n          ferryAnnualTravelingTime\n        }\n        housingAnswer {\n          residentCount\n          housingSizeKey\n          housingInsulationKey\n          electricityIntensityKey\n          electricityMonthlyConsumption\n          electricitySeasonFactorKey\n          useGas\n          energyHeatIntensityKey\n          gasMonthlyConsumption\n          gasSeasonFactorKey\n          useKerosene\n          keroseneMonthlyConsumption\n          keroseneMonthCount\n          housingAmountByRegionKey\n        }\n        foodAnswer {\n          foodIntakeFactorKey\n          foodDirectWasteFactorKey\n          foodLeftoverFactorKey\n          dishBeefFactorKey\n          dishPorkFactorKey\n          dishChickenFactorKey\n          dishSeafoodFactorKey\n          dairyFoodFactorKey\n          alcoholFactorKey\n          softDrinkSnackFactorKey\n          eatOutFactorKey\n        }\n        otherAnswer {\n          dailyGoodsAmountKey\n          communicationAmountKey\n          applianceFurnitureAmountKey\n          serviceFactorKey\n          hobbyGoodsFactorKey\n          clothesBeautyFactorKey\n          leisureSportsFactorKey\n          travelFactorKey\n        }\n        actionIntensityRate {\n          option\n          value\n          defaultValue\n          range\n        }\n        baselines {\n          domain\n          item\n          type\n          subdomain\n          value\n          unit\n          citation\n        }\n        estimations {\n          domain\n          item\n          type\n          subdomain\n          value\n          unit\n        }\n        actions {\n          option\n          domain\n          item\n          type\n          subdomain\n          value\n          unit\n          optionValue\n          args\n          operation\n        }\n        createdAt\n        updatedAt\n      }\n      nextToken\n    }\n  }\n";