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
var calculateActions = function (dynamodb, baselines, estimations, optionTableName) { return __awaiter(void 0, void 0, void 0, function () {
    var results, _i, baselines_1, baseline, _a, estimations_1, estimation, key, result, toAction, optionData, actions, phase1, _b, _c, action, phase2, _d, _e, action, phase3, _f, _g, action;
    return __generator(this, function (_h) {
        switch (_h.label) {
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
                optionData = _h.sent();
                actions = optionData.Items.map(function (item) { return toOption(item); })
                    .filter(function (option) { return results.has(option.key); })
                    .map(function (option) { return toAction(option); });
                phase1 = new Set([
                    'absolute-target',
                    'add-amount',
                    'increase-rate',
                    'reduction-rate'
                ]);
                for (_b = 0, _c = actions.filter(function (action) {
                    return phase1.has(action.operation);
                }); _b < _c.length; _b++) {
                    action = _c[_b];
                    switch (action.operation) {
                        case 'absolute-target':
                            absoluteTarget(action);
                            break;
                        case 'add-amount':
                            addAmount(action);
                            break;
                        case 'increase-rate':
                        case 'reduction-rate':
                            increaseRate(action);
                            break;
                    }
                    results.get(action.key).actions.set(action.option, action); // actionを登録
                }
                phase2 = new Set([
                    'proportional-to-other-items',
                    'shift-from-other-items'
                ]);
                for (_d = 0, _e = actions.filter(function (action) {
                    return phase2.has(action.operation);
                }); _d < _e.length; _d++) {
                    action = _e[_d];
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
                    'question-answer-to-target',
                    'question-answer-to-target-inverse',
                    'question-reduction-rate',
                    'rebound-from-other-footprints'
                ]);
                for (_f = 0, _g = actions.filter(function (action) {
                    return phase3.has(action.operation);
                }); _f < _g.length; _f++) {
                    action = _g[_f];
                    switch (action.operation) {
                        /*
                        case 'shift-from-other-items':
                          shiftFromOtherItems(action, results)
                          break
                        case 'proportional-to-other-items':
                          proportionalToOtherItems(action, results)
                          break*/
                        case 'proportional-to-other-footprints':
                            proportionalToOtherFootprints(action, results);
                            break;
                        case 'further-reduction-from-other-footprints':
                        case 'rebound-from-other-footprints':
                            furtherReductionFromOtherFootprints(action, results);
                            break;
                        case 'question-answer-to-target':
                        case 'question-answer-to-target-inverse':
                        case 'question-reduction-rate':
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
            /*
            if (
              action.option === 'vegan' &&
              action.key === 'food_bar-cafe_intensity'
            ) {
              console.log(
                key +
                  ' : ' +
                  action.option +
                  ':' +
                  action.key +
                  ' : after =' +
                  after +
                  ', before = ' +
                  before +
                  ' : value = ' +
                  value
              )
            }
            */
        }
        return sum + value;
    }, 0);
    /*
    console.log(
      action.key + ':' + sum + ',' + action.optionValue + ' <- ' + action.value
    )
    */
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
        var ab = ((_b = (_a = results.get(key + '_amount')) === null || _a === void 0 ? void 0 : _a.estimation) === null || _b === void 0 ? void 0 : _b.value) || 0;
        var aa = (_d = (_c = results.get(key + '_amount')) === null || _c === void 0 ? void 0 : _c.actions.get(action.option)) === null || _d === void 0 ? void 0 : _d.value;
        var ib = ((_f = (_e = results.get(key + '_intensity')) === null || _e === void 0 ? void 0 : _e.estimation) === null || _f === void 0 ? void 0 : _f.value) || 0;
        var ia = (_h = (_g = results.get(key + '_intensity')) === null || _g === void 0 ? void 0 : _g.actions.get(action.option)) === null || _h === void 0 ? void 0 : _h.value;
        if (aa === null || aa === undefined) {
            aa = ab;
        }
        if (ia === null || ia === undefined) {
            ia = ib;
        }
        /*
        if (
          action.option === 'white-meat-fish' &&
          action.key === 'food_restaurant_intensity'
        ) {
          console.log(
            key +
              ' : ' +
              action.option +
              ':' +
              action.key +
              ', amountBefore = ' +
              ab +
              ' : amountAfter =' +
              aa +
              ', intensityBefore = ' +
              ib +
              ' : intensityAfter =' +
              ia
          )
        }
        */
        sumBefore += ab * ib;
        sumAfter += aa * ia;
    }
    if (sumBefore !== 0) {
        action.value =
            action.value * (1 - action.optionValue) +
                action.value * action.optionValue * (sumAfter / sumBefore);
    }
};
// [削減後] = [削減前] + (Σ[valueで指定したフットプリントの削減後] - Σ[valueで指定したフットプリントの削減前]-) x [value2で指定したリバウンド割合]
var furtherReductionFromOtherFootprints = function (action, results) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var sumBefore = 0;
    var sumAfter = 0;
    for (var _i = 0, _j = action.args; _i < _j.length; _i++) {
        var key = _j[_i];
        sumBefore +=
            (((_b = (_a = results.get(key + '_amount')) === null || _a === void 0 ? void 0 : _a.estimation) === null || _b === void 0 ? void 0 : _b.value) || 0) *
                (((_d = (_c = results.get(key + '_intensity')) === null || _c === void 0 ? void 0 : _c.estimation) === null || _d === void 0 ? void 0 : _d.value) || 0);
        sumAfter +=
            (((_f = (_e = results.get(key + '_amount')) === null || _e === void 0 ? void 0 : _e.actions.get(action.option)) === null || _f === void 0 ? void 0 : _f.value) || 0) *
                (((_h = (_g = results.get(key + '_intensity')) === null || _g === void 0 ? void 0 : _g.actions.get(action.option)) === null || _h === void 0 ? void 0 : _h.value) || 0);
    }
    action.value += (sumAfter - sumBefore) * action.optionValue;
};
