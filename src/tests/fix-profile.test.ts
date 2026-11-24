import { NumberValue } from '@aws-sdk/lib-dynamodb'
import {
  fixProfile,
  hasUnsafeNumber,
  isValidAfterFix
} from '../../data/fix-profile'

// DynamoDB を使わないテスト
describe('Test fixing stored profiles', () => {
  test('clamps values slightly over the limit', () => {
    const { updates, changes } = fixProfile({
      housingAnswer: { residentCount: 2, electricityMonthlyConsumption: 12000 }
    })
    expect(updates.housingAnswer).toEqual({
      residentCount: 2,
      electricityMonthlyConsumption: 10000
    })
    expect(changes).toEqual([
      {
        field: 'housingAnswer.electricityMonthlyConsumption',
        before: '12000',
        after: 10000
      }
    ])
  })

  test('removes values far over the limit', () => {
    const { updates } = fixProfile({
      housingAnswer: {
        electricityMonthlyConsumption: NumberValue.from('100000000000000000000')
      },
      mobilityAnswer: { privateCarAnnualMileage: 1000001 }
    })
    expect(updates.housingAnswer).toEqual({})
    expect(updates.mobilityAnswer).toEqual({})
  })

  test('removes resident counts out of range instead of clamping', () => {
    for (const residentCount of [0, 16, 1e20, '2', null]) {
      const { updates } = fixProfile({ housingAnswer: { residentCount } })
      expect(updates.housingAnswer).toEqual({})
    }
  })

  test('removes negative values, unknown options and wrong types', () => {
    const { updates } = fixProfile({
      housingAnswer: {
        gasMonthlyConsumption: -1,
        housingSizeKey: 'castle',
        useGas: 'yes'
      }
    })
    expect(updates.housingAnswer).toEqual({})
  })

  test('keeps legacy keys unless their numbers are too large', () => {
    const { updates } = fixProfile({
      mobilityAnswer: {
        trainAnnuallyTravelingTime: 1e20,
        privateCarType: 'gasoline',
        hasPrivateCar: true
      }
    })
    expect(updates.mobilityAnswer).toEqual({
      privateCarType: 'gasoline',
      hasPrivateCar: true
    })
  })

  test('removes invalid top-level attributes', () => {
    const { updates } = fixProfile({ gender: 'other', age: '20s' })
    expect('gender' in updates).toBe(true)
    expect(updates.gender).toBeUndefined()
    expect('age' in updates).toBe(false)
  })

  test('does not change valid profiles', () => {
    const profile = {
      gender: 'male',
      housingAnswer: { residentCount: NumberValue.from('3'), useGas: true },
      foodAnswer: { foodIntakeFactorKey: 'moderate' },
      actionIntensityRates: [{ option: 'zeh', value: NumberValue.from('1') }]
    }
    const { updates, changes } = fixProfile(profile)
    expect(changes).toEqual([])
    expect(isValidAfterFix(profile, updates).valid).toBe(true)
  })

  test('detects unsafe numbers anywhere in the profile', () => {
    expect(
      hasUnsafeNumber({
        actions: [{ value: NumberValue.from('15607873807001836000') }]
      })
    ).toBe(true)
    expect(hasUnsafeNumber({ actions: [{ value: 1.5 }] })).toBe(false)
  })
})
