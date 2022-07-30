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
exports.estimateMobility = void 0;
var util_1 = require("./util");
var estimateMobility = function (dynamodb, housingAnswer, mobilityAnswer, footprintTableName, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var createAmount, createIntensity, getData, estimations, params, data, baselines, electricityIntensityFactor, electricityData, carChargingData, drivingIntensity, ghgIntensityRatio, data_1, data_2, passengerIntensityRatio, purchaseIntensity, purchaseData, amount, baselineAmount, mileageRatio, privateCarPurchase, privateCarMaintenance, amount, privateCarPurchase, privateCarMaintenance, intensity, data_3, ratio, passengers, passengerIntensityRatio, driving, ghgIntensityRatio, data_4, intensity, rental, intensity_1, estimationAmount, mileage, weeklyTravelingTime, mileageByAreaFirstKey, params_1, data_5, milageByArea, annualTravelingTime, weekCount, paramsTransportation, speed, taxiRatio, otherCarMileage, baselineMotorbikeAmount, baselineCarSharingAmount, _i, _a, item, motorbikeDrivingRatio, carSharingDrivingRatio;
    var _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                createAmount = function (baselines, item) {
                    return (0, util_1.toEstimation)((0, util_1.findBaseline)(baselines, 'mobility', item, 'amount'));
                };
                createIntensity = function (baselines, item) {
                    return (0, util_1.toEstimation)((0, util_1.findBaseline)(baselines, 'mobility', item, 'intensity'));
                };
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
                                // mobilityAnswerのスキーマと取りうる値は以下を参照。
                                // amplify/backend/api/JibungotoPlanetGql/schema.graphql
                            ];
                            case 1: return [2 /*return*/, _a.sent()
                                // mobilityAnswerのスキーマと取りうる値は以下を参照。
                                // amplify/backend/api/JibungotoPlanetGql/schema.graphql
                            ];
                        }
                    });
                }); };
                estimations = [];
                params = {
                    TableName: footprintTableName,
                    KeyConditions: {
                        dir_domain: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['baseline_mobility']
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(params).promise()];
            case 1:
                data = _k.sent();
                baselines = data.Items.map(function (item) { return (0, util_1.toBaseline)(item); });
                // 回答がない場合はベースラインのみ返す
                if (!mobilityAnswer) {
                    return [2 /*return*/, { baselines: baselines, estimations: estimations }];
                }
                electricityIntensityFactor = 0;
                if (!(housingAnswer === null || housingAnswer === void 0 ? void 0 : housingAnswer.electricityIntensityKey)) return [3 /*break*/, 4];
                return [4 /*yield*/, getData('electricity-intensity-factor', housingAnswer.electricityIntensityKey)];
            case 2:
                electricityData = _k.sent();
                if (electricityData === null || electricityData === void 0 ? void 0 : electricityData.Item) {
                    electricityIntensityFactor = electricityData.Item.value;
                }
                return [4 /*yield*/, getData('car-charging', (mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carChargingKey) || 'unknown')];
            case 3:
                carChargingData = _k.sent();
                if (carChargingData === null || carChargingData === void 0 ? void 0 : carChargingData.Item) {
                    electricityIntensityFactor *= carChargingData.Item.value;
                }
                _k.label = 4;
            case 4:
                if (!mobilityAnswer.hasPrivateCar) return [3 /*break*/, 11];
                if (!(mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carIntensityFactorKey)) return [3 /*break*/, 10];
                drivingIntensity = createIntensity(baselines, 'private-car-driving');
                ghgIntensityRatio = 1;
                return [4 /*yield*/, getData('car-intensity-factor', mobilityAnswer.carIntensityFactorKey || 'unknown_driving-factor')];
            case 5:
                data_1 = _k.sent();
                if (data_1 === null || data_1 === void 0 ? void 0 : data_1.Item) {
                    ghgIntensityRatio *= data_1.Item.value;
                }
                if (!(((_b = mobilityAnswer.carIntensityFactorKey) === null || _b === void 0 ? void 0 : _b.startsWith('phv_')) ||
                    ((_c = mobilityAnswer.carIntensityFactorKey) === null || _c === void 0 ? void 0 : _c.startsWith('ev_')))) return [3 /*break*/, 7];
                return [4 /*yield*/, getData('renewable-car-intensity-factor', mobilityAnswer.carIntensityFactorKey)];
            case 6:
                data_2 = _k.sent();
                if (data_2 === null || data_2 === void 0 ? void 0 : data_2.Item) {
                    ghgIntensityRatio =
                        ghgIntensityRatio * (1 - electricityIntensityFactor) +
                            data_2.Item.value * electricityIntensityFactor;
                }
                _k.label = 7;
            case 7: return [4 /*yield*/, getData('car-passengers', mobilityAnswer.carPassengersFirstKey
                    ? mobilityAnswer.carPassengersFirstKey + '_private-car-factor'
                    : 'unknown_private-car-factor')];
            case 8:
                // 人数補正値
                data_1 = _k.sent();
                passengerIntensityRatio = ((_d = data_1 === null || data_1 === void 0 ? void 0 : data_1.Item) === null || _d === void 0 ? void 0 : _d.value) || 1;
                purchaseIntensity = createIntensity(baselines, 'private-car-purchase');
                return [4 /*yield*/, getData('car-intensity-factor', mobilityAnswer.carIntensityFactorKey.replace('_driving-factor', '_manufacturing-factor') || 'unknown_manufacturing-factor')];
            case 9:
                purchaseData = _k.sent();
                if (purchaseData === null || purchaseData === void 0 ? void 0 : purchaseData.Item) {
                    purchaseIntensity.value *= purchaseData.Item.value;
                }
                estimations.push(purchaseIntensity);
                drivingIntensity.value *= ghgIntensityRatio * passengerIntensityRatio;
                estimations.push(drivingIntensity);
                amount = createAmount(baselines, 'private-car-driving');
                baselineAmount = amount.value;
                amount.value = mobilityAnswer.privateCarAnnualMileage || 0;
                estimations.push(amount);
                mileageRatio = amount.value / baselineAmount;
                privateCarPurchase = createAmount(baselines, 'private-car-purchase');
                privateCarMaintenance = createAmount(baselines, 'private-car-maintenance');
                // 自家用車の購入・メンテナンスを移動距離比で補正
                privateCarPurchase.value *= mileageRatio;
                privateCarMaintenance.value *= mileageRatio;
                estimations.push(privateCarPurchase);
                estimations.push(privateCarMaintenance);
                _k.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                amount = createAmount(baselines, 'private-car-driving');
                amount.value = 0;
                estimations.push(amount);
                privateCarPurchase = createAmount(baselines, 'private-car-purchase');
                privateCarPurchase.value = 0;
                estimations.push(privateCarPurchase);
                privateCarMaintenance = createAmount(baselines, 'private-car-maintenance');
                privateCarMaintenance.value = 0;
                estimations.push(privateCarMaintenance);
                _k.label = 12;
            case 12:
                if (!mobilityAnswer.carPassengersFirstKey) return [3 /*break*/, 14];
                intensity = createIntensity(baselines, 'taxi');
                return [4 /*yield*/, getData('car-passengers', mobilityAnswer.carPassengersFirstKey + '_taxi-factor')];
            case 13:
                data_3 = _k.sent();
                ratio = ((_e = data_3 === null || data_3 === void 0 ? void 0 : data_3.Item) === null || _e === void 0 ? void 0 : _e.value) || 1;
                intensity.value *= ratio;
                estimations.push(intensity);
                _k.label = 14;
            case 14:
                if (!(mobilityAnswer.carPassengersFirstKey &&
                    mobilityAnswer.carIntensityFactorKey)) return [3 /*break*/, 20];
                return [4 /*yield*/, getData('car-passengers', mobilityAnswer.carPassengersFirstKey + '_private-car-factor')];
            case 15:
                passengers = _k.sent();
                passengerIntensityRatio = ((_f = passengers === null || passengers === void 0 ? void 0 : passengers.Item) === null || _f === void 0 ? void 0 : _f.value) || 1;
                return [4 /*yield*/, getData('car-intensity-factor', mobilityAnswer.carIntensityFactorKey || 'unknown_driving-factor')];
            case 16:
                driving = _k.sent();
                ghgIntensityRatio = ((_g = driving === null || driving === void 0 ? void 0 : driving.Item) === null || _g === void 0 ? void 0 : _g.value) || 1;
                if (!(((_h = mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carIntensityFactorKey) === null || _h === void 0 ? void 0 : _h.startsWith('phv_')) ||
                    ((_j = mobilityAnswer === null || mobilityAnswer === void 0 ? void 0 : mobilityAnswer.carIntensityFactorKey) === null || _j === void 0 ? void 0 : _j.startsWith('ev_')))) return [3 /*break*/, 18];
                return [4 /*yield*/, getData('renewable-car-intensity-factor', mobilityAnswer.carIntensityFactorKey)];
            case 17:
                data_4 = _k.sent();
                if (data_4 === null || data_4 === void 0 ? void 0 : data_4.Item) {
                    ghgIntensityRatio =
                        ghgIntensityRatio * (1 - electricityIntensityFactor) +
                            data_4.Item.value * electricityIntensityFactor;
                }
                _k.label = 18;
            case 18:
                intensity = createIntensity(baselines, 'car-sharing-driving');
                intensity.value *= ghgIntensityRatio * passengerIntensityRatio;
                estimations.push(intensity);
                return [4 /*yield*/, getData('car-intensity-factor', mobilityAnswer.carIntensityFactorKey.replace('_driving-factor', '_manufacturing-factor') || 'unknown_manufacturing-factor')];
            case 19:
                rental = _k.sent();
                if (rental === null || rental === void 0 ? void 0 : rental.Item) {
                    intensity_1 = createIntensity(baselines, 'car-sharing-rental');
                    intensity_1.value *= rental.Item.value;
                    estimations.push(intensity_1);
                }
                _k.label = 20;
            case 20:
                estimationAmount = {
                    airplane: createAmount(baselines, 'airplane'),
                    train: createAmount(baselines, 'train'),
                    bus: createAmount(baselines, 'bus'),
                    ferry: createAmount(baselines, 'ferry'),
                    taxi: createAmount(baselines, 'taxi'),
                    carSharing: createAmount(baselines, 'car-sharing-driving'),
                    motorbike: createAmount(baselines, 'motorbike-driving'),
                    motorbikePurchase: createAmount(baselines, 'motorbike-purchase'),
                    carSharingRental: createAmount(baselines, 'car-sharing-rental'),
                    motorbikeMaintenance: createAmount(baselines, 'motorbike-maintenance')
                };
                mileage = {
                    airplane: 0,
                    ferry: 0,
                    train: 0,
                    bus: 0,
                    motorbike: 0,
                    taxi: 0,
                    carSharing: 0
                };
                weeklyTravelingTime = {
                    train: 0,
                    bus: 0,
                    motorbike: 0,
                    otherCar: 0
                };
                if (!mobilityAnswer.hasTravelingTime) return [3 /*break*/, 21];
                weeklyTravelingTime.train = mobilityAnswer.trainWeeklyTravelingTime || 0;
                weeklyTravelingTime.bus = mobilityAnswer.busWeeklyTravelingTime || 0;
                weeklyTravelingTime.motorbike =
                    mobilityAnswer.motorbikeWeeklyTravelingTime || 0;
                weeklyTravelingTime.otherCar =
                    mobilityAnswer.otherCarWeeklyTravelingTime || 0;
                return [3 /*break*/, 23];
            case 21:
                mileageByAreaFirstKey = mobilityAnswer.mileageByAreaFirstKey || 'unknown';
                params_1 = {
                    TableName: parameterTableName,
                    KeyConditions: {
                        category: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['mileage-by-area']
                        },
                        key: {
                            ComparisonOperator: 'BEGINS_WITH',
                            AttributeValueList: [mileageByAreaFirstKey + '_']
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(params_1).promise()];
            case 22:
                data_5 = _k.sent();
                milageByArea = data_5.Items.reduce(function (a, x) {
                    a[x.key] = x.value;
                    return a;
                }, {});
                //=IF('2_CF推定質問'!$F$166='2_CF推定質問'!$W$166,'2_CF推定質問'!U191,'2_CF推定質問'!S186)
                mileage.airplane = milageByArea[mileageByAreaFirstKey + '_airplane'];
                mileage.train = milageByArea[mileageByAreaFirstKey + '_train'];
                mileage.bus = milageByArea[mileageByAreaFirstKey + '_bus'];
                mileage.motorbike =
                    milageByArea[mileageByAreaFirstKey + '_motorbike-driving'];
                mileage.taxi = milageByArea[mileageByAreaFirstKey + '_taxi'];
                mileage.carSharing =
                    milageByArea[mileageByAreaFirstKey + '_car-sharing-driving'];
                _k.label = 23;
            case 23:
                annualTravelingTime = {
                    otherCar: mobilityAnswer.otherCarAnnualTravelingTime || 0,
                    train: mobilityAnswer.trainAnnualTravelingTime || 0,
                    bus: mobilityAnswer.busAnnualTravelingTime || 0,
                    motorbike: mobilityAnswer.motorbikeAnnualTravelingTime || 0,
                    airplane: mobilityAnswer.airplaneAnnualTravelingTime || 0,
                    ferry: mobilityAnswer.ferryAnnualTravelingTime || 0
                };
                return [4 /*yield*/, getData('misc', 'weeks-per-year-excluding-long-vacations')];
            case 24:
                // 年間週数の取得
                data = _k.sent();
                weekCount = 49;
                if (data === null || data === void 0 ? void 0 : data.Item) {
                    weekCount = data.Item.value;
                }
                paramsTransportation = {
                    TableName: parameterTableName,
                    KeyConditions: {
                        category: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['transportation-speed']
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(paramsTransportation).promise()];
            case 25:
                data = _k.sent();
                speed = data.Items.reduce(function (a, x) {
                    a[x.key] = x.value;
                    return a;
                }, {});
                // 飛行機の移動距離の積算
                mileage.airplane += annualTravelingTime.airplane * speed['airplane-speed'];
                // フェリーの移動距離の積算
                mileage.ferry += annualTravelingTime.ferry * speed['ferry-speed'];
                // 電車の移動距離の積算
                mileage.train +=
                    weeklyTravelingTime.train * weekCount * speed['train-speed'] +
                        annualTravelingTime.train * speed['long-distance-train-speed'];
                // バスの移動距離の積算
                mileage.bus +=
                    weeklyTravelingTime.bus * weekCount * speed['bus-speed'] +
                        annualTravelingTime.bus * speed['express-bus-speed'];
                // バイクの移動距離の積算
                mileage.motorbike +=
                    weeklyTravelingTime.motorbike * weekCount * speed['motorbike-speed'] +
                        annualTravelingTime.motorbike * speed['long-distance-motorbike-speed'];
                taxiRatio = estimationAmount.taxi.value /
                    (estimationAmount.taxi.value + estimationAmount.carSharing.value);
                otherCarMileage = weeklyTravelingTime.otherCar * weekCount * speed['car-speed'] +
                    annualTravelingTime.otherCar * speed['long-distance-car-speed'];
                mileage.taxi += otherCarMileage * taxiRatio; // タクシーの移動距離の積算
                mileage.carSharing += otherCarMileage * (1 - taxiRatio); // カーシェアリングの移動距離の積算
                baselineMotorbikeAmount = estimationAmount.motorbike.value;
                baselineCarSharingAmount = estimationAmount.carSharing.value;
                // ベースラインの値を書き換えてEstimationを生成
                for (_i = 0, _a = Object.keys(mileage); _i < _a.length; _i++) {
                    item = _a[_i];
                    estimationAmount[item].value = mileage[item];
                    estimations.push(estimationAmount[item]);
                }
                motorbikeDrivingRatio = estimationAmount.motorbike.value / baselineMotorbikeAmount;
                carSharingDrivingRatio = estimationAmount.carSharing.value / baselineCarSharingAmount;
                estimationAmount.motorbikePurchase.value *= motorbikeDrivingRatio;
                estimationAmount.carSharingRental.value *= carSharingDrivingRatio;
                estimationAmount.motorbikeMaintenance.value *= motorbikeDrivingRatio;
                estimations.push(estimationAmount.motorbikePurchase);
                estimations.push(estimationAmount.carSharingRental);
                estimations.push(estimationAmount.motorbikeMaintenance);
                return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateMobility = estimateMobility;
