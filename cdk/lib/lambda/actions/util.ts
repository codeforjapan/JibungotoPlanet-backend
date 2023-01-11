const findBaseline = (baselines: any[], domain: string, item: string, type: string) => {
  return baselines.find(
    (bl) => bl.domain === domain && bl.item === item && bl.type === type
  )
}

const toEstimation = (baseline: { domain: any; item: any; type: any; value: any; subdomain: any; unit: any }) => {
  return {
    domain: baseline.domain,
    item: baseline.item,
    type: baseline.type,
    value: baseline.value,
    subdomain: baseline.subdomain,
    unit: baseline.unit
  }
}

const toBaseline = (rec: { dir_domain: string; item_type: string; value: any; subdomain: any; unit: any; }) => {
  const dir_domain = rec.dir_domain.split('_')
  const item_type = rec.item_type.split('_')
  return {
    domain: dir_domain[1],
    item: item_type[0],
    type: item_type[1],
    value: rec.value,
    subdomain: rec.subdomain,
    unit: rec.unit
  }
}

export { findBaseline, toEstimation, toBaseline }
