module.exports.findBaseline = (baselines, domain, item, type) => {
  const baseline = baselines.find(
    (bl) => bl.domain === domain && bl.item === item && bl.type === type
  )
  return baseline
}

module.exports.toEstimation = (baseline) => {
  return {
    domain: baseline.domain,
    item: baseline.item,
    type: baseline.type,
    value: baseline.value,
    subdomain: baseline.subdomain,
    unit: baseline.unit
  }
}

module.exports.toBaseline = (rec) => {
  const dirAndDomain = rec.dirAndDomain.split('_')
  const itemAndType = rec.itemAndType.split('_')
  return {
    domain: dirAndDomain[1],
    item: itemAndType[0],
    type: itemAndType[1],
    value: rec.value,
    subdomain: rec.subdomain,
    unit: rec.unit,
    citation: rec.citation
  }
}
