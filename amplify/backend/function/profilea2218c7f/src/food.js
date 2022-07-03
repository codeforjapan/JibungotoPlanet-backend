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
    var findAmount, estimations, params, data, baselines, answers, _i, answers_1, ans, params_1, data_1, coefficient, _a, _b, item, component;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
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
                data = _d.sent();
                baselines = data.Items.map(function (item) { return (0, util_1.toBaseline)(item); });
                // 回答がない場合はベースラインのみ返す
                if (!foodAnswer) {
                    return [2 /*return*/, { baselines: baselines, estimations: estimations }];
                }
                answers = [
                    //
                    // 普段の食生活を教えてください
                    //
                    // dishBeef: String # everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown
                    {
                        category: 'dish-beef-factor',
                        key: foodAnswer.dishBeef,
                        items: ['beef']
                    },
                    // dishPork: String # everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown
                    {
                        category: 'dish-pork-factor',
                        key: foodAnswer.dishPork,
                        items: ['pork']
                    },
                    // dishChicken: String # everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown
                    {
                        category: 'dish-chicken-factor',
                        key: foodAnswer.dishChicken,
                        items: ['chicken']
                    },
                    // dishSeafood: String # everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown
                    {
                        category: 'dish-seafood-factor',
                        key: foodAnswer.dishSeafood,
                        items: ['fish', 'processedfish']
                    },
                    // dairyFood: String # 3-more-per-day|2-per-day|1-per-day|half-of-week|1-2-less-per-week|never|unknown
                    {
                        category: 'dairy-food-factor',
                        key: foodAnswer.dairyFood,
                        items: ['milk', 'otherdairy', 'eggs']
                    },
                    //
                    // １週間にどのくらいの頻度でお酒を飲みますか？
                    //
                    // alcohol: String # everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown
                    {
                        category: 'alcohol-factor',
                        key: foodAnswer.alcohol,
                        items: ['alcohol']
                    }
                ];
                _i = 0, answers_1 = answers;
                _d.label = 2;
            case 2:
                if (!(_i < answers_1.length)) return [3 /*break*/, 5];
                ans = answers_1[_i];
                console.log(ans.category);
                params_1 = {
                    TableName: parameterTableName,
                    Key: {
                        category: ans.category,
                        key: ans.key
                    }
                };
                return [4 /*yield*/, dynamodb.get(params_1).promise()];
            case 3:
                data_1 = _d.sent();
                if ((_c = data_1 === null || data_1 === void 0 ? void 0 : data_1.Item) === null || _c === void 0 ? void 0 : _c.value) {
                    coefficient = data_1.Item.value;
                    for (_a = 0, _b = ans.items; _a < _b.length; _a++) {
                        item = _b[_a];
                        component = findAmount(baselines, item);
                        component.value *= coefficient;
                        estimations.push((0, util_1.toEstimation)(component));
                    }
                }
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                // お酒以外の飲み物、お菓子類の1ヶ月の支出はどのくらいですか？
                //
                // softdrinkSnack: String #3000-less|3000-5000|5000-10000|10000-15000|15000-more|unknown
                // sweets-snack
                // coffee-tea
                // colddrink
                //
                // 1ヶ月の外食費はどのくらいですか？
                //
                // eatout: String # 5000-less|5000-10000|10000-20000|20000-50000|50000-more|unknown
                // restaurant
                // barcafe
                console.log(JSON.stringify(estimations));
                return [2 /*return*/, { baselines: baselines, estimations: estimations }];
        }
    });
}); };
exports.estimateFood = estimateFood;
