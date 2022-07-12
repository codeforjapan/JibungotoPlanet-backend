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
var estimateHousing = function (dynamodb, housingAnswer, footprintTableName, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var findAmount, findIntensity, pushOrUpdateEstimate, estimations, params, data, baselines, residentCount, estimationAmount, housingAmountByRegion, params_1, amountByRegion, re_1, housingSize, housingSizePerPeople, imputedRentValue, rentValue, electricityParam, electricityIntensity, electricitySeason, gasParam, gasSeason;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                findAmount = function (baselines, item) {
                    return (0, util_1.findBaseline)(baselines, 'housing', item, 'amount');
                };
                findIntensity = function (baselines, item) {
                    return (0, util_1.findBaseline)(baselines, 'housing', item, 'intensity');
                };
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
                data = _e.sent();
                baselines = data.Items.map(function (item) { return (0, util_1.toBaseline)(item); });
                // 回答がない場合はベースラインのみ返す
                if (!housingAnswer) {
                    return [2 /*return*/, { baselines: baselines, estimations: estimations }];
                }
                residentCount = housingAnswer.residentCount;
                estimationAmount = {
                    'land-rent': findAmount(baselines, 'land-rent'),
                    'other-energy': findAmount(baselines, 'other-energy'),
                    water: findAmount(baselines, 'water'),
                    'imputed-rent': findAmount(baselines, 'imputed-rent'),
                    rent: findAmount(baselines, 'rent'),
                    'housing-maintenance': findAmount(baselines, 'housing-maintenance'),
                    electricity: findAmount(baselines, 'electricity'),
                    'urban-gas': findAmount(baselines, 'urban-gas'),
                    lpg: findAmount(baselines, 'lpg'),
                    kerosene: findAmount(baselines, 'kerosene')
                };
                if (!housingAnswer.housingAmountByRegionFirstKey) return [3 /*break*/, 3];
                housingAmountByRegion = housingAnswer.housingAmountByRegionFirstKey;
                params_1 = {
                    TableName: parameterTableName,
                    KeyConditions: {
                        category: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['housing-amount-by-region']
                        },
                        key: {
                            ComparisonOperator: 'BEGINS_WITH',
                            AttributeValueList: [housingAmountByRegion]
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(params_1).promise()];
            case 2:
                amountByRegion = _e.sent();
                re_1 = new RegExp("".concat(housingAmountByRegion, "_(.*)-amount"));
                amountByRegion.Items.forEach(function (item) {
                    var key = item.key.match(re_1)[1];
                    estimations.push((0, util_1.toEstimation)(estimationAmount[key]));
                });
                _e.label = 3;
            case 3:
                if (!housingAnswer.housingSizeKey) return [3 /*break*/, 5];
                return [4 /*yield*/, dynamodb.get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'housing-size',
                            key: housingAnswer.housingSizeKey
                        }
                    }).promise()];
            case 4:
                housingSize = _e.sent();
                housingSizePerPeople = ((_a = housingSize.Item) === null || _a === void 0 ? void 0 : _a.value) / residentCount;
                imputedRentValue = estimationAmount['imputed-rent'].value;
                rentValue = estimationAmount.rent.value;
                estimationAmount['imputed-rent'].value =
                    (housingSizePerPeople / (imputedRentValue + rentValue)) * imputedRentValue;
                estimationAmount.rent.value =
                    (housingSizePerPeople / (imputedRentValue + rentValue)) * rentValue;
                estimationAmount['housing-maintenance'].value =
                    (estimationAmount['housing-maintenance'].value /
                        (imputedRentValue + rentValue)) *
                        (estimationAmount['imputed-rent'].value + estimationAmount.rent.value);
                pushOrUpdateEstimate('imputed-rent', 'amount', (0, util_1.toEstimation)(estimationAmount['imputed-rent']));
                pushOrUpdateEstimate('rent', 'amount', (0, util_1.toEstimation)(estimationAmount.rent));
                pushOrUpdateEstimate('housing-maintenance', 'amount', (0, util_1.toEstimation)(estimationAmount['housing-maintenance']));
                _e.label = 5;
            case 5:
                if (!housingAnswer.electricityIntensityKey) return [3 /*break*/, 7];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'electricity-intensity',
                            key: housingAnswer.electricityIntensityKey
                        }
                    })
                        .promise()];
            case 6:
                electricityParam = _e.sent();
                electricityIntensity = findIntensity(baselines, 'electricity');
                electricityIntensity.value = (_b = electricityParam.Item) === null || _b === void 0 ? void 0 : _b.value;
                estimations.push((0, util_1.toEstimation)(electricityIntensity));
                _e.label = 7;
            case 7:
                if (!(housingAnswer.electricityMonthlyConsumption &&
                    housingAnswer.electricitySeasonFactorKey)) return [3 /*break*/, 9];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'electricity-season-factor',
                            key: housingAnswer.electricitySeasonFactorKey
                        }
                    })
                        .promise()
                    // todo 電気時自動車分をどうやって取ってくるか
                ];
            case 8:
                electricitySeason = _e.sent();
                // todo 電気時自動車分をどうやって取ってくるか
                estimationAmount.electricity.value =
                    (housingAnswer.electricityMonthlyConsumption *
                        ((_c = electricitySeason.Item) === null || _c === void 0 ? void 0 : _c.value)) /
                        residentCount;
                pushOrUpdateEstimate('electricity', 'amount', (0, util_1.toEstimation)(estimationAmount.electricity));
                _e.label = 9;
            case 9:
                if (!housingAnswer.useGas) return [3 /*break*/, 12];
                gasParam = null;
                if (!(housingAnswer.gasMonthlyConsumption &&
                    housingAnswer.gasSeasonFactorKey)) return [3 /*break*/, 11];
                return [4 /*yield*/, dynamodb.get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'gas-season-factor',
                            key: housingAnswer.gasSeasonFactorKey
                        }
                    }).promise()];
            case 10:
                gasSeason = _e.sent();
                gasParam =
                    (housingAnswer.gasMonthlyConsumption * ((_d = gasSeason.Item) === null || _d === void 0 ? void 0 : _d.value)) /
                        residentCount;
                _e.label = 11;
            case 11:
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
                pushOrUpdateEstimate('urban-gas', 'amount', (0, util_1.toEstimation)(estimationAmount['urban-gas']));
                pushOrUpdateEstimate('lpg', 'amount', (0, util_1.toEstimation)(estimationAmount.lpg));
                return [3 /*break*/, 13];
            case 12:
                if (housingAnswer.useGas === false) {
                    estimationAmount['urban-gas'].value = 0;
                    estimationAmount.lpg.value = 0;
                    pushOrUpdateEstimate('urban-gas', 'amount', (0, util_1.toEstimation)(estimationAmount['urban-gas']));
                    pushOrUpdateEstimate('lpg', 'amount', (0, util_1.toEstimation)(estimationAmount.lpg));
                }
                _e.label = 13;
            case 13:
                // 灯油の使用の有無
                if (housingAnswer.useKerosene) {
                    if (housingAnswer.keroseneMonthlyConsumption &&
                        housingAnswer.keroseneMonthCount) {
                        estimationAmount.kerosene.value =
                            (housingAnswer.keroseneMonthlyConsumption *
                                housingAnswer.keroseneMonthCount) /
                                residentCount;
                    }
                    pushOrUpdateEstimate('kerosene', 'amount', (0, util_1.toEstimation)(estimationAmount.kerosene));
                }
                else if (housingAnswer.useKerosene === false) {
                    estimationAmount.kerosene.value = 0;
                    pushOrUpdateEstimate('kerosene', 'amount', (0, util_1.toEstimation)(estimationAmount.kerosene));
                }
                console.log(JSON.stringify(estimations));
                return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateHousing = estimateHousing;
