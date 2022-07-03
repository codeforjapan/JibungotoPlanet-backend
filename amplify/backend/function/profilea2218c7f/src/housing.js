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
    var findAmount, findIntensity, pushOrUpdateEstimate, estimations, params, data, baselines, numberOfPeople, estimationAmount, housingAmountByRegion, params_1, amountByRegion, re_1, housingSizeParams, housingSize, housingSizePerPeople, imputedRentValue, rentValue, electricityIntensityParams, electricityParam, electricityIntensity, electricitySeasonParams, electricitySeason, gasParam, gasSeasonParams, gasSeason;
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
                        dirAndDomain: {
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
                numberOfPeople = housingAnswer.numberOfPeople;
                estimationAmount = {
                    landrent: findAmount(baselines, 'landrent'),
                    otherenergy: findAmount(baselines, 'otherenergy'),
                    water: findAmount(baselines, 'water'),
                    imputedrent: findAmount(baselines, 'imputedrent'),
                    rent: findAmount(baselines, 'rent'),
                    'housing-maintenance': findAmount(baselines, 'housing-maintenance'),
                    electricity: findAmount(baselines, 'electricity'),
                    urbangas: findAmount(baselines, 'urbangas'),
                    lpg: findAmount(baselines, 'lpg'),
                    kerosene: findAmount(baselines, 'kerosene')
                };
                if (!housingAnswer.housingAmountByRegion) return [3 /*break*/, 3];
                housingAmountByRegion = housingAnswer.housingAmountByRegion;
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
                    estimationAmount[key].value = item.value;
                    // estimations.push(toEstimation(estimationAmount[key]))
                });
                _e.label = 3;
            case 3:
                if (!housingAnswer.housingSize) return [3 /*break*/, 5];
                housingSizeParams = {
                    TableName: parameterTableName,
                    KeyConditions: {
                        category: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['housing-size']
                        },
                        key: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: [housingAnswer.housingSize]
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(housingSizeParams).promise()];
            case 4:
                housingSize = _e.sent();
                housingSizePerPeople = ((_a = housingSize.Items[0]) === null || _a === void 0 ? void 0 : _a.value) / numberOfPeople;
                imputedRentValue = estimationAmount.imputedrent.value;
                rentValue = estimationAmount.rent.value;
                estimationAmount.imputedrent.value =
                    (housingSizePerPeople / (imputedRentValue + rentValue)) * imputedRentValue;
                estimationAmount.rent.value =
                    (housingSizePerPeople / (imputedRentValue + rentValue)) * rentValue;
                estimationAmount['housing-maintenance'].value =
                    (estimationAmount['housing-maintenance'].value /
                        (imputedRentValue + rentValue)) *
                        (estimationAmount.imputedrent.value + estimationAmount.rent.value);
                estimations.push((0, util_1.toEstimation)(estimationAmount.imputedrent));
                estimations.push((0, util_1.toEstimation)(estimationAmount.rent));
                estimations.push((0, util_1.toEstimation)(estimationAmount['housing-maintenance']));
                _e.label = 5;
            case 5:
                if (!housingAnswer.electricityIntensity) return [3 /*break*/, 7];
                electricityIntensityParams = {
                    TableName: parameterTableName,
                    KeyConditions: {
                        category: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['electricity-intensity']
                        },
                        key: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: [housingAnswer.electricityIntensity]
                        }
                    }
                };
                return [4 /*yield*/, dynamodb
                        .query(electricityIntensityParams)
                        .promise()];
            case 6:
                electricityParam = _e.sent();
                electricityIntensity = findIntensity(baselines, 'electricity');
                electricityIntensity.value = (_b = electricityParam.Items[0]) === null || _b === void 0 ? void 0 : _b.value;
                estimations.push((0, util_1.toEstimation)(electricityIntensity));
                _e.label = 7;
            case 7:
                if (!(housingAnswer.howManyElectricity &&
                    housingAnswer.electricitySeasonFactor)) return [3 /*break*/, 9];
                electricitySeasonParams = {
                    TableName: parameterTableName,
                    KeyConditions: {
                        category: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['electricity-season-factor']
                        },
                        key: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: [housingAnswer.electricitySeasonFactor]
                        }
                    }
                };
                return [4 /*yield*/, dynamodb
                        .query(electricitySeasonParams)
                        .promise()
                    // todo 電気時自動車分をどうやって取ってくるか
                ];
            case 8:
                electricitySeason = _e.sent();
                // todo 電気時自動車分をどうやって取ってくるか
                estimationAmount.electricity.value =
                    (housingAnswer.howManyElectricity * ((_c = electricitySeason.Items[0]) === null || _c === void 0 ? void 0 : _c.value)) /
                        numberOfPeople;
                estimations.push((0, util_1.toEstimation)(estimationAmount.electricity));
                _e.label = 9;
            case 9:
                if (!housingAnswer.useGas) return [3 /*break*/, 12];
                gasParam = null;
                if (!(housingAnswer.howManyGas && housingAnswer.gasSeasonFactor)) return [3 /*break*/, 11];
                gasSeasonParams = {
                    TableName: parameterTableName,
                    KeyConditions: {
                        category: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['gas-season-factor']
                        },
                        key: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: [housingAnswer.gasSeasonFactor]
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(gasSeasonParams).promise()];
            case 10:
                gasSeason = _e.sent();
                gasParam =
                    (housingAnswer.howManyGas * ((_d = gasSeason.Items[0]) === null || _d === void 0 ? void 0 : _d.value)) / numberOfPeople;
                _e.label = 11;
            case 11:
                if (housingAnswer.energyHeatIntensity === 'lpg') {
                    if (gasParam) {
                        estimationAmount.lpg.value = gasParam;
                    }
                    estimationAmount.urbangas.value = 0;
                }
                else {
                    if (gasParam) {
                        estimationAmount.urbangas.value = gasParam;
                    }
                    estimationAmount.lpg.value = 0;
                }
                estimations.push((0, util_1.toEstimation)(estimationAmount.urbangas));
                estimations.push((0, util_1.toEstimation)(estimationAmount.lpg));
                return [3 /*break*/, 13];
            case 12:
                if (housingAnswer.useGas === false) {
                    estimationAmount.urbangas.value = 0;
                    estimationAmount.lpg.value = 0;
                    estimations.push((0, util_1.toEstimation)(estimationAmount.urbangas));
                    estimations.push((0, util_1.toEstimation)(estimationAmount.lpg));
                    // pushOrUpdateEstimate('urbangas', 'amount', toEstimation(estimationAmount.urbangas))
                    // pushOrUpdateEstimate('lpg', 'amount', toEstimation(estimationAmount.lpg))
                }
                _e.label = 13;
            case 13:
                // 灯油の使用の有無
                if (housingAnswer.useKerosene) {
                    if (housingAnswer.howManyKerosene && housingAnswer.howManyKeroseneMonth) {
                        estimationAmount.kerosene.value =
                            (housingAnswer.howManyKerosene * housingAnswer.howManyKeroseneMonth) /
                                numberOfPeople;
                    }
                    estimations.push((0, util_1.toEstimation)(estimationAmount.kerosene));
                    // pushOrUpdateEstimate('kerosene', 'amount', toEstimation(estimationAmount.kerosene))
                }
                else if (housingAnswer.useKerosene === false) {
                    estimationAmount.kerosene.value = 0;
                    estimations.push((0, util_1.toEstimation)(estimationAmount.kerosene));
                    // pushOrUpdateEstimate('kerosene', 'amount', toEstimation(estimationAmount.kerosene))
                }
                console.log(JSON.stringify(estimations));
                return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateHousing = estimateHousing;
