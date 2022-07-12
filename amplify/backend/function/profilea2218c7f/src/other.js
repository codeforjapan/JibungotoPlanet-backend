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
var estimateOther = function (dynamodb, otherAnswer, footprintTableName, parameterTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var findAmount, estimations, params, data, baselines, answers, _i, answers_1, ans, data_1, denominator, base, coefficient, _a, _b, item, baseline;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
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
                data = _e.sent();
                baselines = data.Items.map(function (item) { return (0, util_1.toBaseline)(item); });
                // 回答がない場合はベースラインのみ返す
                if (!otherAnswer) {
                    return [2 /*return*/, { baselines: baselines, estimations: estimations }];
                }
                answers = [
                    // 日用消耗品の支出はどのくらいですか？
                    // dailyGoods: String # 5k-less|5k-10k|10k-20k|20k-30k|30k-more|unknown|average-per-capita
                    // daily-goods-medicine 日用品・化粧品・医薬品
                    {
                        category: 'daily-goods-amount',
                        key: otherAnswer.dailyGoodsAmountKey,
                        base: 'average-per-capita',
                        items: ['sanitation', 'kitchen-goods', 'paper-stationery']
                    },
                    // 通信費、放送受信料を合わせた支出はどのくらいですか？
                    // communication: String # 5k-less|5k10k|10k-20k|20k-30k|30k-more|unknown|average-per-capita
                    // communication-delivery 通信・配送・放送サービス
                    {
                        category: 'communication-amount',
                        key: otherAnswer.communicationAmountKey,
                        base: 'average-per-capita',
                        items: ['communication', 'broadcasting']
                    },
                    // 過去1年間の家電、家具などの大型な買い物の支出はどのくらいですか？
                    // applianceFurniture: String # 50k-less|50k-100k|100k-200k|200k-300k||300k-400k|400k-more|unknown|average-per-capita
                    // appliance-furniture 家電・家具
                    {
                        category: 'appliance-furniture-amount',
                        key: otherAnswer.applianceFurnitureAmountKey,
                        base: 'average-per-capita',
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
                    // personal-care-other-services その他サービス
                    // ceremony 冠婚葬祭
                    // waste-repair-rental 廃棄物処理・修理・レンタル
                    // welfare-education 医療・福祉・教育サービス
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
                    // hobby-books 趣味用品・書籍・雑誌
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
                    // clothes 衣類・宝飾品
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
                    // leisure-sports レジャー・スポーツ施設
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
                    // travel-hotel 旅行・宿泊
                    {
                        category: 'travel-factor',
                        key: otherAnswer.travelFactorKey,
                        items: ['hotel', 'travel']
                    }
                ];
                _i = 0, answers_1 = answers;
                _e.label = 2;
            case 2:
                if (!(_i < answers_1.length)) return [3 /*break*/, 7];
                ans = answers_1[_i];
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
                data_1 = _e.sent();
                denominator = 1;
                if (!ans.base) return [3 /*break*/, 5];
                return [4 /*yield*/, dynamodb
                        .get({
                        TableName: parameterTableName,
                        Key: {
                            category: ans.category,
                            key: ans.base
                        }
                    })
                        .promise()];
            case 4:
                base = _e.sent();
                if ((_c = base === null || base === void 0 ? void 0 : base.Item) === null || _c === void 0 ? void 0 : _c.value) {
                    denominator = base.Item.value;
                }
                _e.label = 5;
            case 5:
                if ((_d = data_1 === null || data_1 === void 0 ? void 0 : data_1.Item) === null || _d === void 0 ? void 0 : _d.value) {
                    coefficient = data_1.Item.value / denominator;
                    for (_a = 0, _b = ans.items; _a < _b.length; _a++) {
                        item = _b[_a];
                        baseline = findAmount(baselines, item);
                        baseline.value *= coefficient;
                        estimations.push((0, util_1.toEstimation)(baseline));
                    }
                }
                _e.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateOther = estimateOther;
