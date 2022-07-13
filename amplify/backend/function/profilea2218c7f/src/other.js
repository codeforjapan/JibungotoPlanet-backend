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
exports.estimateOther = void 0;
var util_1 = require("./util");
var estimateOther = function (dynamodb, otherAnswer, housingAnswer, footprintTableName, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var findAmount, estimations, params, data, baselines, estimationAmount, dailyGoodsAmount, dailyGoodsAmountAverage, dailyGoodsNationalAverageRatio, communicationAmount, communicationAmountAverage, communicationNationalAverageRatio, applianceFurnitureAmount, applianceFurnitureAmountAverage, applianceFurnitureNationalAverageRatio, serviceFactor, hobbyGoodsFactor, clothesBeautyFactor, leisureSportsFactor, travelFactor;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
    return __generator(this, function (_11) {
        switch (_11.label) {
            case 0:
                findAmount = function (baselines, item) {
                    return (0, util_1.findBaseline)(baselines, 'other', item, 'amount');
                };
                estimations = [];
                params = {
                    TableName: footprintTableName,
                    KeyConditions: {
                        dir_domain: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['baseline_other']
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(params).promise()];
            case 1:
                data = _11.sent();
                baselines = data.Items.map(function (item) { return (0, util_1.toBaseline)(item); });
                // 回答がない場合はベースラインのみ返す
                if (!otherAnswer) {
                    return [2 /*return*/, { baselines: baselines, estimations: estimations }];
                }
                estimationAmount = {
                    'cooking-appliances': findAmount(baselines, 'cooking-appliances'),
                    'heating-cooling-appliances': findAmount(baselines, 'heating-cooling-appliances'),
                    'other-appliances': findAmount(baselines, 'other-appliances'),
                    electronics: findAmount(baselines, 'electronics'),
                    'clothes-goods': findAmount(baselines, 'clothes-goods'),
                    'bags-jewelries-goods': findAmount(baselines, 'bags-jewelries-goods'),
                    'culture-goods': findAmount(baselines, 'culture-goods'),
                    'entertainment-goods': findAmount(baselines, 'entertainment-goods'),
                    'sports-goods': findAmount(baselines, 'sports-goods'),
                    'gardening-flower': findAmount(baselines, 'gardening-flower'),
                    pet: findAmount(baselines, 'pet'),
                    tobacco: findAmount(baselines, 'tobacco'),
                    furniture: findAmount(baselines, 'furniture'),
                    covering: findAmount(baselines, 'covering'),
                    cosmetics: findAmount(baselines, 'cosmetics'),
                    sanitation: findAmount(baselines, 'sanitation'),
                    medicine: findAmount(baselines, 'medicine'),
                    'kitchen-goods': findAmount(baselines, 'kitchen-goods'),
                    'paper-stationery': findAmount(baselines, 'paper-stationery'),
                    'books-magazines': findAmount(baselines, 'books-magazines'),
                    waste: findAmount(baselines, 'waste'),
                    hotel: findAmount(baselines, 'hotel'),
                    travel: findAmount(baselines, 'travel'),
                    'culture-leisure': findAmount(baselines, 'culture-leisure'),
                    'entertainment-leisure': findAmount(baselines, 'entertainment-leisure'),
                    'sports-leisure': findAmount(baselines, 'sports-leisure'),
                    'furniture-daily-goods-repair-rental': findAmount(baselines, 'furniture-daily-goods-repair-rental'),
                    'clothes-repair-rental': findAmount(baselines, 'clothes-repair-rental'),
                    'bags-jewelries-repair-rental': findAmount(baselines, 'bags-jewelries-repair-rental'),
                    'electrical-appliances-repair-rental': findAmount(baselines, 'electrical-appliances-repair-rental'),
                    'sports-culture-repair-rental': findAmount(baselines, 'sports-culture-repair-rental'),
                    'sports-entertainment-repair-rental': findAmount(baselines, 'sports-entertainment-repair-rental'),
                    housework: findAmount(baselines, 'housework'),
                    washing: findAmount(baselines, 'washing'),
                    haircare: findAmount(baselines, 'haircare'),
                    'bath-spa': findAmount(baselines, 'bath-spa'),
                    communication: findAmount(baselines, 'communication'),
                    broadcasting: findAmount(baselines, 'broadcasting'),
                    'medical-care': findAmount(baselines, 'medical-care'),
                    nursing: findAmount(baselines, 'nursing'),
                    caring: findAmount(baselines, 'caring'),
                    'formal-education': findAmount(baselines, 'formal-education'),
                    'informal-education': findAmount(baselines, 'informal-education'),
                    'other-services': findAmount(baselines, 'other-services')
                };
                dailyGoodsAmount = null;
                if (!(otherAnswer.dailyGoodsAmountKey && housingAnswer.residentCount)) return [3 /*break*/, 4];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'daily-goods-amount',
                            key: otherAnswer.dailyGoodsAmountKey
                        }
                    })
                        .promise()];
            case 2:
                dailyGoodsAmount = _11.sent();
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'daily-goods-amount',
                            key: 'average-per-capita'
                        }
                    })
                        .promise()
                    // 住居の部分から人数を取得する必要がある。
                ];
            case 3:
                dailyGoodsAmountAverage = _11.sent();
                dailyGoodsNationalAverageRatio = ((_a = dailyGoodsAmount.Item) === null || _a === void 0 ? void 0 : _a.value) /
                    housingAnswer.residentCount /
                    ((_b = dailyGoodsAmountAverage.Item) === null || _b === void 0 ? void 0 : _b.value);
                estimationAmount.sanitation.value =
                    estimationAmount.sanitation.value * dailyGoodsNationalAverageRatio;
                estimationAmount['kitchen-goods'].value =
                    estimationAmount['kitchen-goods'].value * dailyGoodsNationalAverageRatio;
                estimationAmount['paper-stationery'].value =
                    estimationAmount['paper-stationery'].value *
                        dailyGoodsNationalAverageRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.sanitation));
                estimations.push((0, util_1.toEstimation)(estimationAmount['kitchen-goods']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['paper-stationery']));
                _11.label = 4;
            case 4:
                if (!(otherAnswer.communicationAmountKey && housingAnswer.residentCount)) return [3 /*break*/, 7];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'communication-amount',
                            key: otherAnswer.communicationAmountKey
                        }
                    })
                        .promise()];
            case 5:
                communicationAmount = _11.sent();
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'communication-amount',
                            key: 'average-per-capita'
                        }
                    })
                        .promise()
                    // 住居の部分から人数を取得する必要がある。
                ];
            case 6:
                communicationAmountAverage = _11.sent();
                communicationNationalAverageRatio = ((_c = communicationAmount.Item) === null || _c === void 0 ? void 0 : _c.value) /
                    housingAnswer.residentCount /
                    ((_d = communicationAmountAverage.Item) === null || _d === void 0 ? void 0 : _d.value);
                estimationAmount.communication.value =
                    estimationAmount.communication.value * communicationNationalAverageRatio;
                estimationAmount.broadcasting.value =
                    estimationAmount.broadcasting.value * communicationNationalAverageRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.communication));
                estimations.push((0, util_1.toEstimation)(estimationAmount.broadcasting));
                _11.label = 7;
            case 7:
                applianceFurnitureAmount = null;
                if (!(otherAnswer.applianceFurnitureAmountKey && housingAnswer.residentCount)) return [3 /*break*/, 10];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'appliance-furniture-amount',
                            key: otherAnswer.applianceFurnitureAmountKey
                        }
                    })
                        .promise()];
            case 8:
                applianceFurnitureAmount = _11.sent();
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'appliance-furniture-amount',
                            key: 'average-per-capita'
                        }
                    })
                        .promise()
                    // 住居の部分から人数を取得する必要がある。
                ];
            case 9:
                applianceFurnitureAmountAverage = _11.sent();
                applianceFurnitureNationalAverageRatio = ((_e = applianceFurnitureAmount.Item) === null || _e === void 0 ? void 0 : _e.value) /
                    housingAnswer.residentCount /
                    ((_f = applianceFurnitureAmountAverage.Item) === null || _f === void 0 ? void 0 : _f.value);
                estimationAmount['cooking-appliances'].value =
                    estimationAmount['cooking-appliances'].value *
                        applianceFurnitureNationalAverageRatio;
                estimationAmount['heating-cooling-appliances'].value =
                    estimationAmount['heating-cooling-appliances'].value *
                        applianceFurnitureNationalAverageRatio;
                estimationAmount['other-appliances'].value =
                    estimationAmount['other-appliances'].value *
                        applianceFurnitureNationalAverageRatio;
                estimationAmount.electronics.value =
                    estimationAmount.electronics.value *
                        applianceFurnitureNationalAverageRatio;
                estimationAmount.furniture.value =
                    estimationAmount.furniture.value * applianceFurnitureNationalAverageRatio;
                estimationAmount.covering.value =
                    estimationAmount.covering.value * applianceFurnitureNationalAverageRatio;
                estimationAmount['furniture-daily-goods-repair-rental'].value =
                    estimationAmount['furniture-daily-goods-repair-rental'].value *
                        applianceFurnitureNationalAverageRatio;
                estimationAmount['electrical-appliances-repair-rental'].value =
                    estimationAmount['electrical-appliances-repair-rental'].value *
                        applianceFurnitureNationalAverageRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount['cooking-appliances']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['heating-cooling-appliances']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['other-appliances']));
                estimations.push((0, util_1.toEstimation)(estimationAmount.electronics));
                estimations.push((0, util_1.toEstimation)(estimationAmount.furniture));
                estimations.push((0, util_1.toEstimation)(estimationAmount.covering));
                estimations.push((0, util_1.toEstimation)(estimationAmount['furniture-daily-goods-repair-rental']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['electrical-appliances-repair-rental']));
                _11.label = 10;
            case 10:
                serviceFactor = null;
                if (!otherAnswer.serviceFactorKey) return [3 /*break*/, 12];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'service-factor',
                            key: otherAnswer.serviceFactorKey
                        }
                    })
                        .promise()];
            case 11:
                serviceFactor = _11.sent();
                estimationAmount.medicine.value =
                    estimationAmount.medicine.value * ((_g = serviceFactor.Item) === null || _g === void 0 ? void 0 : _g.value);
                estimationAmount.housework.value =
                    estimationAmount.housework.value * ((_h = serviceFactor.Item) === null || _h === void 0 ? void 0 : _h.value);
                estimationAmount.washing.value =
                    estimationAmount.washing.value * ((_j = serviceFactor.Item) === null || _j === void 0 ? void 0 : _j.value);
                estimationAmount['medical-care'].value =
                    estimationAmount['medical-care'].value * ((_k = serviceFactor.Item) === null || _k === void 0 ? void 0 : _k.value);
                estimationAmount.nursing.value =
                    estimationAmount.nursing.value * ((_l = serviceFactor.Item) === null || _l === void 0 ? void 0 : _l.value);
                estimationAmount.caring.value =
                    estimationAmount.caring.value * ((_m = serviceFactor.Item) === null || _m === void 0 ? void 0 : _m.value);
                estimationAmount['formal-education'].value =
                    estimationAmount['formal-education'].value * ((_o = serviceFactor.Item) === null || _o === void 0 ? void 0 : _o.value);
                estimationAmount['informal-education'].value =
                    estimationAmount['informal-education'].value * ((_p = serviceFactor.Item) === null || _p === void 0 ? void 0 : _p.value);
                estimations.push((0, util_1.toEstimation)(estimationAmount.medicine));
                estimations.push((0, util_1.toEstimation)(estimationAmount.housework));
                estimations.push((0, util_1.toEstimation)(estimationAmount.washing));
                estimations.push((0, util_1.toEstimation)(estimationAmount['medical-care']));
                estimations.push((0, util_1.toEstimation)(estimationAmount.nursing));
                estimations.push((0, util_1.toEstimation)(estimationAmount.caring));
                estimations.push((0, util_1.toEstimation)(estimationAmount['formal-education']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['informal-education']));
                _11.label = 12;
            case 12:
                hobbyGoodsFactor = null;
                if (!otherAnswer.hobbyGoodsFactorKey) return [3 /*break*/, 14];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'hobby-goods-factor',
                            key: otherAnswer.hobbyGoodsFactorKey
                        }
                    })
                        .promise()];
            case 13:
                hobbyGoodsFactor = _11.sent();
                estimationAmount['culture-goods'].value =
                    estimationAmount['culture-goods'].value * ((_q = hobbyGoodsFactor.Item) === null || _q === void 0 ? void 0 : _q.value);
                estimationAmount['entertainment-goods'].value =
                    estimationAmount['entertainment-goods'].value * ((_r = hobbyGoodsFactor.Item) === null || _r === void 0 ? void 0 : _r.value);
                estimationAmount['sports-goods'].value =
                    estimationAmount['sports-goods'].value * ((_s = hobbyGoodsFactor.Item) === null || _s === void 0 ? void 0 : _s.value);
                estimationAmount['gardening-flower'].value =
                    estimationAmount['gardening-flower'].value * ((_t = hobbyGoodsFactor.Item) === null || _t === void 0 ? void 0 : _t.value);
                estimationAmount.pet.value = estimationAmount.pet.value * ((_u = hobbyGoodsFactor.Item) === null || _u === void 0 ? void 0 : _u.value);
                estimationAmount.tobacco.value =
                    estimationAmount.tobacco.value * ((_v = hobbyGoodsFactor.Item) === null || _v === void 0 ? void 0 : _v.value);
                estimationAmount['books-magazines'].value =
                    estimationAmount['books-magazines'].value * ((_w = hobbyGoodsFactor.Item) === null || _w === void 0 ? void 0 : _w.value);
                estimationAmount['sports-culture-repair-rental'].value =
                    estimationAmount['sports-culture-repair-rental'].value * ((_x = hobbyGoodsFactor.Item) === null || _x === void 0 ? void 0 : _x.value);
                estimationAmount['sports-entertainment-repair-rental'].value =
                    estimationAmount['sports-entertainment-repair-rental'].value *
                        ((_y = hobbyGoodsFactor.Item) === null || _y === void 0 ? void 0 : _y.value);
                estimations.push((0, util_1.toEstimation)(estimationAmount['culture-goods']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['entertainment-goods']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['sports-goods']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['gardening-flower']));
                estimations.push((0, util_1.toEstimation)(estimationAmount.pet));
                estimations.push((0, util_1.toEstimation)(estimationAmount.tobacco));
                estimations.push((0, util_1.toEstimation)(estimationAmount['books-magazines']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['sports-culture-repair-rental']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['sports-entertainment-repair-rental']));
                _11.label = 14;
            case 14:
                clothesBeautyFactor = null;
                if (!otherAnswer.clothesBeautyFactorKey) return [3 /*break*/, 16];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'clothes-beauty-factor',
                            key: otherAnswer.clothesBeautyFactorKey
                        }
                    })
                        .promise()];
            case 15:
                clothesBeautyFactor = _11.sent();
                estimationAmount['clothes-goods'].value =
                    estimationAmount['clothes-goods'].value * ((_z = clothesBeautyFactor.Item) === null || _z === void 0 ? void 0 : _z.value);
                estimationAmount['bags-jewelries-goods'].value =
                    estimationAmount['bags-jewelries-goods'].value * ((_0 = clothesBeautyFactor.Item) === null || _0 === void 0 ? void 0 : _0.value);
                estimationAmount.cosmetics.value =
                    estimationAmount.cosmetics.value * ((_1 = clothesBeautyFactor.Item) === null || _1 === void 0 ? void 0 : _1.value);
                estimationAmount['clothes-repair-rental'].value =
                    estimationAmount['clothes-repair-rental'].value * ((_2 = clothesBeautyFactor.Item) === null || _2 === void 0 ? void 0 : _2.value);
                estimationAmount['bags-jewelries-repair-rental'].value =
                    estimationAmount['bags-jewelries-repair-rental'].value *
                        ((_3 = clothesBeautyFactor.Item) === null || _3 === void 0 ? void 0 : _3.value);
                estimationAmount.haircare.value =
                    estimationAmount.haircare.value * ((_4 = clothesBeautyFactor.Item) === null || _4 === void 0 ? void 0 : _4.value);
                estimations.push((0, util_1.toEstimation)(estimationAmount['clothes-goods']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['bags-jewelries-goods']));
                estimations.push((0, util_1.toEstimation)(estimationAmount.cosmetics));
                estimations.push((0, util_1.toEstimation)(estimationAmount['clothes-repair-rental']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['bags-jewelries-repair-rental']));
                estimations.push((0, util_1.toEstimation)(estimationAmount.haircare));
                _11.label = 16;
            case 16:
                // $355 $299 $310 $326 $340
                if (applianceFurnitureAmount &&
                    clothesBeautyFactor &&
                    hobbyGoodsFactor &&
                    dailyGoodsAmount &&
                    serviceFactor) {
                    estimationAmount.waste.value =
                        (estimationAmount.waste.value /
                            (findAmount(baselines, 'cooking-appliances').value +
                                findAmount(baselines, 'heating-cooling-appliances').value +
                                findAmount(baselines, 'other-appliances').value +
                                findAmount(baselines, 'electronics').value +
                                findAmount(baselines, 'clothes-goods').value +
                                findAmount(baselines, 'bags-jewelries-goods').value +
                                findAmount(baselines, 'culture-goods').value +
                                findAmount(baselines, 'entertainment-goods').value +
                                findAmount(baselines, 'sports-goods').value +
                                findAmount(baselines, 'gardening-flower').value +
                                findAmount(baselines, 'pet').value +
                                findAmount(baselines, 'tobacco').value +
                                findAmount(baselines, 'furniture').value +
                                findAmount(baselines, 'covering').value +
                                findAmount(baselines, 'cosmetics').value +
                                findAmount(baselines, 'sanitation').value +
                                findAmount(baselines, 'medicine').value +
                                findAmount(baselines, 'kitchen-goods').value +
                                findAmount(baselines, 'paper-stationery').value +
                                findAmount(baselines, 'books-magazines').value)) *
                            (estimationAmount['cooking-appliances'].value +
                                estimationAmount['heating-cooling-appliances'].value +
                                estimationAmount['other-appliances'].value +
                                estimationAmount.electronics.value +
                                estimationAmount['clothes-goods'].value +
                                estimationAmount['bags-jewelries-goods'].value +
                                estimationAmount['culture-goods'].value +
                                estimationAmount['entertainment-goods'].value +
                                estimationAmount['sports-goods'].value +
                                estimationAmount['gardening-flower'].value +
                                estimationAmount.pet.value +
                                estimationAmount.tobacco.value +
                                estimationAmount.furniture.value +
                                estimationAmount.covering.value +
                                estimationAmount.cosmetics.value +
                                estimationAmount.sanitation.value +
                                estimationAmount.medicine.value +
                                estimationAmount['kitchen-goods'].value +
                                estimationAmount['paper-stationery'].value +
                                estimationAmount['books-magazines'].value);
                    estimations.push((0, util_1.toEstimation)(estimationAmount.waste));
                }
                if (!otherAnswer.leisureSportsFactorKey) return [3 /*break*/, 18];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'leisure-sports-factor',
                            key: otherAnswer.leisureSportsFactorKey
                        }
                    })
                        .promise()];
            case 17:
                leisureSportsFactor = _11.sent();
                estimationAmount['culture-leisure'].value =
                    estimationAmount['culture-leisure'].value * ((_5 = leisureSportsFactor.Item) === null || _5 === void 0 ? void 0 : _5.value);
                estimationAmount['entertainment-leisure'].value =
                    estimationAmount['entertainment-leisure'].value * ((_6 = leisureSportsFactor.Item) === null || _6 === void 0 ? void 0 : _6.value);
                estimationAmount['sports-leisure'].value =
                    estimationAmount['sports-leisure'].value * ((_7 = leisureSportsFactor.Item) === null || _7 === void 0 ? void 0 : _7.value);
                estimationAmount['bath-spa'].value =
                    estimationAmount['bath-spa'].value * ((_8 = leisureSportsFactor.Item) === null || _8 === void 0 ? void 0 : _8.value);
                estimations.push((0, util_1.toEstimation)(estimationAmount['culture-leisure']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['entertainment-leisure']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['sports-leisure']));
                estimations.push((0, util_1.toEstimation)(estimationAmount['bath-spa']));
                _11.label = 18;
            case 18:
                if (!otherAnswer.travelFactorKey) return [3 /*break*/, 20];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: 'travel-factor',
                            key: otherAnswer.travelFactorKey
                        }
                    })
                        .promise()];
            case 19:
                travelFactor = _11.sent();
                estimationAmount.hotel.value = estimationAmount.hotel.value * ((_9 = travelFactor.Item) === null || _9 === void 0 ? void 0 : _9.value);
                estimationAmount.travel.value = estimationAmount.travel.value * ((_10 = travelFactor.Item) === null || _10 === void 0 ? void 0 : _10.value);
                estimations.push((0, util_1.toEstimation)(estimationAmount.hotel));
                estimations.push((0, util_1.toEstimation)(estimationAmount.travel));
                _11.label = 20;
            case 20:
                console.log(JSON.stringify(estimations));
                return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateOther = estimateOther;
