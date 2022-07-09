const findBaseline = (baselines, domain, item, type) => {
  const baseline = baselines.find(
    (bl) => bl.domain === domain && bl.item === item && bl.type === type
  )
  return baseline
}

const toEstimation = (baseline) => {
  return {
    domain: baseline.domain,
    item: baseline.item,
    type: baseline.type,
    value: baseline.value,
    subdomain: baseline.subdomain,
    unit: baseline.unit
  }
}

const toBaseline = (rec) => {
  const dir_domain = rec.dir_domain.split('_')
  const item_type = rec.item_type.split('_')
  return {
    domain: dir_domain[1],
    item: item_type[0],
    type: item_type[1],
    value: rec.value,
    subdomain: rec.subdomain,
    unit: rec.unit,
    citation: rec.citation
  }
}

export { findBaseline, toEstimation, toBaseline }
