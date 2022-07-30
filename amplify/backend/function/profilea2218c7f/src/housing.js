"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.estimateHousing = void 0;
var util_1 = require("./util");
var estimateHousing = function (dynamodb, housingAnswer, mobilityAnswer, footprintTableName, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var getData, pushOrUpdateEstimate, estimations, params, data, baselines, findAmount, createAmount, createIntensity, residentCount, estimationAmount, housingAmountByRegion_1, params_1, amountByRegion, _loop_1, _i, _a, key, housingSize, housingSizePerResident, imputedRentValue, rentValue, electricityParam, electricityIntensity, electricitySeason, mobilityElectricityAmount, electricityData, mobilityElectricity, chargingData, mobilityCharging, gasParam, gasSeason, gasFactor, keroseneData;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                getData = function (category, key) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, dynamodb
                                    .get({
                                    TableName: parameterTableName,
                                    Key: {
                                        category: category,
                                        key: key
                                    }
                                })
                                    .promise()
                                /* eslint-disable no-unused-vars */
                            ];
                            case 1: return [2 /*return*/, _a.sent()
                                /* eslint-disable no-unused-vars */
                            ];
                        }
                    });
                }); };
                pushOrUpdateEstimate = function (item, type, estimation) {
                    var estimate = estimations.find(function (estimation) { return estimation.item === item && estimation.type === type; });
                    if (estimate) {
                        estimate.value = estimation.value;
                    }
                    else {
                        estimations.push(estimation);
                    }
                };
                estimations = [];
                params = {
                    TableName: footprintTableName,
                    KeyConditions: {
                        dir_domain: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['baseline_housing']
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(params).promise()];
            case 1:
                data = _l.sent();
                baselines = data.Items.map(function (item) { return (0, util_1.toBaseline)(item); });
                findAmount = function (item) {
                    return (0, util_1.findBaseline)(baselines, 'housing', item, 'amount');
                };
                createAmount = function (item) {
                    return (0, util_1.toEstimation)((0, util_1.findBaseline)(baselines, 'housing', item, 'amount'));
                };
                createIntensity = function (item) {
                    return (0, util_1.toEstimation)((0, util_1.findBaseline)(baselines, 'housing', item, 'intensity'));
                };
                // 回答がない場合はベースラインのみ返す
                if (!housingAnswer) {
                    return [2 /*return*/, { baselines: baselines, estimations: estimations }];
                }
                residentCount = housingAnswer.residentCount;
                estimationAmount = {
                    'land-rent': createAmount('land-rent'),
                    'imputed-rent': createAmount('imputed-rent'),
                    rent: createAmount('rent'),
                    'housing-maintenance': createAmount('housing-maintenance'),
                    electricity: createAmount('electricity'),
                    'urban-gas': createAmount('urban-gas'),
                    lpg: createAmount('lpg'),
                    kerosene: createAmount('kerosene')
                };
                if (!housingAnswer.housingAmountByRegionFirstKey) return [3 /*break*/, 3];
                housingAmountByRegion_1 = housingAnswer.housingAmountByRegionFirstKey + '_';
                params_1 = {
                    TableName: parameterTableName,
                    KeyConditions: {
                        category: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['housing-amount-by-region']
                        },
                        key: {
                            ComparisonOperator: 'BEGINS_WITH',
                            AttributeValueList: [housingAmountByRegion_1]
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(params_1).promise()
                    // estimationAmountに項目があるものだけ、amountByRegionの値を上書き
                ];
            case 2:
                amountByRegion = _l.sent();
                _loop_1 = function (key) {
                    var rec = amountByRegion.Items.find(function (a) { return a.key === housingAmountByRegion_1 + key + '-amount'; });
                    if (rec) {
                        estimationAmount[key].value = rec.value;
                    }
                    estimations.push(estimationAmount[key]);
                };
                // estimationAmountに項目があるものだけ、amountByRegionの値を上書き
                for (_i = 0, _a = Object.keys(estimationAmount); _i < _a.length; _i++) {
                    key = _a[_i];
                    _loop_1(key);
                }
                _l.label = 3;
            case 3:
                if (!housingAnswer.housingSizeKey) return [3 /*break*/, 5];
                return [4 /*yield*/, getData('housing-size', housingAnswer.housingSizeKey)];
            case 4:
                housingSize = _l.sent();
                housingSizePerResident = housingAnswer.housingSizeKey === 'unknown'
                    ? (_b = housingSize.Item) === null || _b === void 0 ? void 0 : _b.value
                    : ((_c = housingSize.Item) === null || _c === void 0 ? void 0 : _c.value) / residentCount;
                imputedRentValue = findAmount('imputed-rent').value;
                rentValue = findAmount('rent').value;
                estimationAmount['imputed-rent'].value =
                    (housingSizePerResident / (imputedRentValue + rentValue)) *
                        imputedRentValue;
                estimationAmount.rent.value =
                    (housingSizePerResident / (imputedRentValue + rentValue)) * rentValue;
                estimationAmount['housing-maintenance'].value =
                    (findAmount('housing-maintenance').value /
                        (imputedRentValue + rentValue)) *
                        (estimationAmount['imputed-rent'].value + estimationAmount.rent.value);
                pushOrUpdateEstimate('imputed-rent', 'amount', estimationAmount['imputed-rent']);
                pushOrUpdateEstimate('rent', 'amount', estimationAmount.rent);
                pushOrUpdateEstimate('housing-maintenance', 'amount', estimationAmount['housing-maintenance']);
                _l.label = 5;
            case 5:
                if (!housingAnswer.electricityIntensityKey) return [3 /*break*/, 7];
                return [4 /*yield*/, getData('electricity-intensity', housingAnswer.electricityIntensityKey)];
            case 6:
                electricityParam = _l.sent();
                electricityIntensity = createIntensity('electricity');
                electricityIntensity.value = (_d = electricityParam.Item) === null || _d === void 0 ? void 0 : _d.value;
                estimations.push(electricityIntensity);
                _l.label = 7;
            case 7:
                if (!(housingAnswer.electricityMonthlyConsumption &&
                    housingAnswer.electricitySeasonFactorKey)) return [3 /*break*/, 12];
                return [4 /*yield*/, getData('electricity-season-factor', housingAnswer.electricitySeasonFactorKey)];
            case 8:
                electricitySeason = _l.sent();
                mobilityElectricityAmount = 0;
                if (!((mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.hasPrivateCar) &&
                    ((mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carIntensityFactorFirstKey) === 'phv' ||
                        (mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carIntensityFactorFirstKey) === 'ev') &&
                    (mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.privateCarAnnualMileage) &&
                    (mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carChargingKey))) return [3 /*break*/, 11];
                return [4 /*yield*/, getData('car-intensity-factor', mobilityAnswer.carIntensityFactorFirstKey + '_electricity-intensity')];
            case 9:
                electricityData = _l.sent();
                mobilityElectricity = ((_e = electricityData === null || electricityData === void 0 ? void 0 : electricityData.Item) === null || _e === void 0 ? void 0 : _e.value) || 1;
                return [4 /*yield*/, getData('car-charging', mobilityAnswer.carChargingKey)];
            case 10:
                chargingData = _l.sent();
                mobilityCharging = ((_f = chargingData === null || chargingData === void 0 ? void 0 : chargingData.Item) === null || _f === void 0 ? void 0 : _f.value) || 1;
                mobilityElectricityAmount =
                    mobilityAnswer.privateCarAnnualMileage *
                        mobilityElectricity *
                        mobilityCharging;
                _l.label = 11;
            case 11:
                estimationAmount.electricity.value =
                    (housingAnswer.electricityMonthlyConsumption *
                        ((_g = electricitySeason.Item) === null || _g === void 0 ? void 0 : _g.value)) /
                        residentCount -
                        mobilityElectricityAmount;
                pushOrUpdateEstimate('electricity', 'amount', estimationAmount.electricity);
                _l.label = 12;
            case 12:
                if (!housingAnswer.useGas) return [3 /*break*/, 16];
                gasParam = null;
                if (!(housingAnswer.gasMonthlyConsumption &&
                    housingAnswer.gasSeasonFactorKey)) return [3 /*break*/, 15];
                return [4 /*yield*/, getData('gas-season-factor', housingAnswer.gasSeasonFactorKey)];
            case 13:
                gasSeason = _l.sent();
                return [4 /*yield*/, getData('energy-heat-intensity', housingAnswer.energyHeatIntensityKey)];
            case 14:
                gasFactor = _l.sent();
                gasParam =
                    (housingAnswer.gasMonthlyConsumption *
                        (((_h = gasSeason.Item) === null || _h === void 0 ? void 0 : _h.value) || 1) *
                        (((_j = gasFactor.Item) === null || _j === void 0 ? void 0 : _j.value) || 1)) /
                        residentCount;
                _l.label = 15;
            case 15:
                if (housingAnswer.energyHeatIntensityKey === 'lpg') {
                    if (gasParam) {
                        estimationAmount.lpg.value = gasParam;
                    }
                    estimationAmount['urban-gas'].value = 0;
                }
                else {
                    if (gasParam) {
                        estimationAmount['urban-gas'].value = gasParam;
                    }
                    estimationAmount.lpg.value = 0;
                }
                pushOrUpdateEstimate('urban-gas', 'amount', estimationAmount['urban-gas']);
                pushOrUpdateEstimate('lpg', 'amount', estimationAmount.lpg);
                return [3 /*break*/, 17];
            case 16:
                if (housingAnswer.useGas === false) {
                    estimationAmount['urban-gas'].value = 0;
                    estimationAmount.lpg.value = 0;
                    pushOrUpdateEstimate('urban-gas', 'amount', estimationAmount['urban-gas']);
                    pushOrUpdateEstimate('lpg', 'amount', estimationAmount.lpg);
                }
                _l.label = 17;
            case 17:
                if (!housingAnswer.useKerosene) return [3 /*break*/, 20];
                if (!(housingAnswer.keroseneMonthlyConsumption &&
                    housingAnswer.keroseneMonthCount)) return [3 /*break*/, 19];
                return [4 /*yield*/, getData('energy-heat-intensity', 'kerosene')];
            case 18:
                keroseneData = _l.sent();
                estimationAmount.kerosene.value =
                    ((((_k = keroseneData === null || keroseneData === void 0 ? void 0 : keroseneData.Item) === null || _k === void 0 ? void 0 : _k.value) || 1) *
                        (housingAnswer.keroseneMonthlyConsumption *
                            housingAnswer.keroseneMonthCount)) /
                        residentCount;
                _l.label = 19;
            case 19:
                pushOrUpdateEstimate('kerosene', 'amount', estimationAmount.kerosene);
                return [3 /*break*/, 21];
            case 20:
                if (housingAnswer.useKerosene === false) {
                    estimationAmount.kerosene.value = 0;
                    pushOrUpdateEstimate('kerosene', 'amount', estimationAmount.kerosene);
                }
                _l.label = 21;
            case 21: return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateHousing = estimateHousing;
