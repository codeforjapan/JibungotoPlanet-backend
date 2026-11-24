import { estimateHousing } from '../../lib/lambda/actions/housing'

// DynamoDB の代わりに、固定の値を返すクライアントを使うテスト
const ITEMS = [
  'imputed-rent',
  'rent',
  'housing-maintenance',
  'electricity',
  'urban-gas',
  'lpg',
  'kerosene'
]
const dynamodb: any = {
  send: async (command: any) => {
    if (command.input.KeyConditions?.dir_domain) {
      return {
        Items: ITEMS.flatMap((item) =>
          ['amount', 'intensity'].map((type) => ({
            dir_domain: 'baseline_housing',
            item_type: `${item}_${type}`,
            value: 10,
            subdomain: 'test',
            unit: 'test'
          }))
        )
      }
    }
    if (command.input.KeyConditions) {
      return { Items: [] }
    }
    return { Item: { value: 2 } }
  }
}

const answer = {
  housingSizeKey: '2-room',
  electricityIntensityKey: 'conventional',
  electricityMonthlyConsumption: 300,
  electricitySeasonFactorKey: 'january',
  useGas: true,
  energyHeatIntensityKey: 'urban-gas',
  gasMonthlyConsumption: 30,
  gasSeasonFactorKey: 'january',
  useKerosene: true,
  keroseneMonthlyConsumption: 20,
  keroseneMonthCount: 3
}

const valueOf = (estimations: any[], item: string) =>
  estimations.find((e) => e.item === item && e.type === 'amount')?.value

describe('Test housing estimation', () => {
  test('divides by resident count', async () => {
    const { estimations } = await estimateHousing(
      dynamodb,
      { ...answer, residentCount: 2 },
      undefined,
      'footprint',
      'parameter'
    )
    expect(valueOf(estimations, 'electricity')).toBe((300 * 2) / 2)
    expect(valueOf(estimations, 'urban-gas')).toBe((30 * 2 * 2) / 2)
    expect(valueOf(estimations, 'kerosene')).toBe((2 * 20 * 3) / 2)
  })

  test('keeps baselines without resident count instead of NaN', async () => {
    const { estimations } = await estimateHousing(
      dynamodb,
      answer,
      undefined,
      'footprint',
      'parameter'
    )
    for (const e of estimations) {
      expect(Number.isFinite(e.value)).toBe(true)
    }
    expect(valueOf(estimations, 'electricity')).toBeUndefined()
    expect(valueOf(estimations, 'urban-gas')).toBe(10)
    expect(valueOf(estimations, 'lpg')).toBe(0)
  })

  test('estimates unknown housing size without resident count', async () => {
    const { estimations } = await estimateHousing(
      dynamodb,
      { housingSizeKey: 'unknown' },
      undefined,
      'footprint',
      'parameter'
    )
    expect(Number.isFinite(valueOf(estimations, 'rent'))).toBe(true)
    expect(valueOf(estimations, 'rent')).toBe((2 / (10 + 10)) * 10)
  })
})
