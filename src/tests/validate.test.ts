import { validate } from '../../lib/lambda/actions/validate'

// DynamoDB を使わないテスト
describe('Test validate limits', () => {
  test('accepts values at the limits', () => {
    expect(
      validate({
        housingAnswer: {
          residentCount: 15,
          electricityMonthlyConsumption: 10000,
          gasMonthlyConsumption: 1000,
          keroseneMonthlyConsumption: 1000,
          keroseneMonthCount: 12
        },
        mobilityAnswer: {
          privateCarAnnualMileage: 100000,
          trainWeeklyTravelingTime: 168,
          airplaneAnnualTravelingTime: 8760
        }
      })
    ).toBe(true)
  })

  test.each([
    { housingAnswer: { residentCount: 16 } },
    { housingAnswer: { residentCount: 2.5 } },
    { housingAnswer: { electricityMonthlyConsumption: 10001 } },
    { housingAnswer: { gasMonthlyConsumption: 1001 } },
    { housingAnswer: { keroseneMonthlyConsumption: 1001 } },
    { housingAnswer: { keroseneMonthCount: 13 } },
    { mobilityAnswer: { privateCarAnnualMileage: 100001 } },
    { mobilityAnswer: { busWeeklyTravelingTime: 169 } },
    { mobilityAnswer: { ferryAnnualTravelingTime: 8761 } }
  ])('rejects values over the limits: %j', (body) => {
    expect(validate(body)).toBe(false)
  })

  test('accepts legacy answer keys, but limits their numbers', () => {
    expect(
      validate({
        mobilityAnswer: { trainAnnuallyTravelingTime: 10, privateCarType: 'x' }
      })
    ).toBe(true)
    expect(validate({ housingAnswer: { foo: 1e20 } })).toBe(false)
    expect(validate({ foodAnswer: { foo: { bar: 1 } } })).toBe(false)
  })

  test('limits action intensity rates to 0-1', () => {
    expect(
      validate({
        actionIntensityRates: [
          { option: 'zeh', value: 0.5, defaultValue: 1, range: [0, 1] },
          { option: 'ec', value: null }
        ]
      })
    ).toBe(true)
    expect(
      validate({ actionIntensityRates: [{ option: 'zeh', value: 2 }] })
    ).toBe(false)
    expect(
      validate({ actionIntensityRates: [{ option: 'zeh', value: Infinity }] })
    ).toBe(false)
  })
})
