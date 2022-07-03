/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateFootprintInput = {
  dirAndDomain: string,
  itemAndType: string,
  subdomain: string,
  value: number,
  unit?: string | null,
  citation?: string | null,
};

export type ModelFootprintConditionInput = {
  subdomain?: ModelStringInput | null,
  value?: ModelFloatInput | null,
  unit?: ModelStringInput | null,
  citation?: ModelStringInput | null,
  and?: Array< ModelFootprintConditionInput | null > | null,
  or?: Array< ModelFootprintConditionInput | null > | null,
  not?: ModelFootprintConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Footprint = {
  __typename: "Footprint",
  dirAndDomain: string,
  itemAndType: string,
  subdomain: string,
  value: number,
  unit?: string | null,
  citation?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateFootprintInput = {
  dirAndDomain: string,
  itemAndType: string,
  subdomain?: string | null,
  value?: number | null,
  unit?: string | null,
  citation?: string | null,
};

export type DeleteFootprintInput = {
  dirAndDomain: string,
  itemAndType: string,
};

export type CreateParameterInput = {
  category: string,
  key: string,
  value: number,
  unit?: string | null,
  citation?: string | null,
};

export type ModelParameterConditionInput = {
  value?: ModelFloatInput | null,
  unit?: ModelStringInput | null,
  citation?: ModelStringInput | null,
  and?: Array< ModelParameterConditionInput | null > | null,
  or?: Array< ModelParameterConditionInput | null > | null,
  not?: ModelParameterConditionInput | null,
};

export type Parameter = {
  __typename: "Parameter",
  category: string,
  key: string,
  value: number,
  unit?: string | null,
  citation?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateParameterInput = {
  category: string,
  key: string,
  value?: number | null,
  unit?: string | null,
  citation?: string | null,
};

export type DeleteParameterInput = {
  category: string,
  key: string,
};

export type CreateOptionInput = {
  option: string,
  domainItemAndType: string,
  value: number,
  args?: Array< string > | null,
  operation: string,
  citation?: string | null,
};

export type ModelOptionConditionInput = {
  value?: ModelFloatInput | null,
  args?: ModelStringInput | null,
  operation?: ModelStringInput | null,
  citation?: ModelStringInput | null,
  and?: Array< ModelOptionConditionInput | null > | null,
  or?: Array< ModelOptionConditionInput | null > | null,
  not?: ModelOptionConditionInput | null,
};

export type Option = {
  __typename: "Option",
  option: string,
  domainItemAndType: string,
  value: number,
  args?: Array< string > | null,
  operation: string,
  citation?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateOptionInput = {
  option: string,
  domainItemAndType: string,
  value?: number | null,
  args?: Array< string > | null,
  operation?: string | null,
  citation?: string | null,
};

export type DeleteOptionInput = {
  option: string,
  domainItemAndType: string,
};

export type CreateOptionIntensityRateInput = {
  option: string,
  defaultValue: number,
  range: Array< number >,
};

export type ModelOptionIntensityRateConditionInput = {
  defaultValue?: ModelFloatInput | null,
  range?: ModelFloatInput | null,
  and?: Array< ModelOptionIntensityRateConditionInput | null > | null,
  or?: Array< ModelOptionIntensityRateConditionInput | null > | null,
  not?: ModelOptionIntensityRateConditionInput | null,
};

export type OptionIntensityRate = {
  __typename: "OptionIntensityRate",
  option: string,
  defaultValue: number,
  range: Array< number >,
  createdAt: string,
  updatedAt: string,
};

export type UpdateOptionIntensityRateInput = {
  option: string,
  defaultValue?: number | null,
  range?: Array< number > | null,
};

export type DeleteOptionIntensityRateInput = {
  option: string,
};

export type CreateProfileInput = {
  id?: string | null,
  shareId: string,
  mobilityAnswer?: MobilityAnswerInput | null,
  housingAnswer?: HousingAnswerInput | null,
  foodAnswer?: FoodAnswerInput | null,
  otherAnswer?: OtherAnswerInput | null,
  actionIntensityRate?: Array< ActionIntensityRateInput > | null,
  baselines?: Array< BaselineInput > | null,
  estimations?: Array< EstimationInput > | null,
  actions?: Array< ActionInput > | null,
};

export type MobilityAnswerInput = {
  hasPrivateCar?: boolean | null,
  carIntensityFactorKey?: string | null,
  carChargingKey?: string | null,
  carPassengersKey?: string | null,
  privateCarAnnualMileage?: number | null,
  trainWeeklyTravelingTime?: number | null,
  busWeeklyTravelingTime?: number | null,
  motorbikeWeeklyTravelingTime?: number | null,
  otherCarWeeklyTravelingTime?: number | null,
  hasWeeklyTravelingTime?: boolean | null,
  mileageByAreaFirstKey?: string | null,
  otherCarAnnualTravelingTime?: number | null,
  trainAnnualTravelingTime?: number | null,
  busAnnualTravelingTime?: number | null,
  motorbikeAnnualTravelingTime?: number | null,
  airplaneAnnualTravelingTime?: number | null,
  ferryAnnualTravelingTime?: number | null,
};

export type HousingAnswerInput = {
  residentCount?: number | null,
  housingSizeKey?: string | null,
  housingInsulationKey?: string | null,
  electricityIntensityKey?: string | null,
  electricityMonthlyConsumption?: number | null,
  electricitySeasonFactorKey?: string | null,
  useGas?: boolean | null,
  energyHeatIntensityKey?: string | null,
  gasMonthlyConsumption?: number | null,
  gasSeasonFactorKey?: string | null,
  useKerosene?: boolean | null,
  keroseneMonthlyConsumption?: number | null,
  keroseneMonthCount?: number | null,
  housingAmountByRegionFirstKey?: string | null,
};

export type FoodAnswerInput = {
  foodIntakeFactorKey?: string | null,
  foodDirectWasteFactorKey?: string | null,
  foodLeftoverFactorKey?: string | null,
  dishBeefFactorKey?: string | null,
  dishPorkFactorKey?: string | null,
  dishChickenFactorKey?: string | null,
  dishSeafoodFactorKey?: string | null,
  dairyFoodFactorKey?: string | null,
  alcoholFactorKey?: string | null,
  softDrinkSnackFactorKey?: string | null,
  eatOutFactorKey?: string | null,
};

export type OtherAnswerInput = {
  dailyGoodsAmountKey?: string | null,
  communicationAmountKey?: string | null,
  applianceFurnitureAmountKey?: string | null,
  serviceFactorKey?: string | null,
  hobbyGoodsFactorKey?: string | null,
  clothesBeautyFactorKey?: string | null,
  leisureSportsFactorKey?: string | null,
  travelFactorKey?: string | null,
};

export type ActionIntensityRateInput = {
  option: string,
  value: number,
  defaultValue: number,
  range: Array< number >,
};

export type BaselineInput = {
  domain: string,
  item: string,
  type: string,
  subdomain: string,
  value: number,
  unit?: string | null,
  citation?: string | null,
};

export type EstimationInput = {
  domain: string,
  item: string,
  type: string,
  subdomain: string,
  value: number,
  unit?: string | null,
};

export type ActionInput = {
  option: string,
  domain: string,
  item: string,
  type: string,
  subdomain: string,
  value: number,
  unit?: string | null,
  optionValue: number,
  args?: Array< string > | null,
  operation: string,
};

export type ModelProfileConditionInput = {
  shareId?: ModelStringInput | null,
  and?: Array< ModelProfileConditionInput | null > | null,
  or?: Array< ModelProfileConditionInput | null > | null,
  not?: ModelProfileConditionInput | null,
};

export type Profile = {
  __typename: "Profile",
  id: string,
  shareId: string,
  mobilityAnswer?: MobilityAnswer | null,
  housingAnswer?: HousingAnswer | null,
  foodAnswer?: FoodAnswer | null,
  otherAnswer?: OtherAnswer | null,
  actionIntensityRate?:  Array<ActionIntensityRate > | null,
  baselines?:  Array<Baseline > | null,
  estimations?:  Array<Estimation > | null,
  actions?:  Array<Action > | null,
  createdAt: string,
  updatedAt: string,
};

export type MobilityAnswer = {
  __typename: "MobilityAnswer",
  hasPrivateCar?: boolean | null,
  carIntensityFactorKey?: string | null,
  carChargingKey?: string | null,
  carPassengersKey?: string | null,
  privateCarAnnualMileage?: number | null,
  trainWeeklyTravelingTime?: number | null,
  busWeeklyTravelingTime?: number | null,
  motorbikeWeeklyTravelingTime?: number | null,
  otherCarWeeklyTravelingTime?: number | null,
  hasWeeklyTravelingTime?: boolean | null,
  mileageByAreaFirstKey?: string | null,
  otherCarAnnualTravelingTime?: number | null,
  trainAnnualTravelingTime?: number | null,
  busAnnualTravelingTime?: number | null,
  motorbikeAnnualTravelingTime?: number | null,
  airplaneAnnualTravelingTime?: number | null,
  ferryAnnualTravelingTime?: number | null,
};

export type HousingAnswer = {
  __typename: "HousingAnswer",
  residentCount?: number | null,
  housingSizeKey?: string | null,
  housingInsulationKey?: string | null,
  electricityIntensityKey?: string | null,
  electricityMonthlyConsumption?: number | null,
  electricitySeasonFactorKey?: string | null,
  useGas?: boolean | null,
  energyHeatIntensityKey?: string | null,
  gasMonthlyConsumption?: number | null,
  gasSeasonFactorKey?: string | null,
  useKerosene?: boolean | null,
  keroseneMonthlyConsumption?: number | null,
  keroseneMonthCount?: number | null,
  housingAmountByRegionFirstKey?: string | null,
};

export type FoodAnswer = {
  __typename: "FoodAnswer",
  foodIntakeFactorKey?: string | null,
  foodDirectWasteFactorKey?: string | null,
  foodLeftoverFactorKey?: string | null,
  dishBeefFactorKey?: string | null,
  dishPorkFactorKey?: string | null,
  dishChickenFactorKey?: string | null,
  dishSeafoodFactorKey?: string | null,
  dairyFoodFactorKey?: string | null,
  alcoholFactorKey?: string | null,
  softDrinkSnackFactorKey?: string | null,
  eatOutFactorKey?: string | null,
};

export type OtherAnswer = {
  __typename: "OtherAnswer",
  dailyGoodsAmountKey?: string | null,
  communicationAmountKey?: string | null,
  applianceFurnitureAmountKey?: string | null,
  serviceFactorKey?: string | null,
  hobbyGoodsFactorKey?: string | null,
  clothesBeautyFactorKey?: string | null,
  leisureSportsFactorKey?: string | null,
  travelFactorKey?: string | null,
};

export type ActionIntensityRate = {
  __typename: "ActionIntensityRate",
  option: string,
  value: number,
  defaultValue: number,
  range: Array< number >,
};

export type Baseline = {
  __typename: "Baseline",
  domain: string,
  item: string,
  type: string,
  subdomain: string,
  value: number,
  unit?: string | null,
  citation?: string | null,
};

export type Estimation = {
  __typename: "Estimation",
  domain: string,
  item: string,
  type: string,
  subdomain: string,
  value: number,
  unit?: string | null,
};

export type Action = {
  __typename: "Action",
  option: string,
  domain: string,
  item: string,
  type: string,
  subdomain: string,
  value: number,
  unit?: string | null,
  optionValue: number,
  args?: Array< string > | null,
  operation: string,
};

export type UpdateProfileInput = {
  id: string,
  shareId?: string | null,
  mobilityAnswer?: MobilityAnswerInput | null,
  housingAnswer?: HousingAnswerInput | null,
  foodAnswer?: FoodAnswerInput | null,
  otherAnswer?: OtherAnswerInput | null,
  actionIntensityRate?: Array< ActionIntensityRateInput > | null,
  baselines?: Array< BaselineInput > | null,
  estimations?: Array< EstimationInput > | null,
  actions?: Array< ActionInput > | null,
};

export type DeleteProfileInput = {
  id: string,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelFootprintFilterInput = {
  dirAndDomain?: ModelStringInput | null,
  itemAndType?: ModelStringInput | null,
  subdomain?: ModelStringInput | null,
  value?: ModelFloatInput | null,
  unit?: ModelStringInput | null,
  citation?: ModelStringInput | null,
  and?: Array< ModelFootprintFilterInput | null > | null,
  or?: Array< ModelFootprintFilterInput | null > | null,
  not?: ModelFootprintFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelFootprintConnection = {
  __typename: "ModelFootprintConnection",
  items:  Array<Footprint | null >,
  nextToken?: string | null,
};

export type ModelParameterFilterInput = {
  category?: ModelStringInput | null,
  key?: ModelStringInput | null,
  value?: ModelFloatInput | null,
  unit?: ModelStringInput | null,
  citation?: ModelStringInput | null,
  and?: Array< ModelParameterFilterInput | null > | null,
  or?: Array< ModelParameterFilterInput | null > | null,
  not?: ModelParameterFilterInput | null,
};

export type ModelParameterConnection = {
  __typename: "ModelParameterConnection",
  items:  Array<Parameter | null >,
  nextToken?: string | null,
};

export type ModelOptionFilterInput = {
  option?: ModelStringInput | null,
  domainItemAndType?: ModelStringInput | null,
  value?: ModelFloatInput | null,
  args?: ModelStringInput | null,
  operation?: ModelStringInput | null,
  citation?: ModelStringInput | null,
  and?: Array< ModelOptionFilterInput | null > | null,
  or?: Array< ModelOptionFilterInput | null > | null,
  not?: ModelOptionFilterInput | null,
};

export type ModelOptionConnection = {
  __typename: "ModelOptionConnection",
  items:  Array<Option | null >,
  nextToken?: string | null,
};

export type ModelOptionIntensityRateFilterInput = {
  option?: ModelStringInput | null,
  defaultValue?: ModelFloatInput | null,
  range?: ModelFloatInput | null,
  and?: Array< ModelOptionIntensityRateFilterInput | null > | null,
  or?: Array< ModelOptionIntensityRateFilterInput | null > | null,
  not?: ModelOptionIntensityRateFilterInput | null,
};

export type ModelOptionIntensityRateConnection = {
  __typename: "ModelOptionIntensityRateConnection",
  items:  Array<OptionIntensityRate | null >,
  nextToken?: string | null,
};

export type ModelProfileFilterInput = {
  id?: ModelIDInput | null,
  shareId?: ModelStringInput | null,
  and?: Array< ModelProfileFilterInput | null > | null,
  or?: Array< ModelProfileFilterInput | null > | null,
  not?: ModelProfileFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelProfileConnection = {
  __typename: "ModelProfileConnection",
  items:  Array<Profile | null >,
  nextToken?: string | null,
};

export type CreateFootprintMutationVariables = {
  input: CreateFootprintInput,
  condition?: ModelFootprintConditionInput | null,
};

export type CreateFootprintMutation = {
  createFootprint?:  {
    __typename: "Footprint",
    dirAndDomain: string,
    itemAndType: string,
    subdomain: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFootprintMutationVariables = {
  input: UpdateFootprintInput,
  condition?: ModelFootprintConditionInput | null,
};

export type UpdateFootprintMutation = {
  updateFootprint?:  {
    __typename: "Footprint",
    dirAndDomain: string,
    itemAndType: string,
    subdomain: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteFootprintMutationVariables = {
  input: DeleteFootprintInput,
  condition?: ModelFootprintConditionInput | null,
};

export type DeleteFootprintMutation = {
  deleteFootprint?:  {
    __typename: "Footprint",
    dirAndDomain: string,
    itemAndType: string,
    subdomain: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateParameterMutationVariables = {
  input: CreateParameterInput,
  condition?: ModelParameterConditionInput | null,
};

export type CreateParameterMutation = {
  createParameter?:  {
    __typename: "Parameter",
    category: string,
    key: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateParameterMutationVariables = {
  input: UpdateParameterInput,
  condition?: ModelParameterConditionInput | null,
};

export type UpdateParameterMutation = {
  updateParameter?:  {
    __typename: "Parameter",
    category: string,
    key: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteParameterMutationVariables = {
  input: DeleteParameterInput,
  condition?: ModelParameterConditionInput | null,
};

export type DeleteParameterMutation = {
  deleteParameter?:  {
    __typename: "Parameter",
    category: string,
    key: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateOptionMutationVariables = {
  input: CreateOptionInput,
  condition?: ModelOptionConditionInput | null,
};

export type CreateOptionMutation = {
  createOption?:  {
    __typename: "Option",
    option: string,
    domainItemAndType: string,
    value: number,
    args?: Array< string > | null,
    operation: string,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateOptionMutationVariables = {
  input: UpdateOptionInput,
  condition?: ModelOptionConditionInput | null,
};

export type UpdateOptionMutation = {
  updateOption?:  {
    __typename: "Option",
    option: string,
    domainItemAndType: string,
    value: number,
    args?: Array< string > | null,
    operation: string,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteOptionMutationVariables = {
  input: DeleteOptionInput,
  condition?: ModelOptionConditionInput | null,
};

export type DeleteOptionMutation = {
  deleteOption?:  {
    __typename: "Option",
    option: string,
    domainItemAndType: string,
    value: number,
    args?: Array< string > | null,
    operation: string,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateOptionIntensityRateMutationVariables = {
  input: CreateOptionIntensityRateInput,
  condition?: ModelOptionIntensityRateConditionInput | null,
};

export type CreateOptionIntensityRateMutation = {
  createOptionIntensityRate?:  {
    __typename: "OptionIntensityRate",
    option: string,
    defaultValue: number,
    range: Array< number >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateOptionIntensityRateMutationVariables = {
  input: UpdateOptionIntensityRateInput,
  condition?: ModelOptionIntensityRateConditionInput | null,
};

export type UpdateOptionIntensityRateMutation = {
  updateOptionIntensityRate?:  {
    __typename: "OptionIntensityRate",
    option: string,
    defaultValue: number,
    range: Array< number >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteOptionIntensityRateMutationVariables = {
  input: DeleteOptionIntensityRateInput,
  condition?: ModelOptionIntensityRateConditionInput | null,
};

export type DeleteOptionIntensityRateMutation = {
  deleteOptionIntensityRate?:  {
    __typename: "OptionIntensityRate",
    option: string,
    defaultValue: number,
    range: Array< number >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateProfileMutationVariables = {
  input: CreateProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type CreateProfileMutation = {
  createProfile?:  {
    __typename: "Profile",
    id: string,
    shareId: string,
    mobilityAnswer?:  {
      __typename: "MobilityAnswer",
      hasPrivateCar?: boolean | null,
      carIntensityFactorKey?: string | null,
      carChargingKey?: string | null,
      carPassengersKey?: string | null,
      privateCarAnnualMileage?: number | null,
      trainWeeklyTravelingTime?: number | null,
      busWeeklyTravelingTime?: number | null,
      motorbikeWeeklyTravelingTime?: number | null,
      otherCarWeeklyTravelingTime?: number | null,
      hasWeeklyTravelingTime?: boolean | null,
      mileageByAreaFirstKey?: string | null,
      otherCarAnnualTravelingTime?: number | null,
      trainAnnualTravelingTime?: number | null,
      busAnnualTravelingTime?: number | null,
      motorbikeAnnualTravelingTime?: number | null,
      airplaneAnnualTravelingTime?: number | null,
      ferryAnnualTravelingTime?: number | null,
    } | null,
    housingAnswer?:  {
      __typename: "HousingAnswer",
      residentCount?: number | null,
      housingSizeKey?: string | null,
      housingInsulationKey?: string | null,
      electricityIntensityKey?: string | null,
      electricityMonthlyConsumption?: number | null,
      electricitySeasonFactorKey?: string | null,
      useGas?: boolean | null,
      energyHeatIntensityKey?: string | null,
      gasMonthlyConsumption?: number | null,
      gasSeasonFactorKey?: string | null,
      useKerosene?: boolean | null,
      keroseneMonthlyConsumption?: number | null,
      keroseneMonthCount?: number | null,
      housingAmountByRegionFirstKey?: string | null,
    } | null,
    foodAnswer?:  {
      __typename: "FoodAnswer",
      foodIntakeFactorKey?: string | null,
      foodDirectWasteFactorKey?: string | null,
      foodLeftoverFactorKey?: string | null,
      dishBeefFactorKey?: string | null,
      dishPorkFactorKey?: string | null,
      dishChickenFactorKey?: string | null,
      dishSeafoodFactorKey?: string | null,
      dairyFoodFactorKey?: string | null,
      alcoholFactorKey?: string | null,
      softDrinkSnackFactorKey?: string | null,
      eatOutFactorKey?: string | null,
    } | null,
    otherAnswer?:  {
      __typename: "OtherAnswer",
      dailyGoodsAmountKey?: string | null,
      communicationAmountKey?: string | null,
      applianceFurnitureAmountKey?: string | null,
      serviceFactorKey?: string | null,
      hobbyGoodsFactorKey?: string | null,
      clothesBeautyFactorKey?: string | null,
      leisureSportsFactorKey?: string | null,
      travelFactorKey?: string | null,
    } | null,
    actionIntensityRate?:  Array< {
      __typename: "ActionIntensityRate",
      option: string,
      value: number,
      defaultValue: number,
      range: Array< number >,
    } > | null,
    baselines?:  Array< {
      __typename: "Baseline",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      citation?: string | null,
    } > | null,
    estimations?:  Array< {
      __typename: "Estimation",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
    } > | null,
    actions?:  Array< {
      __typename: "Action",
      option: string,
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      optionValue: number,
      args?: Array< string > | null,
      operation: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateProfileMutationVariables = {
  input: UpdateProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type UpdateProfileMutation = {
  updateProfile?:  {
    __typename: "Profile",
    id: string,
    shareId: string,
    mobilityAnswer?:  {
      __typename: "MobilityAnswer",
      hasPrivateCar?: boolean | null,
      carIntensityFactorKey?: string | null,
      carChargingKey?: string | null,
      carPassengersKey?: string | null,
      privateCarAnnualMileage?: number | null,
      trainWeeklyTravelingTime?: number | null,
      busWeeklyTravelingTime?: number | null,
      motorbikeWeeklyTravelingTime?: number | null,
      otherCarWeeklyTravelingTime?: number | null,
      hasWeeklyTravelingTime?: boolean | null,
      mileageByAreaFirstKey?: string | null,
      otherCarAnnualTravelingTime?: number | null,
      trainAnnualTravelingTime?: number | null,
      busAnnualTravelingTime?: number | null,
      motorbikeAnnualTravelingTime?: number | null,
      airplaneAnnualTravelingTime?: number | null,
      ferryAnnualTravelingTime?: number | null,
    } | null,
    housingAnswer?:  {
      __typename: "HousingAnswer",
      residentCount?: number | null,
      housingSizeKey?: string | null,
      housingInsulationKey?: string | null,
      electricityIntensityKey?: string | null,
      electricityMonthlyConsumption?: number | null,
      electricitySeasonFactorKey?: string | null,
      useGas?: boolean | null,
      energyHeatIntensityKey?: string | null,
      gasMonthlyConsumption?: number | null,
      gasSeasonFactorKey?: string | null,
      useKerosene?: boolean | null,
      keroseneMonthlyConsumption?: number | null,
      keroseneMonthCount?: number | null,
      housingAmountByRegionFirstKey?: string | null,
    } | null,
    foodAnswer?:  {
      __typename: "FoodAnswer",
      foodIntakeFactorKey?: string | null,
      foodDirectWasteFactorKey?: string | null,
      foodLeftoverFactorKey?: string | null,
      dishBeefFactorKey?: string | null,
      dishPorkFactorKey?: string | null,
      dishChickenFactorKey?: string | null,
      dishSeafoodFactorKey?: string | null,
      dairyFoodFactorKey?: string | null,
      alcoholFactorKey?: string | null,
      softDrinkSnackFactorKey?: string | null,
      eatOutFactorKey?: string | null,
    } | null,
    otherAnswer?:  {
      __typename: "OtherAnswer",
      dailyGoodsAmountKey?: string | null,
      communicationAmountKey?: string | null,
      applianceFurnitureAmountKey?: string | null,
      serviceFactorKey?: string | null,
      hobbyGoodsFactorKey?: string | null,
      clothesBeautyFactorKey?: string | null,
      leisureSportsFactorKey?: string | null,
      travelFactorKey?: string | null,
    } | null,
    actionIntensityRate?:  Array< {
      __typename: "ActionIntensityRate",
      option: string,
      value: number,
      defaultValue: number,
      range: Array< number >,
    } > | null,
    baselines?:  Array< {
      __typename: "Baseline",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      citation?: string | null,
    } > | null,
    estimations?:  Array< {
      __typename: "Estimation",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
    } > | null,
    actions?:  Array< {
      __typename: "Action",
      option: string,
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      optionValue: number,
      args?: Array< string > | null,
      operation: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteProfileMutationVariables = {
  input: DeleteProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type DeleteProfileMutation = {
  deleteProfile?:  {
    __typename: "Profile",
    id: string,
    shareId: string,
    mobilityAnswer?:  {
      __typename: "MobilityAnswer",
      hasPrivateCar?: boolean | null,
      carIntensityFactorKey?: string | null,
      carChargingKey?: string | null,
      carPassengersKey?: string | null,
      privateCarAnnualMileage?: number | null,
      trainWeeklyTravelingTime?: number | null,
      busWeeklyTravelingTime?: number | null,
      motorbikeWeeklyTravelingTime?: number | null,
      otherCarWeeklyTravelingTime?: number | null,
      hasWeeklyTravelingTime?: boolean | null,
      mileageByAreaFirstKey?: string | null,
      otherCarAnnualTravelingTime?: number | null,
      trainAnnualTravelingTime?: number | null,
      busAnnualTravelingTime?: number | null,
      motorbikeAnnualTravelingTime?: number | null,
      airplaneAnnualTravelingTime?: number | null,
      ferryAnnualTravelingTime?: number | null,
    } | null,
    housingAnswer?:  {
      __typename: "HousingAnswer",
      residentCount?: number | null,
      housingSizeKey?: string | null,
      housingInsulationKey?: string | null,
      electricityIntensityKey?: string | null,
      electricityMonthlyConsumption?: number | null,
      electricitySeasonFactorKey?: string | null,
      useGas?: boolean | null,
      energyHeatIntensityKey?: string | null,
      gasMonthlyConsumption?: number | null,
      gasSeasonFactorKey?: string | null,
      useKerosene?: boolean | null,
      keroseneMonthlyConsumption?: number | null,
      keroseneMonthCount?: number | null,
      housingAmountByRegionFirstKey?: string | null,
    } | null,
    foodAnswer?:  {
      __typename: "FoodAnswer",
      foodIntakeFactorKey?: string | null,
      foodDirectWasteFactorKey?: string | null,
      foodLeftoverFactorKey?: string | null,
      dishBeefFactorKey?: string | null,
      dishPorkFactorKey?: string | null,
      dishChickenFactorKey?: string | null,
      dishSeafoodFactorKey?: string | null,
      dairyFoodFactorKey?: string | null,
      alcoholFactorKey?: string | null,
      softDrinkSnackFactorKey?: string | null,
      eatOutFactorKey?: string | null,
    } | null,
    otherAnswer?:  {
      __typename: "OtherAnswer",
      dailyGoodsAmountKey?: string | null,
      communicationAmountKey?: string | null,
      applianceFurnitureAmountKey?: string | null,
      serviceFactorKey?: string | null,
      hobbyGoodsFactorKey?: string | null,
      clothesBeautyFactorKey?: string | null,
      leisureSportsFactorKey?: string | null,
      travelFactorKey?: string | null,
    } | null,
    actionIntensityRate?:  Array< {
      __typename: "ActionIntensityRate",
      option: string,
      value: number,
      defaultValue: number,
      range: Array< number >,
    } > | null,
    baselines?:  Array< {
      __typename: "Baseline",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      citation?: string | null,
    } > | null,
    estimations?:  Array< {
      __typename: "Estimation",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
    } > | null,
    actions?:  Array< {
      __typename: "Action",
      option: string,
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      optionValue: number,
      args?: Array< string > | null,
      operation: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetFootprintQueryVariables = {
  dirAndDomain: string,
  itemAndType: string,
};

export type GetFootprintQuery = {
  getFootprint?:  {
    __typename: "Footprint",
    dirAndDomain: string,
    itemAndType: string,
    subdomain: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListFootprintsQueryVariables = {
  dirAndDomain?: string | null,
  itemAndType?: ModelStringKeyConditionInput | null,
  filter?: ModelFootprintFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListFootprintsQuery = {
  listFootprints?:  {
    __typename: "ModelFootprintConnection",
    items:  Array< {
      __typename: "Footprint",
      dirAndDomain: string,
      itemAndType: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      citation?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetParameterQueryVariables = {
  category: string,
  key: string,
};

export type GetParameterQuery = {
  getParameter?:  {
    __typename: "Parameter",
    category: string,
    key: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListParametersQueryVariables = {
  category?: string | null,
  key?: ModelStringKeyConditionInput | null,
  filter?: ModelParameterFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListParametersQuery = {
  listParameters?:  {
    __typename: "ModelParameterConnection",
    items:  Array< {
      __typename: "Parameter",
      category: string,
      key: string,
      value: number,
      unit?: string | null,
      citation?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetOptionQueryVariables = {
  option: string,
  domainItemAndType: string,
};

export type GetOptionQuery = {
  getOption?:  {
    __typename: "Option",
    option: string,
    domainItemAndType: string,
    value: number,
    args?: Array< string > | null,
    operation: string,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListOptionsQueryVariables = {
  option?: string | null,
  domainItemAndType?: ModelStringKeyConditionInput | null,
  filter?: ModelOptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListOptionsQuery = {
  listOptions?:  {
    __typename: "ModelOptionConnection",
    items:  Array< {
      __typename: "Option",
      option: string,
      domainItemAndType: string,
      value: number,
      args?: Array< string > | null,
      operation: string,
      citation?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetOptionIntensityRateQueryVariables = {
  option: string,
};

export type GetOptionIntensityRateQuery = {
  getOptionIntensityRate?:  {
    __typename: "OptionIntensityRate",
    option: string,
    defaultValue: number,
    range: Array< number >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListOptionIntensityRatesQueryVariables = {
  option?: string | null,
  filter?: ModelOptionIntensityRateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListOptionIntensityRatesQuery = {
  listOptionIntensityRates?:  {
    __typename: "ModelOptionIntensityRateConnection",
    items:  Array< {
      __typename: "OptionIntensityRate",
      option: string,
      defaultValue: number,
      range: Array< number >,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetProfileQueryVariables = {
  id: string,
};

export type GetProfileQuery = {
  getProfile?:  {
    __typename: "Profile",
    id: string,
    shareId: string,
    mobilityAnswer?:  {
      __typename: "MobilityAnswer",
      hasPrivateCar?: boolean | null,
      carIntensityFactorKey?: string | null,
      carChargingKey?: string | null,
      carPassengersKey?: string | null,
      privateCarAnnualMileage?: number | null,
      trainWeeklyTravelingTime?: number | null,
      busWeeklyTravelingTime?: number | null,
      motorbikeWeeklyTravelingTime?: number | null,
      otherCarWeeklyTravelingTime?: number | null,
      hasWeeklyTravelingTime?: boolean | null,
      mileageByAreaFirstKey?: string | null,
      otherCarAnnualTravelingTime?: number | null,
      trainAnnualTravelingTime?: number | null,
      busAnnualTravelingTime?: number | null,
      motorbikeAnnualTravelingTime?: number | null,
      airplaneAnnualTravelingTime?: number | null,
      ferryAnnualTravelingTime?: number | null,
    } | null,
    housingAnswer?:  {
      __typename: "HousingAnswer",
      residentCount?: number | null,
      housingSizeKey?: string | null,
      housingInsulationKey?: string | null,
      electricityIntensityKey?: string | null,
      electricityMonthlyConsumption?: number | null,
      electricitySeasonFactorKey?: string | null,
      useGas?: boolean | null,
      energyHeatIntensityKey?: string | null,
      gasMonthlyConsumption?: number | null,
      gasSeasonFactorKey?: string | null,
      useKerosene?: boolean | null,
      keroseneMonthlyConsumption?: number | null,
      keroseneMonthCount?: number | null,
      housingAmountByRegionFirstKey?: string | null,
    } | null,
    foodAnswer?:  {
      __typename: "FoodAnswer",
      foodIntakeFactorKey?: string | null,
      foodDirectWasteFactorKey?: string | null,
      foodLeftoverFactorKey?: string | null,
      dishBeefFactorKey?: string | null,
      dishPorkFactorKey?: string | null,
      dishChickenFactorKey?: string | null,
      dishSeafoodFactorKey?: string | null,
      dairyFoodFactorKey?: string | null,
      alcoholFactorKey?: string | null,
      softDrinkSnackFactorKey?: string | null,
      eatOutFactorKey?: string | null,
    } | null,
    otherAnswer?:  {
      __typename: "OtherAnswer",
      dailyGoodsAmountKey?: string | null,
      communicationAmountKey?: string | null,
      applianceFurnitureAmountKey?: string | null,
      serviceFactorKey?: string | null,
      hobbyGoodsFactorKey?: string | null,
      clothesBeautyFactorKey?: string | null,
      leisureSportsFactorKey?: string | null,
      travelFactorKey?: string | null,
    } | null,
    actionIntensityRate?:  Array< {
      __typename: "ActionIntensityRate",
      option: string,
      value: number,
      defaultValue: number,
      range: Array< number >,
    } > | null,
    baselines?:  Array< {
      __typename: "Baseline",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      citation?: string | null,
    } > | null,
    estimations?:  Array< {
      __typename: "Estimation",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
    } > | null,
    actions?:  Array< {
      __typename: "Action",
      option: string,
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      optionValue: number,
      args?: Array< string > | null,
      operation: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListProfilesQueryVariables = {
  id?: string | null,
  filter?: ModelProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListProfilesQuery = {
  listProfiles?:  {
    __typename: "ModelProfileConnection",
    items:  Array< {
      __typename: "Profile",
      id: string,
      shareId: string,
      mobilityAnswer?:  {
        __typename: "MobilityAnswer",
        hasPrivateCar?: boolean | null,
        carIntensityFactorKey?: string | null,
        carChargingKey?: string | null,
        carPassengersKey?: string | null,
        privateCarAnnualMileage?: number | null,
        trainWeeklyTravelingTime?: number | null,
        busWeeklyTravelingTime?: number | null,
        motorbikeWeeklyTravelingTime?: number | null,
        otherCarWeeklyTravelingTime?: number | null,
        hasWeeklyTravelingTime?: boolean | null,
        mileageByAreaFirstKey?: string | null,
        otherCarAnnualTravelingTime?: number | null,
        trainAnnualTravelingTime?: number | null,
        busAnnualTravelingTime?: number | null,
        motorbikeAnnualTravelingTime?: number | null,
        airplaneAnnualTravelingTime?: number | null,
        ferryAnnualTravelingTime?: number | null,
      } | null,
      housingAnswer?:  {
        __typename: "HousingAnswer",
        residentCount?: number | null,
        housingSizeKey?: string | null,
        housingInsulationKey?: string | null,
        electricityIntensityKey?: string | null,
        electricityMonthlyConsumption?: number | null,
        electricitySeasonFactorKey?: string | null,
        useGas?: boolean | null,
        energyHeatIntensityKey?: string | null,
        gasMonthlyConsumption?: number | null,
        gasSeasonFactorKey?: string | null,
        useKerosene?: boolean | null,
        keroseneMonthlyConsumption?: number | null,
        keroseneMonthCount?: number | null,
        housingAmountByRegionFirstKey?: string | null,
      } | null,
      foodAnswer?:  {
        __typename: "FoodAnswer",
        foodIntakeFactorKey?: string | null,
        foodDirectWasteFactorKey?: string | null,
        foodLeftoverFactorKey?: string | null,
        dishBeefFactorKey?: string | null,
        dishPorkFactorKey?: string | null,
        dishChickenFactorKey?: string | null,
        dishSeafoodFactorKey?: string | null,
        dairyFoodFactorKey?: string | null,
        alcoholFactorKey?: string | null,
        softDrinkSnackFactorKey?: string | null,
        eatOutFactorKey?: string | null,
      } | null,
      otherAnswer?:  {
        __typename: "OtherAnswer",
        dailyGoodsAmountKey?: string | null,
        communicationAmountKey?: string | null,
        applianceFurnitureAmountKey?: string | null,
        serviceFactorKey?: string | null,
        hobbyGoodsFactorKey?: string | null,
        clothesBeautyFactorKey?: string | null,
        leisureSportsFactorKey?: string | null,
        travelFactorKey?: string | null,
      } | null,
      actionIntensityRate?:  Array< {
        __typename: "ActionIntensityRate",
        option: string,
        value: number,
        defaultValue: number,
        range: Array< number >,
      } > | null,
      baselines?:  Array< {
        __typename: "Baseline",
        domain: string,
        item: string,
        type: string,
        subdomain: string,
        value: number,
        unit?: string | null,
        citation?: string | null,
      } > | null,
      estimations?:  Array< {
        __typename: "Estimation",
        domain: string,
        item: string,
        type: string,
        subdomain: string,
        value: number,
        unit?: string | null,
      } > | null,
      actions?:  Array< {
        __typename: "Action",
        option: string,
        domain: string,
        item: string,
        type: string,
        subdomain: string,
        value: number,
        unit?: string | null,
        optionValue: number,
        args?: Array< string > | null,
        operation: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ProfilesByShareIdQueryVariables = {
  shareId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ProfilesByShareIdQuery = {
  profilesByShareId?:  {
    __typename: "ModelProfileConnection",
    items:  Array< {
      __typename: "Profile",
      id: string,
      shareId: string,
      mobilityAnswer?:  {
        __typename: "MobilityAnswer",
        hasPrivateCar?: boolean | null,
        carIntensityFactorKey?: string | null,
        carChargingKey?: string | null,
        carPassengersKey?: string | null,
        privateCarAnnualMileage?: number | null,
        trainWeeklyTravelingTime?: number | null,
        busWeeklyTravelingTime?: number | null,
        motorbikeWeeklyTravelingTime?: number | null,
        otherCarWeeklyTravelingTime?: number | null,
        hasWeeklyTravelingTime?: boolean | null,
        mileageByAreaFirstKey?: string | null,
        otherCarAnnualTravelingTime?: number | null,
        trainAnnualTravelingTime?: number | null,
        busAnnualTravelingTime?: number | null,
        motorbikeAnnualTravelingTime?: number | null,
        airplaneAnnualTravelingTime?: number | null,
        ferryAnnualTravelingTime?: number | null,
      } | null,
      housingAnswer?:  {
        __typename: "HousingAnswer",
        residentCount?: number | null,
        housingSizeKey?: string | null,
        housingInsulationKey?: string | null,
        electricityIntensityKey?: string | null,
        electricityMonthlyConsumption?: number | null,
        electricitySeasonFactorKey?: string | null,
        useGas?: boolean | null,
        energyHeatIntensityKey?: string | null,
        gasMonthlyConsumption?: number | null,
        gasSeasonFactorKey?: string | null,
        useKerosene?: boolean | null,
        keroseneMonthlyConsumption?: number | null,
        keroseneMonthCount?: number | null,
        housingAmountByRegionFirstKey?: string | null,
      } | null,
      foodAnswer?:  {
        __typename: "FoodAnswer",
        foodIntakeFactorKey?: string | null,
        foodDirectWasteFactorKey?: string | null,
        foodLeftoverFactorKey?: string | null,
        dishBeefFactorKey?: string | null,
        dishPorkFactorKey?: string | null,
        dishChickenFactorKey?: string | null,
        dishSeafoodFactorKey?: string | null,
        dairyFoodFactorKey?: string | null,
        alcoholFactorKey?: string | null,
        softDrinkSnackFactorKey?: string | null,
        eatOutFactorKey?: string | null,
      } | null,
      otherAnswer?:  {
        __typename: "OtherAnswer",
        dailyGoodsAmountKey?: string | null,
        communicationAmountKey?: string | null,
        applianceFurnitureAmountKey?: string | null,
        serviceFactorKey?: string | null,
        hobbyGoodsFactorKey?: string | null,
        clothesBeautyFactorKey?: string | null,
        leisureSportsFactorKey?: string | null,
        travelFactorKey?: string | null,
      } | null,
      actionIntensityRate?:  Array< {
        __typename: "ActionIntensityRate",
        option: string,
        value: number,
        defaultValue: number,
        range: Array< number >,
      } > | null,
      baselines?:  Array< {
        __typename: "Baseline",
        domain: string,
        item: string,
        type: string,
        subdomain: string,
        value: number,
        unit?: string | null,
        citation?: string | null,
      } > | null,
      estimations?:  Array< {
        __typename: "Estimation",
        domain: string,
        item: string,
        type: string,
        subdomain: string,
        value: number,
        unit?: string | null,
      } > | null,
      actions?:  Array< {
        __typename: "Action",
        option: string,
        domain: string,
        item: string,
        type: string,
        subdomain: string,
        value: number,
        unit?: string | null,
        optionValue: number,
        args?: Array< string > | null,
        operation: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateFootprintSubscription = {
  onCreateFootprint?:  {
    __typename: "Footprint",
    dirAndDomain: string,
    itemAndType: string,
    subdomain: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFootprintSubscription = {
  onUpdateFootprint?:  {
    __typename: "Footprint",
    dirAndDomain: string,
    itemAndType: string,
    subdomain: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFootprintSubscription = {
  onDeleteFootprint?:  {
    __typename: "Footprint",
    dirAndDomain: string,
    itemAndType: string,
    subdomain: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateParameterSubscription = {
  onCreateParameter?:  {
    __typename: "Parameter",
    category: string,
    key: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateParameterSubscription = {
  onUpdateParameter?:  {
    __typename: "Parameter",
    category: string,
    key: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteParameterSubscription = {
  onDeleteParameter?:  {
    __typename: "Parameter",
    category: string,
    key: string,
    value: number,
    unit?: string | null,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateOptionSubscription = {
  onCreateOption?:  {
    __typename: "Option",
    option: string,
    domainItemAndType: string,
    value: number,
    args?: Array< string > | null,
    operation: string,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateOptionSubscription = {
  onUpdateOption?:  {
    __typename: "Option",
    option: string,
    domainItemAndType: string,
    value: number,
    args?: Array< string > | null,
    operation: string,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteOptionSubscription = {
  onDeleteOption?:  {
    __typename: "Option",
    option: string,
    domainItemAndType: string,
    value: number,
    args?: Array< string > | null,
    operation: string,
    citation?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateOptionIntensityRateSubscription = {
  onCreateOptionIntensityRate?:  {
    __typename: "OptionIntensityRate",
    option: string,
    defaultValue: number,
    range: Array< number >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateOptionIntensityRateSubscription = {
  onUpdateOptionIntensityRate?:  {
    __typename: "OptionIntensityRate",
    option: string,
    defaultValue: number,
    range: Array< number >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteOptionIntensityRateSubscription = {
  onDeleteOptionIntensityRate?:  {
    __typename: "OptionIntensityRate",
    option: string,
    defaultValue: number,
    range: Array< number >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateProfileSubscription = {
  onCreateProfile?:  {
    __typename: "Profile",
    id: string,
    shareId: string,
    mobilityAnswer?:  {
      __typename: "MobilityAnswer",
      hasPrivateCar?: boolean | null,
      carIntensityFactorKey?: string | null,
      carChargingKey?: string | null,
      carPassengersKey?: string | null,
      privateCarAnnualMileage?: number | null,
      trainWeeklyTravelingTime?: number | null,
      busWeeklyTravelingTime?: number | null,
      motorbikeWeeklyTravelingTime?: number | null,
      otherCarWeeklyTravelingTime?: number | null,
      hasWeeklyTravelingTime?: boolean | null,
      mileageByAreaFirstKey?: string | null,
      otherCarAnnualTravelingTime?: number | null,
      trainAnnualTravelingTime?: number | null,
      busAnnualTravelingTime?: number | null,
      motorbikeAnnualTravelingTime?: number | null,
      airplaneAnnualTravelingTime?: number | null,
      ferryAnnualTravelingTime?: number | null,
    } | null,
    housingAnswer?:  {
      __typename: "HousingAnswer",
      residentCount?: number | null,
      housingSizeKey?: string | null,
      housingInsulationKey?: string | null,
      electricityIntensityKey?: string | null,
      electricityMonthlyConsumption?: number | null,
      electricitySeasonFactorKey?: string | null,
      useGas?: boolean | null,
      energyHeatIntensityKey?: string | null,
      gasMonthlyConsumption?: number | null,
      gasSeasonFactorKey?: string | null,
      useKerosene?: boolean | null,
      keroseneMonthlyConsumption?: number | null,
      keroseneMonthCount?: number | null,
      housingAmountByRegionFirstKey?: string | null,
    } | null,
    foodAnswer?:  {
      __typename: "FoodAnswer",
      foodIntakeFactorKey?: string | null,
      foodDirectWasteFactorKey?: string | null,
      foodLeftoverFactorKey?: string | null,
      dishBeefFactorKey?: string | null,
      dishPorkFactorKey?: string | null,
      dishChickenFactorKey?: string | null,
      dishSeafoodFactorKey?: string | null,
      dairyFoodFactorKey?: string | null,
      alcoholFactorKey?: string | null,
      softDrinkSnackFactorKey?: string | null,
      eatOutFactorKey?: string | null,
    } | null,
    otherAnswer?:  {
      __typename: "OtherAnswer",
      dailyGoodsAmountKey?: string | null,
      communicationAmountKey?: string | null,
      applianceFurnitureAmountKey?: string | null,
      serviceFactorKey?: string | null,
      hobbyGoodsFactorKey?: string | null,
      clothesBeautyFactorKey?: string | null,
      leisureSportsFactorKey?: string | null,
      travelFactorKey?: string | null,
    } | null,
    actionIntensityRate?:  Array< {
      __typename: "ActionIntensityRate",
      option: string,
      value: number,
      defaultValue: number,
      range: Array< number >,
    } > | null,
    baselines?:  Array< {
      __typename: "Baseline",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      citation?: string | null,
    } > | null,
    estimations?:  Array< {
      __typename: "Estimation",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
    } > | null,
    actions?:  Array< {
      __typename: "Action",
      option: string,
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      optionValue: number,
      args?: Array< string > | null,
      operation: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateProfileSubscription = {
  onUpdateProfile?:  {
    __typename: "Profile",
    id: string,
    shareId: string,
    mobilityAnswer?:  {
      __typename: "MobilityAnswer",
      hasPrivateCar?: boolean | null,
      carIntensityFactorKey?: string | null,
      carChargingKey?: string | null,
      carPassengersKey?: string | null,
      privateCarAnnualMileage?: number | null,
      trainWeeklyTravelingTime?: number | null,
      busWeeklyTravelingTime?: number | null,
      motorbikeWeeklyTravelingTime?: number | null,
      otherCarWeeklyTravelingTime?: number | null,
      hasWeeklyTravelingTime?: boolean | null,
      mileageByAreaFirstKey?: string | null,
      otherCarAnnualTravelingTime?: number | null,
      trainAnnualTravelingTime?: number | null,
      busAnnualTravelingTime?: number | null,
      motorbikeAnnualTravelingTime?: number | null,
      airplaneAnnualTravelingTime?: number | null,
      ferryAnnualTravelingTime?: number | null,
    } | null,
    housingAnswer?:  {
      __typename: "HousingAnswer",
      residentCount?: number | null,
      housingSizeKey?: string | null,
      housingInsulationKey?: string | null,
      electricityIntensityKey?: string | null,
      electricityMonthlyConsumption?: number | null,
      electricitySeasonFactorKey?: string | null,
      useGas?: boolean | null,
      energyHeatIntensityKey?: string | null,
      gasMonthlyConsumption?: number | null,
      gasSeasonFactorKey?: string | null,
      useKerosene?: boolean | null,
      keroseneMonthlyConsumption?: number | null,
      keroseneMonthCount?: number | null,
      housingAmountByRegionFirstKey?: string | null,
    } | null,
    foodAnswer?:  {
      __typename: "FoodAnswer",
      foodIntakeFactorKey?: string | null,
      foodDirectWasteFactorKey?: string | null,
      foodLeftoverFactorKey?: string | null,
      dishBeefFactorKey?: string | null,
      dishPorkFactorKey?: string | null,
      dishChickenFactorKey?: string | null,
      dishSeafoodFactorKey?: string | null,
      dairyFoodFactorKey?: string | null,
      alcoholFactorKey?: string | null,
      softDrinkSnackFactorKey?: string | null,
      eatOutFactorKey?: string | null,
    } | null,
    otherAnswer?:  {
      __typename: "OtherAnswer",
      dailyGoodsAmountKey?: string | null,
      communicationAmountKey?: string | null,
      applianceFurnitureAmountKey?: string | null,
      serviceFactorKey?: string | null,
      hobbyGoodsFactorKey?: string | null,
      clothesBeautyFactorKey?: string | null,
      leisureSportsFactorKey?: string | null,
      travelFactorKey?: string | null,
    } | null,
    actionIntensityRate?:  Array< {
      __typename: "ActionIntensityRate",
      option: string,
      value: number,
      defaultValue: number,
      range: Array< number >,
    } > | null,
    baselines?:  Array< {
      __typename: "Baseline",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      citation?: string | null,
    } > | null,
    estimations?:  Array< {
      __typename: "Estimation",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
    } > | null,
    actions?:  Array< {
      __typename: "Action",
      option: string,
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      optionValue: number,
      args?: Array< string > | null,
      operation: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteProfileSubscription = {
  onDeleteProfile?:  {
    __typename: "Profile",
    id: string,
    shareId: string,
    mobilityAnswer?:  {
      __typename: "MobilityAnswer",
      hasPrivateCar?: boolean | null,
      carIntensityFactorKey?: string | null,
      carChargingKey?: string | null,
      carPassengersKey?: string | null,
      privateCarAnnualMileage?: number | null,
      trainWeeklyTravelingTime?: number | null,
      busWeeklyTravelingTime?: number | null,
      motorbikeWeeklyTravelingTime?: number | null,
      otherCarWeeklyTravelingTime?: number | null,
      hasWeeklyTravelingTime?: boolean | null,
      mileageByAreaFirstKey?: string | null,
      otherCarAnnualTravelingTime?: number | null,
      trainAnnualTravelingTime?: number | null,
      busAnnualTravelingTime?: number | null,
      motorbikeAnnualTravelingTime?: number | null,
      airplaneAnnualTravelingTime?: number | null,
      ferryAnnualTravelingTime?: number | null,
    } | null,
    housingAnswer?:  {
      __typename: "HousingAnswer",
      residentCount?: number | null,
      housingSizeKey?: string | null,
      housingInsulationKey?: string | null,
      electricityIntensityKey?: string | null,
      electricityMonthlyConsumption?: number | null,
      electricitySeasonFactorKey?: string | null,
      useGas?: boolean | null,
      energyHeatIntensityKey?: string | null,
      gasMonthlyConsumption?: number | null,
      gasSeasonFactorKey?: string | null,
      useKerosene?: boolean | null,
      keroseneMonthlyConsumption?: number | null,
      keroseneMonthCount?: number | null,
      housingAmountByRegionFirstKey?: string | null,
    } | null,
    foodAnswer?:  {
      __typename: "FoodAnswer",
      foodIntakeFactorKey?: string | null,
      foodDirectWasteFactorKey?: string | null,
      foodLeftoverFactorKey?: string | null,
      dishBeefFactorKey?: string | null,
      dishPorkFactorKey?: string | null,
      dishChickenFactorKey?: string | null,
      dishSeafoodFactorKey?: string | null,
      dairyFoodFactorKey?: string | null,
      alcoholFactorKey?: string | null,
      softDrinkSnackFactorKey?: string | null,
      eatOutFactorKey?: string | null,
    } | null,
    otherAnswer?:  {
      __typename: "OtherAnswer",
      dailyGoodsAmountKey?: string | null,
      communicationAmountKey?: string | null,
      applianceFurnitureAmountKey?: string | null,
      serviceFactorKey?: string | null,
      hobbyGoodsFactorKey?: string | null,
      clothesBeautyFactorKey?: string | null,
      leisureSportsFactorKey?: string | null,
      travelFactorKey?: string | null,
    } | null,
    actionIntensityRate?:  Array< {
      __typename: "ActionIntensityRate",
      option: string,
      value: number,
      defaultValue: number,
      range: Array< number >,
    } > | null,
    baselines?:  Array< {
      __typename: "Baseline",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      citation?: string | null,
    } > | null,
    estimations?:  Array< {
      __typename: "Estimation",
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
    } > | null,
    actions?:  Array< {
      __typename: "Action",
      option: string,
      domain: string,
      item: string,
      type: string,
      subdomain: string,
      value: number,
      unit?: string | null,
      optionValue: number,
      args?: Array< string > | null,
      operation: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
