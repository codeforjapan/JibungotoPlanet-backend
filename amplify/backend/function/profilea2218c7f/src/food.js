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
exports.estimateFood = void 0;
var util_1 = require("./util");
var estimateFood = function (dynamodb, foodAnswer, footprintTableName, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var findAmount, estimations, params, data, baselines, foodIntakeFactor, estimationAmount, foodDirectWasteFactor, foodLeftoverFactor, foodWastRatio, leftoverRatio, directWasteRatio, foodWasteRatio, foodLossAverageRatio, foodPurchaseAmountConsideringFoodLossRatio, dairyFoodFactor, dishBeefFactor, dishPorkFactor, dishChickenFactor, dishSeafoodFactor, alcoholFactor, alcoholFactor, softDrinkSnackFactor;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    return __generator(this, function (_3) {
        switch (_3.label) {
            case 0:
                findAmount = function (baselines, item) {
                    return (0, util_1.findBaseline)(baselines, 'food', item, 'amount');
                };
                estimations = [];
                params = {
                    TableName: footprintTableName,
                    KeyConditions: {
                        dirAndDomain: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['baseline_food']
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(params).promise()];
            case 1:
                data = _3.sent();
                baselines = data.Items.map(function (item) { return (0, util_1.toBaseline)(item); });
                // 回答がない場合はベースラインのみ返す
                if (!foodAnswer) {
                    return [2 /*return*/, { baselines: baselines, estimations: estimations }];
                }
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['food-intake-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.foodIntakeFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 2:
                foodIntakeFactor = _3.sent();
                estimationAmount = {
                    rice: findAmount(baselines, 'rice'),
                    'bread-flour': findAmount(baselines, 'bread-flour'),
                    noodle: findAmount(baselines, 'noodle'),
                    potatoes: findAmount(baselines, 'potatoes'),
                    vegetables: findAmount(baselines, 'vegetables'),
                    'processed-vegetables': findAmount(baselines, 'processed-vegetables'),
                    beans: findAmount(baselines, 'beans'),
                    milk: findAmount(baselines, 'milk'),
                    'other-dairy': findAmount(baselines, 'other-dairy'),
                    eggs: findAmount(baselines, 'eggs'),
                    beef: findAmount(baselines, 'beef'),
                    pork: findAmount(baselines, 'pork'),
                    chicken: findAmount(baselines, 'chicken'),
                    'other-meat': findAmount(baselines, 'other-meat'),
                    'processed-meat': findAmount(baselines, 'processed-meat'),
                    fish: findAmount(baselines, 'fish'),
                    'processed-fish': findAmount(baselines, 'processed-fish'),
                    fruits: findAmount(baselines, 'fruits'),
                    oil: findAmount(baselines, 'oil'),
                    seasoning: findAmount(baselines, 'seasoning'),
                    'sweets-snack': findAmount(baselines, 'sweets-snack'),
                    'ready-meal': findAmount(baselines, 'ready-meal'),
                    alcohol: findAmount(baselines, 'alcohol'),
                    'coffee-tea': findAmount(baselines, 'coffee-tea'),
                    'cold-drink': findAmount(baselines, 'cold-drink')
                };
                if (!(foodAnswer.foodDirectWasteFactorKey && foodAnswer.foodLeftoverFactorKey)) return [3 /*break*/, 21];
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['food-direct-waste-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.foodDirectWasteFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 3:
                foodDirectWasteFactor = _3.sent();
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['food-leftover-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.foodLeftoverFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 4:
                foodLeftoverFactor = _3.sent();
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
            case 5:
                foodWastRatio = _3.sent();
                leftoverRatio = foodWastRatio.Items.find(function (item) { return item.key === 'leftover-per-food-waste'; });
                directWasteRatio = foodWastRatio.Items.find(function (item) { return item.key === 'direct-waste-per-food-waste'; });
                foodWasteRatio = foodWastRatio.Items.find(function (item) { return item.key === 'food-waste-per-food'; });
                foodLossAverageRatio = ((_a = foodDirectWasteFactor.Items[0]) === null || _a === void 0 ? void 0 : _a.value) * directWasteRatio.value +
                    ((_b = foodLeftoverFactor.Items[0]) === null || _b === void 0 ? void 0 : _b.value) * leftoverRatio.value;
                foodPurchaseAmountConsideringFoodLossRatio = (1 + foodLossAverageRatio * foodWasteRatio.value) /
                    (1 + foodWasteRatio.value);
                estimationAmount.rice.value =
                    estimationAmount.rice.value *
                        ((_c = foodIntakeFactor.Items[0]) === null || _c === void 0 ? void 0 : _c.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['bread-flour'].value =
                    estimationAmount['bread-flour'].value *
                        ((_d = foodIntakeFactor.Items[0]) === null || _d === void 0 ? void 0 : _d.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.noodle.value =
                    estimationAmount.noodle.value *
                        ((_e = foodIntakeFactor.Items[0]) === null || _e === void 0 ? void 0 : _e.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.potatoes.value =
                    estimationAmount.potatoes.value *
                        ((_f = foodIntakeFactor.Items[0]) === null || _f === void 0 ? void 0 : _f.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.vegetables.value =
                    estimationAmount.vegetables.value *
                        ((_g = foodIntakeFactor.Items[0]) === null || _g === void 0 ? void 0 : _g.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['processed-vegetables'].value =
                    estimationAmount['processed-vegetables'].value *
                        ((_h = foodIntakeFactor.Items[0]) === null || _h === void 0 ? void 0 : _h.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.beans.value =
                    estimationAmount.beans.value *
                        ((_j = foodIntakeFactor.Items[0]) === null || _j === void 0 ? void 0 : _j.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.fruits.value =
                    estimationAmount.fruits.value *
                        ((_k = foodIntakeFactor.Items[0]) === null || _k === void 0 ? void 0 : _k.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.oil.value =
                    estimationAmount.oil.value *
                        ((_l = foodIntakeFactor.Items[0]) === null || _l === void 0 ? void 0 : _l.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.seasoning.value =
                    estimationAmount.seasoning.value *
                        ((_m = foodIntakeFactor.Items[0]) === null || _m === void 0 ? void 0 : _m.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['ready-meal'].value =
                    estimationAmount['ready-meal'].value *
                        ((_o = foodIntakeFactor.Items[0]) === null || _o === void 0 ? void 0 : _o.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.rice));
                estimations.push((0, util_1.toEstimation)(estimationAmount['bread-flour']));
                estimations.push((0, util_1.toEstimation)(estimationAmount.noodle));
                estimations.push((0, util_1.toEstimation)(estimationAmount.potatoes));
                estimations.push((0, util_1.toEstimation)(estimationAmount.vegetables));
                estimations.push((0, util_1.toEstimation)(estimationAmount['processed-vegetables']));
                estimations.push((0, util_1.toEstimation)(estimationAmount.beans));
                estimations.push((0, util_1.toEstimation)(estimationAmount.fruits));
                estimations.push((0, util_1.toEstimation)(estimationAmount.oil));
                estimations.push((0, util_1.toEstimation)(estimationAmount.seasoning));
                estimations.push((0, util_1.toEstimation)(estimationAmount['ready-meal']));
                if (!foodAnswer.dairyFoodFactorKey) return [3 /*break*/, 7];
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['dairy-food-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.dairyFoodFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 6:
                dairyFoodFactor = _3.sent();
                estimationAmount.milk.value =
                    estimationAmount.milk.value *
                        ((_p = dairyFoodFactor.Items[0]) === null || _p === void 0 ? void 0 : _p.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['other-dairy'].value =
                    estimationAmount['other-dairy'].value *
                        ((_q = dairyFoodFactor.Items[0]) === null || _q === void 0 ? void 0 : _q.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.eggs.value =
                    estimationAmount.eggs.value *
                        ((_r = dairyFoodFactor.Items[0]) === null || _r === void 0 ? void 0 : _r.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.milk));
                estimations.push((0, util_1.toEstimation)(estimationAmount['other-dairy']));
                estimations.push((0, util_1.toEstimation)(estimationAmount.eggs));
                _3.label = 7;
            case 7:
                dishBeefFactor = null;
                if (!foodAnswer.dishBeefFactorKey) return [3 /*break*/, 9];
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['dish-beef-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.dishBeefFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 8:
                dishBeefFactor = _3.sent();
                estimationAmount.beef.value =
                    estimationAmount.beef.value *
                        ((_s = dishBeefFactor.Items[0]) === null || _s === void 0 ? void 0 : _s.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.beef));
                _3.label = 9;
            case 9:
                dishPorkFactor = null;
                if (!foodAnswer.dishPorkFactorKey) return [3 /*break*/, 11];
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['dish-pork-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.dishPorkFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 10:
                dishPorkFactor = _3.sent();
                estimationAmount.pork.value =
                    estimationAmount.pork.value *
                        ((_t = dishPorkFactor.Items[0]) === null || _t === void 0 ? void 0 : _t.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['other-meat'].value =
                    estimationAmount['other-meat'].value *
                        ((_u = dishPorkFactor.Items[0]) === null || _u === void 0 ? void 0 : _u.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.pork));
                estimations.push((0, util_1.toEstimation)(estimationAmount['other-meat']));
                _3.label = 11;
            case 11:
                dishChickenFactor = null;
                if (!foodAnswer.dishChickenFactorKey) return [3 /*break*/, 13];
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['dish-chicken-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.dishChickenFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 12:
                dishChickenFactor = _3.sent();
                estimationAmount.chicken.value =
                    estimationAmount.chicken.value *
                        ((_v = dishChickenFactor.Items[0]) === null || _v === void 0 ? void 0 : _v.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.chicken));
                _3.label = 13;
            case 13:
                // 加工肉補正
                if (dishBeefFactor && dishPorkFactor && dishChickenFactor) {
                    estimationAmount['processed-meat'].value =
                        (estimationAmount['processed-meat'].value *
                            (estimationAmount.beef.value +
                                estimationAmount.pork.value +
                                estimationAmount.chicken.value)) /
                            (findAmount(baselines, 'beef').value +
                                findAmount(baselines, 'pork').value +
                                findAmount(baselines, 'chicken').value);
                    estimations.push((0, util_1.toEstimation)(estimationAmount['processed-meat']));
                }
                if (!foodAnswer.dishSeafoodFactorKey) return [3 /*break*/, 15];
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['dish-seafood-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.dishSeafoodFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 14:
                dishSeafoodFactor = _3.sent();
                estimationAmount.fish.value =
                    estimationAmount.pork.value *
                        ((_w = dishSeafoodFactor.Items[0]) === null || _w === void 0 ? void 0 : _w.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['processed-fish'].value =
                    estimationAmount['processed-fish'].value *
                        ((_x = dishSeafoodFactor.Items[0]) === null || _x === void 0 ? void 0 : _x.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.fish));
                estimations.push((0, util_1.toEstimation)(estimationAmount['processed-fish']));
                _3.label = 15;
            case 15:
                if (!foodAnswer.alcoholFactorKey) return [3 /*break*/, 17];
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['alcohol-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.alcoholFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 16:
                alcoholFactor = _3.sent();
                estimationAmount.alcohol.value =
                    estimationAmount.alcohol.value *
                        ((_y = alcoholFactor.Items[0]) === null || _y === void 0 ? void 0 : _y.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.alcohol));
                _3.label = 17;
            case 17:
                if (!foodAnswer.alcoholFactorKey) return [3 /*break*/, 19];
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['alcohol-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.alcoholFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 18:
                alcoholFactor = _3.sent();
                estimationAmount.alcohol.value =
                    estimationAmount.alcohol.value *
                        ((_z = alcoholFactor.Items[0]) === null || _z === void 0 ? void 0 : _z.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.alcohol));
                _3.label = 19;
            case 19:
                if (!foodAnswer.softDrinkSnackFactorKey) return [3 /*break*/, 21];
                return [4 /*yield*/, dynamodb
                        .query({
                        TableName: parameterTableName,
                        KeyConditions: {
                            category: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: ['soft-drink-snack-factor']
                            },
                            key: {
                                ComparisonOperator: 'EQ',
                                AttributeValueList: [foodAnswer.softDrinkSnackFactorKey]
                            }
                        }
                    })
                        .promise()];
            case 20:
                softDrinkSnackFactor = _3.sent();
                estimationAmount['sweets-snack'].value =
                    estimationAmount['sweets-snack'].value *
                        ((_0 = softDrinkSnackFactor.Items[0]) === null || _0 === void 0 ? void 0 : _0.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['coffee-tea'].value =
                    estimationAmount['coffee-tea'].value *
                        ((_1 = softDrinkSnackFactor.Items[0]) === null || _1 === void 0 ? void 0 : _1.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['cold-drink'].value =
                    estimationAmount['cold-drink'].value *
                        ((_2 = softDrinkSnackFactor.Items[0]) === null || _2 === void 0 ? void 0 : _2.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount['sweets-snack']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['coffee-tea']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['cold-drink']));
                _3.label = 21;
            case 21:
                console.log(JSON.stringify(estimations));
                return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateFood = estimateFood;
