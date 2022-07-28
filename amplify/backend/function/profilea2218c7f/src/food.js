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
    var getData, createAmount, estimations, params, data, baselines, foodIntakeFactor, estimationAmount, foodDirectWasteFactor, foodLeftoverFactor, foodWastRatio, leftoverRatio, directWasteRatio, foodWasteRatio, foodLossAverageRatio, foodPurchaseAmountConsideringFoodLossRatio, dairyFoodFactor, dishBeefFactor, dishPorkFactor, dishChickenFactor, dishSeafoodFactor, alcoholFactor, softDrinkSnackFactor, eatOutFactor;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    return __generator(this, function (_4) {
        switch (_4.label) {
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
                                // foodのベースラインの取得
                            ];
                            case 1: return [2 /*return*/, _a.sent()
                                // foodのベースラインの取得
                            ];
                        }
                    });
                }); };
                createAmount = function (baselines, item) {
                    return (0, util_1.toEstimation)((0, util_1.findBaseline)(baselines, 'food', item, 'amount'));
                };
                estimations = [];
                params = {
                    TableName: footprintTableName,
                    KeyConditions: {
                        dir_domain: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['baseline_food']
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(params).promise()];
            case 1:
                data = _4.sent();
                baselines = data.Items.map(function (item) { return (0, util_1.toBaseline)(item); });
                // 回答がない場合はベースラインのみ返す
                if (!foodAnswer) {
                    return [2 /*return*/, { baselines: baselines, estimations: estimations }];
                }
                return [4 /*yield*/, getData('food-intake-factor', foodAnswer.foodIntakeFactorKey)];
            case 2:
                foodIntakeFactor = _4.sent();
                estimationAmount = {
                    rice: createAmount(baselines, 'rice'),
                    'bread-flour': createAmount(baselines, 'bread-flour'),
                    noodle: createAmount(baselines, 'noodle'),
                    potatoes: createAmount(baselines, 'potatoes'),
                    vegetables: createAmount(baselines, 'vegetables'),
                    'processed-vegetables': createAmount(baselines, 'processed-vegetables'),
                    beans: createAmount(baselines, 'beans'),
                    milk: createAmount(baselines, 'milk'),
                    'other-dairy': createAmount(baselines, 'other-dairy'),
                    eggs: createAmount(baselines, 'eggs'),
                    beef: createAmount(baselines, 'beef'),
                    pork: createAmount(baselines, 'pork'),
                    chicken: createAmount(baselines, 'chicken'),
                    'other-meat': createAmount(baselines, 'other-meat'),
                    'processed-meat': createAmount(baselines, 'processed-meat'),
                    fish: createAmount(baselines, 'fish'),
                    'processed-fish': createAmount(baselines, 'processed-fish'),
                    fruits: createAmount(baselines, 'fruits'),
                    oil: createAmount(baselines, 'oil'),
                    seasoning: createAmount(baselines, 'seasoning'),
                    'sweets-snack': createAmount(baselines, 'sweets-snack'),
                    'ready-meal': createAmount(baselines, 'ready-meal'),
                    alcohol: createAmount(baselines, 'alcohol'),
                    'coffee-tea': createAmount(baselines, 'coffee-tea'),
                    'cold-drink': createAmount(baselines, 'cold-drink'),
                    restaurant: createAmount(baselines, 'restaurant'),
                    'bar-cafe': createAmount(baselines, 'bar-cafe')
                };
                if (!(foodAnswer.foodDirectWasteFactorKey && foodAnswer.foodLeftoverFactorKey)) return [3 /*break*/, 19];
                return [4 /*yield*/, getData('food-direct-waste-factor', foodAnswer.foodDirectWasteFactorKey)];
            case 3:
                foodDirectWasteFactor = _4.sent();
                return [4 /*yield*/, getData('food-leftover-factor', foodAnswer.foodLeftoverFactorKey)];
            case 4:
                foodLeftoverFactor = _4.sent();
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
                foodWastRatio = _4.sent();
                leftoverRatio = foodWastRatio.Items.find(function (item) { return item.key === 'leftover-per-food-waste'; });
                directWasteRatio = foodWastRatio.Items.find(function (item) { return item.key === 'direct-waste-per-food-waste'; });
                foodWasteRatio = foodWastRatio.Items.find(function (item) { return item.key === 'food-waste-per-food'; });
                foodLossAverageRatio = ((_a = foodDirectWasteFactor.Item) === null || _a === void 0 ? void 0 : _a.value) * directWasteRatio.value +
                    ((_b = foodLeftoverFactor.Item) === null || _b === void 0 ? void 0 : _b.value) * leftoverRatio.value;
                foodPurchaseAmountConsideringFoodLossRatio = (1 + foodLossAverageRatio * foodWasteRatio.value) /
                    (1 + foodWasteRatio.value);
                estimationAmount.rice.value =
                    estimationAmount.rice.value *
                        ((_c = foodIntakeFactor.Item) === null || _c === void 0 ? void 0 : _c.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['bread-flour'].value =
                    estimationAmount['bread-flour'].value *
                        ((_d = foodIntakeFactor.Item) === null || _d === void 0 ? void 0 : _d.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.noodle.value =
                    estimationAmount.noodle.value *
                        ((_e = foodIntakeFactor.Item) === null || _e === void 0 ? void 0 : _e.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.potatoes.value =
                    estimationAmount.potatoes.value *
                        ((_f = foodIntakeFactor.Item) === null || _f === void 0 ? void 0 : _f.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.vegetables.value =
                    estimationAmount.vegetables.value *
                        ((_g = foodIntakeFactor.Item) === null || _g === void 0 ? void 0 : _g.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['processed-vegetables'].value =
                    estimationAmount['processed-vegetables'].value *
                        ((_h = foodIntakeFactor.Item) === null || _h === void 0 ? void 0 : _h.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.beans.value =
                    estimationAmount.beans.value *
                        ((_j = foodIntakeFactor.Item) === null || _j === void 0 ? void 0 : _j.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.fruits.value =
                    estimationAmount.fruits.value *
                        ((_k = foodIntakeFactor.Item) === null || _k === void 0 ? void 0 : _k.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.oil.value =
                    estimationAmount.oil.value *
                        ((_l = foodIntakeFactor.Item) === null || _l === void 0 ? void 0 : _l.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.seasoning.value =
                    estimationAmount.seasoning.value *
                        ((_m = foodIntakeFactor.Item) === null || _m === void 0 ? void 0 : _m.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['ready-meal'].value =
                    estimationAmount['ready-meal'].value *
                        ((_o = foodIntakeFactor.Item) === null || _o === void 0 ? void 0 : _o.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push(estimationAmount.rice);
                estimations.push(estimationAmount['bread-flour']);
                estimations.push(estimationAmount.noodle);
                estimations.push(estimationAmount.potatoes);
                estimations.push(estimationAmount.vegetables);
                estimations.push(estimationAmount['processed-vegetables']);
                estimations.push(estimationAmount.beans);
                estimations.push(estimationAmount.fruits);
                estimations.push(estimationAmount.oil);
                estimations.push(estimationAmount.seasoning);
                estimations.push(estimationAmount['ready-meal']);
                if (!foodAnswer.dairyFoodFactorKey) return [3 /*break*/, 7];
                return [4 /*yield*/, getData('dairy-food-factor', foodAnswer.dairyFoodFactorKey)];
            case 6:
                dairyFoodFactor = _4.sent();
                estimationAmount.milk.value =
                    estimationAmount.milk.value *
                        ((_p = dairyFoodFactor.Item) === null || _p === void 0 ? void 0 : _p.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['other-dairy'].value =
                    estimationAmount['other-dairy'].value *
                        ((_q = dairyFoodFactor.Item) === null || _q === void 0 ? void 0 : _q.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount.eggs.value =
                    estimationAmount.eggs.value *
                        ((_r = dairyFoodFactor.Item) === null || _r === void 0 ? void 0 : _r.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push(estimationAmount.milk);
                estimations.push(estimationAmount['other-dairy']);
                estimations.push(estimationAmount.eggs);
                _4.label = 7;
            case 7:
                dishBeefFactor = null;
                if (!foodAnswer.dishBeefFactorKey) return [3 /*break*/, 9];
                return [4 /*yield*/, getData('dish-beef-factor', foodAnswer.dishBeefFactorKey)];
            case 8:
                dishBeefFactor = _4.sent();
                estimationAmount.beef.value =
                    estimationAmount.beef.value *
                        ((_s = dishBeefFactor.Item) === null || _s === void 0 ? void 0 : _s.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push(estimationAmount.beef);
                _4.label = 9;
            case 9:
                dishPorkFactor = null;
                if (!foodAnswer.dishPorkFactorKey) return [3 /*break*/, 11];
                return [4 /*yield*/, getData('dish-pork-factor', foodAnswer.dishPorkFactorKey)];
            case 10:
                dishPorkFactor = _4.sent();
                estimationAmount.pork.value =
                    estimationAmount.pork.value *
                        ((_t = dishPorkFactor.Item) === null || _t === void 0 ? void 0 : _t.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['other-meat'].value =
                    estimationAmount['other-meat'].value *
                        ((_u = dishPorkFactor.Item) === null || _u === void 0 ? void 0 : _u.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push(estimationAmount.pork);
                estimations.push(estimationAmount['other-meat']);
                _4.label = 11;
            case 11:
                dishChickenFactor = null;
                if (!foodAnswer.dishChickenFactorKey) return [3 /*break*/, 13];
                return [4 /*yield*/, getData('dish-chicken-factor', foodAnswer.dishChickenFactorKey)];
            case 12:
                dishChickenFactor = _4.sent();
                estimationAmount.chicken.value =
                    estimationAmount.chicken.value *
                        ((_v = dishChickenFactor.Item) === null || _v === void 0 ? void 0 : _v.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push(estimationAmount.chicken);
                _4.label = 13;
            case 13:
                // 加工肉補正
                if (dishBeefFactor && dishPorkFactor && dishChickenFactor) {
                    estimationAmount['processed-meat'].value =
                        (estimationAmount['processed-meat'].value *
                            (estimationAmount.beef.value +
                                estimationAmount.pork.value +
                                estimationAmount['other-meat'].value +
                                estimationAmount.chicken.value)) /
                            (createAmount(baselines, 'beef').value +
                                createAmount(baselines, 'pork').value +
                                createAmount(baselines, 'other-meat').value +
                                createAmount(baselines, 'chicken').value);
                    estimations.push(estimationAmount['processed-meat']);
                }
                if (!foodAnswer.dishSeafoodFactorKey) return [3 /*break*/, 15];
                return [4 /*yield*/, getData('dish-seafood-factor', foodAnswer.dishSeafoodFactorKey)];
            case 14:
                dishSeafoodFactor = _4.sent();
                estimationAmount.fish.value =
                    estimationAmount.fish.value *
                        ((_w = dishSeafoodFactor.Item) === null || _w === void 0 ? void 0 : _w.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['processed-fish'].value =
                    estimationAmount['processed-fish'].value *
                        ((_x = dishSeafoodFactor.Item) === null || _x === void 0 ? void 0 : _x.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push(estimationAmount.fish);
                estimations.push(estimationAmount['processed-fish']);
                _4.label = 15;
            case 15:
                if (!foodAnswer.alcoholFactorKey) return [3 /*break*/, 17];
                return [4 /*yield*/, getData('alcohol-factor', foodAnswer.alcoholFactorKey)];
            case 16:
                alcoholFactor = _4.sent();
                estimationAmount.alcohol.value =
                    estimationAmount.alcohol.value *
                        ((_y = alcoholFactor.Item) === null || _y === void 0 ? void 0 : _y.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push(estimationAmount.alcohol);
                _4.label = 17;
            case 17:
                if (!foodAnswer.softDrinkSnackFactorKey) return [3 /*break*/, 19];
                return [4 /*yield*/, getData('soft-drink-snack-factor', foodAnswer.softDrinkSnackFactorKey)];
            case 18:
                softDrinkSnackFactor = _4.sent();
                estimationAmount['sweets-snack'].value =
                    estimationAmount['sweets-snack'].value *
                        ((_z = softDrinkSnackFactor.Item) === null || _z === void 0 ? void 0 : _z.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['coffee-tea'].value =
                    estimationAmount['coffee-tea'].value *
                        ((_0 = softDrinkSnackFactor.Item) === null || _0 === void 0 ? void 0 : _0.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimationAmount['cold-drink'].value =
                    estimationAmount['cold-drink'].value *
                        ((_1 = softDrinkSnackFactor.Item) === null || _1 === void 0 ? void 0 : _1.value) *
                        foodPurchaseAmountConsideringFoodLossRatio;
                estimations.push(estimationAmount['sweets-snack']);
                estimations.push(estimationAmount['coffee-tea']);
                estimations.push(estimationAmount['cold-drink']);
                _4.label = 19;
            case 19:
                if (!foodAnswer.eatOutFactorKey) return [3 /*break*/, 21];
                return [4 /*yield*/, getData('eat-out-factor', foodAnswer.eatOutFactorKey)];
            case 20:
                eatOutFactor = _4.sent();
                estimationAmount.restaurant.value =
                    estimationAmount.restaurant.value * ((_2 = eatOutFactor.Item) === null || _2 === void 0 ? void 0 : _2.value);
                estimationAmount['bar-cafe'].value =
                    estimationAmount['bar-cafe'].value * ((_3 = eatOutFactor.Item) === null || _3 === void 0 ? void 0 : _3.value);
                estimations.push(estimationAmount.restaurant);
                estimations.push(estimationAmount['bar-cafe']);
                _4.label = 21;
            case 21:
                console.log(JSON.stringify(estimations));
                return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateFood = estimateFood;
