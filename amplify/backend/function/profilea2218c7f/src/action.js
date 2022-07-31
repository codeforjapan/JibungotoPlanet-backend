"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.calculateActions = void 0;
var util_1 = require("./util");
// dynamodbのレコードをoptionへの変換
var toOption = function (rec) {
    var domain_item_type = rec.domain_item_type.split('_');
    return {
        key: rec.domain_item_type,
        option: rec.option,
        domain: domain_item_type[0],
        item: domain_item_type[1],
        type: domain_item_type[2],
        value: rec.value,
        args: rec.args,
        operation: rec.operation
    };
};
var calculateActions = function (dynamodb, baselines, estimations, housingAnswer, mobilityAnswer, foodAnswer, parameterTableName, optionTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var results, _i, baselines_1, baseline, _a, estimations_1, estimation, key, result, toAction, optionData, actions, phase1, _b, _c, action, _d, phase2, _e, _f, action, phase3, _g, _h, action;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                results = new Map();
                for (_i = 0, baselines_1 = baselines; _i < baselines_1.length; _i++) {
                    baseline = baselines_1[_i];
                    results.set(baseline.domain + '_' + baseline.item + '_' + baseline.type, {
                        actions: new Map(),
                        estimation: (0, util_1.toEstimation)(baseline),
                        baseline: baseline
                    });
                }
                // estimationを上書き
                for (_a = 0, estimations_1 = estimations; _a < estimations_1.length; _a++) {
                    estimation = estimations_1[_a];
                    key = estimation.domain + '_' + estimation.item + '_' + estimation.type;
                    result = results.get(key);
                    result.estimation = estimation;
                    results.set(key, result);
                }
                toAction = function (option) {
                    var result = results.get(option.key);
                    return __assign(__assign({ key: option.key }, result.estimation), { option: option.option, optionValue: option.value, args: option.args, operation: option.operation });
                };
                return [4 /*yield*/, dynamodb
                        .scan({
                        TableName: optionTableName
                    })
                        .promise()
                    // resultがある場合にactionを作成
                ];
            case 1:
                optionData = _j.sent();
                actions = optionData.Items.map(function (item) { return toOption(item); })
                    .filter(function (option) { return results.has(option.key); })
                    .map(function (option) { return toAction(option); });
                phase1 = new Set([
                    'absolute-target',
                    'add-amount',
                    'increase-rate',
                    'reduction-rate',
                    'question-reduction-rate',
                    'question-answer-to-target',
                    'question-answer-to-target-inverse'
                ]);
                _b = 0, _c = actions.filter(function (action) {
                    return phase1.has(action.operation);
                });
                _j.label = 2;
            case 2:
                if (!(_b < _c.length)) return [3 /*break*/, 14];
                action = _c[_b];
                _d = action.operation;
                switch (_d) {
                    case 'absolute-target': return [3 /*break*/, 3];
                    case 'add-amount': return [3 /*break*/, 4];
                    case 'increase-rate': return [3 /*break*/, 5];
                    case 'reduction-rate': return [3 /*break*/, 5];
                    case 'question-answer-to-target-inverse': return [3 /*break*/, 6];
                    case 'question-answer-to-target': return [3 /*break*/, 8];
                    case 'question-reduction-rate': return [3 /*break*/, 10];
                }
                return [3 /*break*/, 12];
            case 3:
                absoluteTarget(action);
                return [3 /*break*/, 12];
            case 4:
                addAmount(action);
                return [3 /*break*/, 12];
            case 5:
                increaseRate(action);
                return [3 /*break*/, 12];
            case 6: return [4 /*yield*/, questionAnswerToTargetInverse(action, dynamodb, mobilityAnswer, parameterTableName)];
            case 7:
                _j.sent();
                return [3 /*break*/, 12];
            case 8: return [4 /*yield*/, questionAnswerToTarget(action, dynamodb, housingAnswer, mobilityAnswer, foodAnswer, parameterTableName)];
            case 9:
                _j.sent();
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, questionReductionRate(action, dynamodb, housingAnswer, parameterTableName)];
            case 11:
                _j.sent();
                return [3 /*break*/, 12];
            case 12:
                results.get(action.key).actions.set(action.option, action); // actionを登録
                _j.label = 13;
            case 13:
                _b++;
                return [3 /*break*/, 2];
            case 14:
                phase2 = new Set([
                    'proportional-to-other-items',
                    'shift-from-other-items'
                ]);
                for (_e = 0, _f = actions.filter(function (action) {
                    return phase2.has(action.operation);
                }); _e < _f.length; _e++) {
                    action = _f[_e];
                    switch (action.operation) {
                        case 'shift-from-other-items':
                            shiftFromOtherItems(action, results);
                            break;
                        case 'proportional-to-other-items':
                            proportionalToOtherItems(action, results);
                            break;
                    }
                    results.get(action.key).actions.set(action.option, action); // actionを登録
                }
                phase3 = new Set([
                    'further-reduction-from-other-footprints',
                    'proportional-to-other-footprints',
                    'rebound-from-other-footprints'
                ]);
                for (_g = 0, _h = actions.filter(function (action) {
                    return phase3.has(action.operation);
                }); _g < _h.length; _g++) {
                    action = _h[_g];
                    switch (action.operation) {
                        case 'proportional-to-other-footprints':
                            proportionalToOtherFootprints(action, results);
                            break;
                        case 'further-reduction-from-other-footprints':
                            furtherReductionFromOtherFootprints(action, results);
                            break;
                        case 'rebound-from-other-footprints':
                            reboundFromOtherFootprints(action, results);
                            break;
                    }
                    results.get(action.key).actions.set(action.option, action); // actionを登録
                }
                // keyを削除してactionsを返す
                return [2 /*return*/, actions.map(function (action) {
                        action.key = undefined;
                        return action;
                    })];
        }
    });
}); };
exports.calculateActions = calculateActions;
// [削減後] = [value]
var absoluteTarget = function (action) {
    action.value = action.optionValue;
};
// [削減後] = [削減前] + [value]
var addAmount = function (action) {
    action.value += action.optionValue;
};
// [削減後] = [削減前] x (1+[value])
var increaseRate = function (action) {
    action.value *= 1 + action.optionValue;
};
// [削減後] = [削減前] - Σ([valueに指定した複数項目の削減後]-[valueで指定した複数項目の削減前]) x [value2で指定した代替率]
var shiftFromOtherItems = function (action, results) {
    var sum = action.args.reduce(function (sum, key) {
        var _a, _b;
        var result = results.get(key);
        var value = 0;
        if (result) {
            var before = (_a = result.estimation) === null || _a === void 0 ? void 0 : _a.value;
            var after = (_b = result.actions.get(action.option)) === null || _b === void 0 ? void 0 : _b.value;
            if (before !== null &&
                before !== undefined &&
                after !== null &&
                after !== undefined) {
                value = after - before;
            }
        }
        return sum + value;
    }, 0);
    action.value -= sum * action.optionValue;
};
// [削減後] = [削減前] x (1-[value2で指定した影響割合])
//  + [削減前] x [value2で指定した影響割合] x (Σ[valueで指定した複数項目の削減後] /Σ[valueで指定した複数項目の削減前])
var proportionalToOtherItems = function (action, results) {
    var _a, _b, _c, _d;
    var sumBefore = 0;
    var sumAfter = 0;
    for (var _i = 0, _e = action.args; _i < _e.length; _i++) {
        var key = _e[_i];
        var before = ((_b = (_a = results.get(key)) === null || _a === void 0 ? void 0 : _a.estimation) === null || _b === void 0 ? void 0 : _b.value) || 0;
        var after = (_d = (_c = results.get(key)) === null || _c === void 0 ? void 0 : _c.actions.get(action.option)) === null || _d === void 0 ? void 0 : _d.value;
        if (after === null || after === undefined) {
            after = before;
        }
        sumBefore += before;
        sumAfter += after;
    }
    if (sumBefore !== 0) {
        action.value =
            action.value * (1 - action.optionValue) +
                action.value * action.optionValue * (sumAfter / sumBefore);
    }
};
// [削減後] = [削減前] x (1-[value2で指定した影響割合])
//  + [削減前] x [value2で指定した影響割合] x ([valueで指定したフットプリントの削減後] / [valueで指定したフットプリントの削減前])
var proportionalToOtherFootprints = function (action, results) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var sumBefore = 0;
    var sumAfter = 0;
    for (var _i = 0, _j = action.args; _i < _j.length; _i++) {
        var key = _j[_i];
        var amountBefore = ((_b = (_a = results.get(key + '_amount')) === null || _a === void 0 ? void 0 : _a.estimation) === null || _b === void 0 ? void 0 : _b.value) || 0;
        var amountAfter = (_d = (_c = results
            .get(key + '_amount')) === null || _c === void 0 ? void 0 : _c.actions.get(action.option)) === null || _d === void 0 ? void 0 : _d.value;
        var intensityBefore = ((_f = (_e = results.get(key + '_intensity')) === null || _e === void 0 ? void 0 : _e.estimation) === null || _f === void 0 ? void 0 : _f.value) || 0;
        var intensityAfter = (_h = (_g = results
            .get(key + '_intensity')) === null || _g === void 0 ? void 0 : _g.actions.get(action.option)) === null || _h === void 0 ? void 0 : _h.value;
        if (amountAfter === null || amountAfter === undefined) {
            amountAfter = amountBefore;
        }
        if (intensityAfter === null || intensityAfter === undefined) {
            intensityAfter = intensityBefore;
        }
        sumBefore += amountBefore * intensityBefore;
        sumAfter += amountAfter * intensityAfter;
    }
    if (sumBefore !== 0) {
        action.value =
            action.value * (1 - action.optionValue) +
                action.value * action.optionValue * (sumAfter / sumBefore);
    }
};
var reboundFromOtherFootprints = function (action, results) {
    furtherReductionFromOtherFootprints(action, results, 1);
};
// [削減後] = [削減前] + (Σ[valueで指定したフットプリントの削減後] - Σ[valueで指定したフットプリントの削減前]) x [value2で指定したリバウンド割合]
var furtherReductionFromOtherFootprints = function (action, results, sign) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (sign === void 0) { sign = -1; }
    var sumBefore = 0;
    var sumAfter = 0;
    for (var _i = 0, _j = action.args; _i < _j.length; _i++) {
        var key = _j[_i];
        var amountBefore = ((_b = (_a = results.get(key + '_amount')) === null || _a === void 0 ? void 0 : _a.estimation) === null || _b === void 0 ? void 0 : _b.value) || 0;
        var amountAfter = (_d = (_c = results
            .get(key + '_amount')) === null || _c === void 0 ? void 0 : _c.actions.get(action.option)) === null || _d === void 0 ? void 0 : _d.value;
        var intensityBefore = ((_f = (_e = results.get(key + '_intensity')) === null || _e === void 0 ? void 0 : _e.estimation) === null || _f === void 0 ? void 0 : _f.value) || 0;
        var intensityAfter = (_h = (_g = results
            .get(key + '_intensity')) === null || _g === void 0 ? void 0 : _g.actions.get(action.option)) === null || _h === void 0 ? void 0 : _h.value;
        if (amountAfter === null || amountAfter === undefined) {
            amountAfter = amountBefore;
        }
        if (intensityAfter === null || intensityAfter === undefined) {
            intensityAfter = intensityBefore;
        }
        sumBefore += amountBefore * intensityBefore;
        sumAfter += amountAfter * intensityAfter;
    }
    var amount = 0;
    var intensity = 0;
    var denominator = 1;
    if (action.type === 'amount') {
        amount = action.value;
        intensity = results.get(action.key.replace('_amount', '_intensity'))
            .estimation.value;
        denominator = intensity;
    }
    else {
        intensity = action.value;
        amount = results.get(action.key.replace('_intensity', '_amount')).estimation
            .value;
        denominator = amount;
    }
    action.value =
        (amount * intensity + sign * (sumAfter - sumBefore) * action.optionValue) /
            denominator;
};
var getData = function (dynamodb, parameterTableName, category, key) { return __awaiter(void 0, void 0, void 0, function () {
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
                // rideshareだけなのでrideshareに特化した実装
            ];
            case 1: return [2 /*return*/, _a.sent()
                // rideshareだけなのでrideshareに特化した実装
            ];
        }
    });
}); };
// rideshareだけなのでrideshareに特化した実装
var questionAnswerToTargetInverse = function (action, dynamodb, mobilityAnswer, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var data, data;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!(action.args[0] === 'mobility_taxi-car-passengers')) return [3 /*break*/, 2];
                return [4 /*yield*/, getData(dynamodb, parameterTableName, 'car-passengers', ((mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carPassengersFirstKey) || 'unknown') + '_taxi-passengers')];
            case 1:
                data = _e.sent();
                if ((_a = data === null || data === void 0 ? void 0 : data.Item) === null || _a === void 0 ? void 0 : _a.value) {
                    action.value *= ((_b = data === null || data === void 0 ? void 0 : data.Item) === null || _b === void 0 ? void 0 : _b.value) / action.optionValue;
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, getData(dynamodb, parameterTableName, 'car-passengers', (mobilityAnswer.carPassengersFirstKey || 'unknown') +
                    '_private-car-passengers')];
            case 3:
                data = _e.sent();
                if ((_c = data === null || data === void 0 ? void 0 : data.Item) === null || _c === void 0 ? void 0 : _c.value) {
                    action.value *= ((_d = data === null || data === void 0 ? void 0 : data.Item) === null || _d === void 0 ? void 0 : _d.value) / action.optionValue;
                }
                _e.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
// car-ev-phv, car-ev-phv-re, lossで適用。
// argsは、mobility_driving-intensity, mobility_manufacturing-intensity, food_food-amount-to-average
var questionAnswerToTarget = function (action, dynamodb, housingAnswer, mobilityAnswer, foodAnswer, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var electricityIntensityFactor, electricityData, carChargingData, ghgIntensity, data, data_1, data, foodDirectWasteFactor, foodLeftoverFactor, foodWastRatio, leftoverRatio, directWasteRatio, foodWasteRatio, foodLossAverageRatio, foodPurchaseAmountConsideringFoodLossRatio;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(action.args[0] === 'mobility_driving-intensity')) return [3 /*break*/, 7];
                electricityIntensityFactor = 0;
                if (!(housingAnswer === null || housingAnswer === void 0 ? void 0 : housingAnswer.electricityIntensityKey)) return [3 /*break*/, 3];
                return [4 /*yield*/, getData(dynamodb, parameterTableName, 'electricity-intensity-factor', housingAnswer.electricityIntensityKey)];
            case 1:
                electricityData = _c.sent();
                if (electricityData === null || electricityData === void 0 ? void 0 : electricityData.Item) {
                    electricityIntensityFactor = electricityData.Item.value;
                }
                return [4 /*yield*/, getData(dynamodb, parameterTableName, 'car-charging', (mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carChargingKey) || 'unknown')];
            case 2:
                carChargingData = _c.sent();
                if (carChargingData === null || carChargingData === void 0 ? void 0 : carChargingData.Item) {
                    electricityIntensityFactor *= carChargingData.Item.value;
                }
                _c.label = 3;
            case 3:
                ghgIntensity = 1;
                return [4 /*yield*/, getData(dynamodb, parameterTableName, 'car-intensity-factor', ((mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carIntensityFactorFirstKey) || 'unknown') +
                        '_driving-intensity')];
            case 4:
                data = _c.sent();
                if (data === null || data === void 0 ? void 0 : data.Item) {
                    ghgIntensity = data.Item.value;
                }
                if (!((mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carIntensityFactorFirstKey) === 'phv' ||
                    (mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carIntensityFactorFirstKey) === 'ev')) return [3 /*break*/, 6];
                return [4 /*yield*/, getData(dynamodb, parameterTableName, 'renewable-car-intensity-factor', ((mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carIntensityFactorFirstKey) || 'unknown') +
                        '_driving-factor')];
            case 5:
                data_1 = _c.sent();
                if (data_1 === null || data_1 === void 0 ? void 0 : data_1.Item) {
                    ghgIntensity =
                        ghgIntensity * (1 - electricityIntensityFactor) +
                            data_1.Item.value * electricityIntensityFactor;
                }
                _c.label = 6;
            case 6:
                action.value *= action.optionValue / ghgIntensity;
                return [3 /*break*/, 13];
            case 7:
                if (!(action.args[0] === 'mobility_manufacturing-intensity')) return [3 /*break*/, 9];
                return [4 /*yield*/, getData(dynamodb, parameterTableName, 'car-intensity-factor', ((mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carIntensityFactorFirstKey) || 'unknown') +
                        '_manufacturing-intensity')];
            case 8:
                data = _c.sent();
                if (data === null || data === void 0 ? void 0 : data.Item) {
                    action.value *= action.optionValue / data.Item.value;
                }
                return [3 /*break*/, 13];
            case 9:
                if (!(action.args[0] === 'food_food-amount-to-average')) return [3 /*break*/, 13];
                if (!(foodAnswer.foodDirectWasteFactorKey &&
                    foodAnswer.foodLeftoverFactorKey)) return [3 /*break*/, 13];
                return [4 /*yield*/, getData(dynamodb, parameterTableName, 'food-direct-waste-factor', foodAnswer.foodDirectWasteFactorKey)];
            case 10:
                foodDirectWasteFactor = _c.sent();
                return [4 /*yield*/, getData(dynamodb, parameterTableName, 'food-leftover-factor', foodAnswer.foodLeftoverFactorKey)];
            case 11:
                foodLeftoverFactor = _c.sent();
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['food-waste-share']
                            }
                        }
                    })
                        .promise()];
            case 12:
                foodWastRatio = _c.sent();
                leftoverRatio = foodWastRatio.Items.find(function (item) { return item.key === 'leftover-per-food-waste'; });
                directWasteRatio = foodWastRatio.Items.find(function (item) { return item.key === 'direct-waste-per-food-waste'; });
                foodWasteRatio = foodWastRatio.Items.find(function (item) { return item.key === 'food-waste-per-food'; });
                foodLossAverageRatio = ((_a = foodDirectWasteFactor.Item) === null || _a === void 0 ? void 0 : _a.value) * directWasteRatio.value +
                    ((_b = foodLeftoverFactor.Item) === null || _b === void 0 ? void 0 : _b.value) * leftoverRatio.value;
                foodPurchaseAmountConsideringFoodLossRatio = (1 + foodLossAverageRatio * foodWasteRatio.value) /
                    (1 + foodWasteRatio.value);
                action.value *=
                    action.optionValue / foodPurchaseAmountConsideringFoodLossRatio;
                _c.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); };
// insrenov, clothes-homeのみ
var questionReductionRate = function (action, dynamodb, housingAnswer, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var data, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(action.args[0] === 'housing_housing-insulation-renovation')) return [3 /*break*/, 2];
                return [4 /*yield*/, getData(dynamodb, parameterTableName, 'housing-insulation', (housingAnswer.housingInsulationFirstKey || 'unknown') + '_renovation')];
            case 1:
                data = _a.sent();
                if (data === null || data === void 0 ? void 0 : data.Item) {
                    action.value *= 1 + action.optionValue * data.Item.value;
                }
                return [3 /*break*/, 4];
            case 2:
                if (!(action.args[0] === 'housing_housing-insulation-clothing')) return [3 /*break*/, 4];
                return [4 /*yield*/, getData(dynamodb, parameterTableName, 'housing-insulation', (housingAnswer.housingInsulationFirstKey || 'unknown') + '_clothing')];
            case 3:
                data = _a.sent();
                if (data === null || data === void 0 ? void 0 : data.Item) {
                    action.value *= 1 + action.optionValue * data.Item.value;
                }
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
