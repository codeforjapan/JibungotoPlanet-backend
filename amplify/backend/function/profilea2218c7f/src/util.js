"use strict";
exports.__esModule = true;
exports.toBaseline = exports.toEstimation = exports.findBaseline = void 0;
var findBaseline = function (baselines, domain, item, type) {
    var baseline = baselines.find(function (bl) { return bl.domain === domain && bl.item === item && bl.type === type; });
    return baseline;
};
exports.findBaseline = findBaseline;
var toEstimation = function (baseline) {
    return {
        domain: baseline.domain,
        item: baseline.item,
        type: baseline.type,
        value: baseline.value,
        subdomain: baseline.subdomain,
        unit: baseline.unit
    };
};
exports.toEstimation = toEstimation;
var toBaseline = function (rec) {
    var dir_domain = rec.dir_domain.split('_');
    var item_type = rec.item_type.split('_');
    return {
        domain: dir_domain[1],
        item: item_type[0],
        type: item_type[1],
        value: rec.value,
        subdomain: rec.subdomain,
        unit: rec.unit,
        citation: rec.citation
    };
};
exports.toBaseline = toBaseline;
