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
var estimateOther = function (dynamodb, housingAnswer, otherAnswer, footprintTableName, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var findAmount, estimations, params, data, baselines, residentCount, answers, _i, answers_1, ans, data_1, denominator, base, coefficient, _a, _b, item, estimation, wasteSet, isTarget, targets, results, baselineSum, _c, targets_1, baseline, key, _d, _e, estimation, key, estimationSum, it, res, estimation, wasteEstimation;
    var _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
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
                data = _h.sent();
                baselines = data.Items.map(function (item) { return (0, util_1.toBaseline)(item); });
                // 回答がない場合はベースラインのみ返す
                if (!otherAnswer) {
                    return [2 /*return*/, { baselines: baselines, estimations: estimations }];
                }
                residentCount = 2.33;
                if (housingAnswer && housingAnswer.residentCount) {
                    residentCount = housingAnswer.residentCount;
                }
                answers = [
                    // 日用消耗品の支出はどのくらいですか？
                    // dailyGoods: String # 5k-less|5k-10k|10k-20k|20k-30k|30k-more|unknown|average-per-capita
                    {
                        category: 'daily-goods-amount',
                        key: otherAnswer.dailyGoodsAmountKey,
                        base: 'average-per-capita',
                        residentCount: residentCount,
                        items: ['sanitation', 'kitchen-goods', 'paper-stationery']
                    },
                    // 通信費、放送受信料を合わせた支出はどのくらいですか？
                    // communication: String # 5k-less|5k10k|10k-20k|20k-30k|30k-more|unknown|average-per-capita
                    {
                        category: 'communication-amount',
                        key: otherAnswer.communicationAmountKey,
                        base: 'average-per-capita',
                        residentCount: residentCount,
                        items: ['communication', 'broadcasting']
                    },
                    // 過去1年間の家電、家具などの大型な買い物の支出はどのくらいですか？
                    // applianceFurniture: String # 50k-less|50k-100k|100k-200k|200k-300k||300k-400k|400k-more|unknown|average-per-capita
                    {
                        category: 'appliance-furniture-amount',
                        key: otherAnswer.applianceFurnitureAmountKey,
                        base: 'average-per-capita',
                        residentCount: residentCount,
                        items: [
                            'electrical-appliances-repair-rental',
                            'furniture-daily-goods-repair-rental',
                            'cooking-appliances',
                            'heating-cooling-appliances',
                            'other-appliances',
                            'electronics',
                            'furniture',
                            'covering'
                        ]
                    },
                    //  医療、福祉、教育、塾などの習い事の支出はどのくらいですか？
                    // service: String # 5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown
                    {
                        category: 'service-factor',
                        key: otherAnswer.serviceFactorKey,
                        items: [
                            'medicine',
                            'housework',
                            'washing',
                            'medical-care',
                            'nursing',
                            'caring',
                            'formal-education',
                            'informal-education'
                        ]
                    },
                    // 趣味にかかるの物の支出はどのくらいですか？
                    // hobbyGoods: String # 5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown
                    {
                        category: 'hobby-goods-factor',
                        key: otherAnswer.hobbyGoodsFactorKey,
                        items: [
                            'culture-goods',
                            'entertainment-goods',
                            'sports-goods',
                            'gardening-flower',
                            'pet',
                            'tobacco',
                            'books-magazines',
                            'sports-culture-repair-rental',
                            'sports-entertainment-repair-rental'
                        ]
                    },
                    // 衣類、かばん、宝飾品、美容関連などの支出はどのくらいですか？
                    // clothesBeauty: String # 5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown
                    {
                        category: 'clothes-beauty-factor',
                        key: otherAnswer.clothesBeautyFactorKey,
                        items: [
                            'haircare',
                            'cosmetics',
                            'clothes-goods',
                            'bags-jewelries-goods',
                            'clothes-repair-rental',
                            'bags-jewelries-repair-rental'
                        ]
                    },
                    // レジャー、スポーツへの支出はどのくらいですか？
                    // leisureSports: String # 5000-less|5k-10k|10k-20k|20k-50k|50k-more|unknown
                    {
                        category: 'leisure-sports-factor',
                        key: otherAnswer.leisureSportsFactorKey,
                        items: [
                            'culture-leisure',
                            'entertainment-leisure',
                            'sports-leisure',
                            'bath-spa'
                        ]
                    },
                    // 過去１年間の宿泊を伴う旅行にかかった費用はいくらくらいですか？
                    // travel: String # 10k-less|20k-30k|30k-50k|50k-100k|100k-200k|200k-more|unknown
                    {
                        category: 'travel-factor',
                        key: otherAnswer.travelFactorKey,
                        items: ['hotel', 'travel']
                    }
                ];
                _i = 0, answers_1 = answers;
                _h.label = 2;
            case 2:
                if (!(_i < answers_1.length)) return [3 /*break*/, 8];
                ans = answers_1[_i];
                if (!ans.key) return [3 /*break*/, 7];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: ans.category,
                            key: ans.key
                        }
                    })
                        .promise()];
            case 3:
                data_1 = _h.sent();
                denominator = 1;
                if (!ans.base) return [3 /*break*/, 6];
                if (!(ans.key === 'unknown')) return [3 /*break*/, 4];
                // 国平均の支出額（average-per-capita）が指定されていて、わからない、の回答の場合は
                // 国平均に対する比率は1倍。denominatorをundefinedにして計算に使わないようにする。
                denominator = undefined;
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, dynamodb
                    .get({
                    TableName: parameterTableName,
                    Key: {
                        category: ans.category,
                        key: ans.base
                    }
                })
                    .promise()];
            case 5:
                base = _h.sent();
                if ((_f = base === null || base === void 0 ? void 0 : base.Item) === null || _f === void 0 ? void 0 : _f.value) {
                    // 分母は国平均の支出額（average-per-capita） * 居住人数
                    denominator = base.Item.value * residentCount;
                }
                _h.label = 6;
            case 6:
                if ((_g = data_1 === null || data_1 === void 0 ? void 0 : data_1.Item) === null || _g === void 0 ? void 0 : _g.value) {
                    coefficient = denominator ? data_1.Item.value / denominator : 1;
                    for (_a = 0, _b = ans.items; _a < _b.length; _a++) {
                        item = _b[_a];
                        estimation = (0, util_1.toEstimation)(findAmount(baselines, item));
                        estimation.value *= coefficient;
                        estimations.push(estimation);
                    }
                }
                _h.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8:
                wasteSet = new Set([
                    'cooking-appliances',
                    'heating-cooling-appliances',
                    'other-appliances',
                    'electronics',
                    'clothes-goods',
                    'bags-jewelries-goods',
                    'culture-goods',
                    'entertainment-goods',
                    'sports-goods',
                    'gardening-flower',
                    'pet',
                    'tobacco',
                    'furniture',
                    'covering',
                    'cosmetics',
                    'sanitation',
                    'medicine',
                    'kitchen-goods',
                    'paper-stationery',
                    'books-magazines'
                ]);
                isTarget = function (t) {
                    return t.domain === 'other' && wasteSet.has(t.item) && t.type === 'amount';
                };
                targets = baselines.filter(function (b) { return isTarget(b); });
                results = new Map();
                baselineSum = 0;
                for (_c = 0, targets_1 = targets; _c < targets_1.length; _c++) {
                    baseline = targets_1[_c];
                    key = baseline.domain + '_' + baseline.item + '_' + baseline.type;
                    results.set(key, (0, util_1.toEstimation)(baseline));
                    baselineSum += baseline.value;
                }
                for (_d = 0, _e = estimations.filter(function (e) { return isTarget(e); }); _d < _e.length; _d++) {
                    estimation = _e[_d];
                    key = estimation.domain + '_' + estimation.item + '_' + estimation.type;
                    results.set(key, estimation);
                }
                estimationSum = 0;
                it = results.values();
                res = it.next();
                while (!res.done) {
                    estimation = res.value;
                    estimationSum += estimation.value;
                    res = it.next();
                }
                wasteEstimation = (0, util_1.toEstimation)(findAmount(baselines, 'waste'));
                if (baselineSum !== 0) {
                    wasteEstimation.value *= estimationSum / baselineSum;
                }
                estimations.push((0, util_1.toEstimation)(wasteEstimation));
                return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateOther = estimateOther;
