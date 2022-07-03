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
var estimateMobility = function (dynamodb, mobilityAnswer, footprintTableName, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var findAmount, findIntensity, estimations, params, data, baselines, intensity, params_1, data_1, carPassengersKey, ratio, amount, baselineAmount, mileageRatio, privateCarPurchase, privateCarMaintenance, estimationAmount, mileage, weeklyTravelingTime, mileageByAreaFirstKey, params_2, data_2, milageByArea, annualTravelingTime, params_wpyelv, weekCount, params_ts, speed, taxiRatio, otherCarMileage, baselineMotorbikeAmount, baselineCarSharingAmount, items, _i, items_1, item, motorbikeDrivingRatio, carSharingDrivingRatio;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                findAmount = function (baselines, item) {
                    return (0, util_1.findBaseline)(baselines, 'mobility', item, 'amount');
                };
                findIntensity = function (baselines, item) {
                    return (0, util_1.findBaseline)(baselines, 'mobility', item, 'intensity');
                };
                estimations = [];
                params = {
                    TableName: footprintTableName,
                    KeyConditions: {
                        dirAndDomain: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['baseline_mobility']
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(params).promise()];
            case 1:
                data = _b.sent();
                baselines = data.Items.map(function (item) { return (0, util_1.toBaseline)(item); });
                // 回答がない場合はベースラインのみ返す
                if (!mobilityAnswer) {
                    return [2 /*return*/, { baselines: baselines, estimations: estimations }];
                }
                if (!mobilityAnswer.hasPrivateCar) return [3 /*break*/, 4];
                if (!mobilityAnswer.carIntensityFactorKey) return [3 /*break*/, 4];
                intensity = findIntensity(baselines, 'private-car-driving');
                params_1 = {
                    TableName: parameterTableName,
                    Key: {
                        category: 'car-intensity-factor',
                        key: mobilityAnswer.carIntensityFactorKey
                    }
                };
                return [4 /*yield*/, dynamodb.get(params_1).promise()];
            case 2:
                data_1 = _b.sent();
                if (data_1 === null || data_1 === void 0 ? void 0 : data_1.Item) {
                    intensity.value = data_1.Item.value;
                }
                carPassengersKey = mobilityAnswer.carPassengersKey || 'unknown_private-car-factor';
                params_1.Key = {
                    category: 'car-passengers',
                    key: carPassengersKey
                };
                return [4 /*yield*/, dynamodb.get(params_1).promise()];
            case 3:
                data_1 = _b.sent();
                ratio = ((_a = data_1 === null || data_1 === void 0 ? void 0 : data_1.Item) === null || _a === void 0 ? void 0 : _a.value) || 1;
                console.log('private-car-driving-intensity = ' + intensity.value);
                console.log('carPassengersKey = ' +
                    carPassengersKey +
                    ', private-car-factor = ' +
                    ratio);
                //
                // TODO: PHV, EVの場合は自宅での充電割合と再生エネルギー電力の割合で補正が必要。
                //
                intensity.value = intensity.value * ratio;
                console.log('private-car-driving-intensity after car passenger adjustment  = ' +
                    intensity.value);
                estimations.push((0, util_1.toEstimation)(intensity));
                amount = findAmount(baselines, 'private-car-driving');
                baselineAmount = amount.value;
                amount.value = mobilityAnswer.privateCarAnnualMileage;
                estimations.push((0, util_1.toEstimation)(amount));
                mileageRatio = amount.value / baselineAmount;
                privateCarPurchase = findAmount(baselines, 'private-car-purchase');
                privateCarMaintenance = findAmount(baselines, 'private-car-maintenance');
                // 自家用車の購入・メンテナンスを移動距離比で補正
                privateCarPurchase.value *= mileageRatio;
                privateCarMaintenance.value *= mileageRatio;
                estimations.push((0, util_1.toEstimation)(privateCarPurchase));
                estimations.push((0, util_1.toEstimation)(privateCarMaintenance));
                _b.label = 4;
            case 4:
                console.log('calculating weekly mileage');
                estimationAmount = {
                    airplane: findAmount(baselines, 'airplane'),
                    train: findAmount(baselines, 'train'),
                    bus: findAmount(baselines, 'bus'),
                    ferry: findAmount(baselines, 'ferry'),
                    taxi: findAmount(baselines, 'taxi'),
                    carSharing: findAmount(baselines, 'car-sharing-driving'),
                    motorbike: findAmount(baselines, 'motorbike-driving'),
                    motorbikePurchase: findAmount(baselines, 'motorbike-purchase'),
                    carSharingRental: findAmount(baselines, 'car-sharing-rental'),
                    motorbikeMaintenance: findAmount(baselines, 'motorbike-maintenance')
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
                if (!mobilityAnswer.hasWeeklyTravelingTime) return [3 /*break*/, 5];
                weeklyTravelingTime.train = mobilityAnswer.trainWeeklyTravelingTime || 0;
                weeklyTravelingTime.bus = mobilityAnswer.busWeeklyTravelingTime || 0;
                weeklyTravelingTime.motorbike =
                    mobilityAnswer.motorbikeWeeklyTravelingTime || 0;
                weeklyTravelingTime.otherCar =
                    mobilityAnswer.otherCarWeeklyTravelingTime || 0;
                return [3 /*break*/, 7];
            case 5:
                mileageByAreaFirstKey = mobilityAnswer.mileageByAreaFirstKey || 'unknown';
                params_2 = {
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
                return [4 /*yield*/, dynamodb.query(params_2).promise()];
            case 6:
                data_2 = _b.sent();
                milageByArea = data_2.Items.reduce(function (a, x) {
                    a[x.key] = x.value;
                    return a;
                }, {});
                mileage.train = milageByArea[mileageByAreaFirstKey + '_train'];
                mileage.bus = milageByArea[mileageByAreaFirstKey + '_bus'];
                mileage.motorbike = milageByArea[mileageByAreaFirstKey + '_motorbike'];
                mileage.taxi = milageByArea[mileageByAreaFirstKey + '_taxi'];
                mileage.carSharing = milageByArea[mileageByAreaFirstKey + 'car-sharing'];
                _b.label = 7;
            case 7:
                console.log('calculating annual mileage');
                annualTravelingTime = {
                    otherCar: mobilityAnswer.otherCarAnnualTravelingTime || 0,
                    train: mobilityAnswer.trainAnnualTravelingTime || 0,
                    bus: mobilityAnswer.busAnnualTravelingTime || 0,
                    motorbike: mobilityAnswer.motorbikeAnnualTravelingTime || 0,
                    airplane: mobilityAnswer.airplaneAnnualTravelingTime || 0,
                    ferry: mobilityAnswer.ferryAnnualTravelingTime || 0
                };
                console.log('getting weeks-per-year-excluding-long-vacations');
                params_wpyelv = {
                    TableName: parameterTableName,
                    Key: {
                        category: 'misc',
                        key: 'weeks-per-year-excluding-long-vacations'
                    }
                };
                return [4 /*yield*/, dynamodb.get(params_wpyelv).promise()];
            case 8:
                data = _b.sent();
                weekCount = 49;
                if (data === null || data === void 0 ? void 0 : data.Item) {
                    weekCount = data.Item.value;
                }
                console.log('getting transportation-speed');
                params_ts = {
                    TableName: parameterTableName,
                    KeyConditions: {
                        category: {
                            ComparisonOperator: 'EQ',
                            AttributeValueList: ['transportation-speed']
                        }
                    }
                };
                return [4 /*yield*/, dynamodb.query(params_ts).promise()];
            case 9:
                data = _b.sent();
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
                items = [
                    'airplane',
                    'train',
                    'bus',
                    'ferry',
                    'taxi',
                    'carSharing',
                    'motorbike'
                ];
                for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                    item = items_1[_i];
                    estimationAmount[item].value = mileage[item];
                    estimations.push((0, util_1.toEstimation)(estimationAmount[item]));
                }
                motorbikeDrivingRatio = estimationAmount.motorbike.value / baselineMotorbikeAmount;
                carSharingDrivingRatio = estimationAmount.carSharing.value / baselineCarSharingAmount;
                estimationAmount.motorbikePurchase.value *= motorbikeDrivingRatio;
                estimationAmount.carSharingRental.value *= carSharingDrivingRatio;
                estimationAmount.motorbikeMaintenance.value *= motorbikeDrivingRatio;
                estimations.push((0, util_1.toEstimation)(estimationAmount.motorbikePurchase));
                estimations.push((0, util_1.toEstimation)(estimationAmount.carSharingRental));
                estimations.push((0, util_1.toEstimation)(estimationAmount.motorbikeMaintenance));
                console.log(JSON.stringify(estimations));
                return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateMobility = estimateMobility;
