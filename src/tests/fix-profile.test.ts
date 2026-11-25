import { NumberValue } from '@aws-sdk/lib-dynamodb'
import {
  buildUpdate,
  fixProfile,
  hasUnsafeNumber,
  isValidAfterFix,
  planWrite,
  remainsUnsafe,
  toRecord,
  writeErrorResult
} from '../../data/fix-profile'

// DynamoDB を使わないテスト
describe('Test fixing stored profiles', () => {
  test('clamps values up to 1.2 times the limit', () => {
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

  test('clamps values exactly 1.2 times the limit despite rounding', () => {
    const { updates } = fixProfile({
      housingAnswer: { keroseneMonthCount: 14.4 }
    })
    expect(updates.housingAnswer).toEqual({ keroseneMonthCount: 12 })
  })

  test('removes values over 1.2 times the limit', () => {
    const { updates } = fixProfile({
      housingAnswer: {
        residentCount: 2,
        electricityMonthlyConsumption: 12001,
        gasMonthlyConsumption: NumberValue.from('100000000000000000000')
      },
      mobilityAnswer: { privateCarAnnualMileage: 1000001 }
    })
    expect(updates.housingAnswer).toEqual({ residentCount: 2 })
    expect(updates.mobilityAnswer).toEqual({})
  })

  test('removes resident counts out of range instead of clamping', () => {
    for (const residentCount of [0, 2.5, 16, 1e20, '2', null]) {
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

  test('treats keys like constructor as legacy keys', () => {
    const { updates, changes } = fixProfile({
      housingAnswer: { constructor: 1, toString: 'x', valueOf: 1e20 }
    })
    expect(updates.housingAnswer).toEqual({ constructor: 1, toString: 'x' })
    expect(changes).toEqual([
      {
        field: 'housingAnswer.valueOf',
        before: '100000000000000000000',
        after: null
      }
    ])
  })

  test('keeps a key named __proto__ as an own property', () => {
    const { updates } = fixProfile({
      housingAnswer: JSON.parse('{"__proto__": 1, "gasMonthlyConsumption": -1}')
    })
    expect(Object.keys(updates.housingAnswer)).toEqual(['__proto__'])
    expect(updates.housingAnswer.__proto__).toBe(1)
  })

  test('records sets and binaries with their types', () => {
    expect(
      toRecord({
        s: new Set([NumberValue.from('1')]),
        b: new Uint8Array([1, 2])
      })
    ).toEqual({ s: { $set: [{ $number: '1' }] }, b: { $binary: 'AQI=' } })
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

  test('detects unsafe numbers left in attributes not rewritten', () => {
    const profile = {
      id: 'a',
      estimations: [{ value: 1e20 }],
      additional_info: { x: 1e20 }
    }
    expect(remainsUnsafe(profile, { estimations: [] }, [])).toBe(true)
    expect(
      remainsUnsafe(profile, { estimations: [] }, ['additional_info'])
    ).toBe(false)
  })

  test('builds a conditional update with SET and REMOVE', () => {
    const housingAnswer = { residentCount: 2 }
    const input = buildUpdate(
      'table',
      { id: 'a', housingAnswer, gender: 'male' },
      { housingAnswer: {}, estimated: true },
      ['age']
    )
    expect(input.TableName).toBe('table')
    expect(input.Key).toEqual({ id: 'a' })
    expect(input.UpdateExpression).toBe('SET #k0 = :v0, #k1 = :v1 REMOVE #k2')
    expect(input.ExpressionAttributeNames).toEqual({
      '#k0': 'housingAnswer',
      '#k1': 'estimated',
      '#k2': 'age',
      '#k3': 'housingAnswer',
      '#k4': 'mobilityAnswer',
      '#k5': 'foodAnswer',
      '#k6': 'otherAnswer',
      '#k7': 'gender',
      '#k8': 'age',
      '#k9': 'region'
    })
    expect(input.ConditionExpression).toBe(
      [
        'attribute_exists(id)',
        '#k3 = :c3',
        'attribute_not_exists(#k4)',
        'attribute_not_exists(#k5)',
        'attribute_not_exists(#k6)',
        '#k7 = :c7',
        'attribute_not_exists(#k8)',
        'attribute_not_exists(#k9)'
      ].join(' AND ')
    )
    expect(input.ExpressionAttributeValues).toEqual({
      ':v0': {},
      ':v1': true,
      ':c3': housingAnswer,
      ':c7': 'male'
    })
  })

  test('omits REMOVE when nothing is removed', () => {
    const input = buildUpdate('table', { id: 'a' }, { estimated: true }, [])
    expect(input.UpdateExpression).toBe('SET #k0 = :v0')
  })

  describe('planWrite', () => {
    const profile = {
      id: 'a',
      housingAnswer: { residentCount: 2, gasMonthlyConsumption: -1 },
      age: '20s',
      estimations: [{ value: 1 }]
    }
    const updates = { housingAnswer: { residentCount: 2 }, age: undefined }

    test('writes the recalculated estimate and the fixed answers', () => {
      const estimate = { estimations: [{ value: 2 }], estimated: true }
      expect(planWrite(profile, updates, estimate)).toEqual({
        result: 'write',
        sets: { ...estimate, housingAnswer: { residentCount: 2 } },
        removes: ['age']
      })
    })

    test('skips without writing when recalculation fails', () => {
      expect(planWrite(profile, updates, null)).toEqual({
        result: 'recalculate_failed'
      })
    })

    test('removes unsafe estimates when recalculation fails', () => {
      const broken = { ...profile, actions: [{ value: 1e20 }] }
      expect(planWrite(broken, updates, null)).toEqual({
        result: 'write',
        sets: { estimated: false, housingAnswer: { residentCount: 2 } },
        removes: ['baselines', 'estimations', 'actions', 'age']
      })
    })

    test('skips profiles with unsafe numbers it does not rewrite', () => {
      const broken = { ...profile, additional_info: { x: 1e20 } }
      expect(planWrite(broken, updates, { estimated: true })).toEqual({
        result: 'unfixable'
      })
    })
  })

  test('tells conflicts from other write errors', () => {
    expect(writeErrorResult({ name: 'ConditionalCheckFailedException' })).toBe(
      'conflict'
    )
    expect(
      writeErrorResult({ name: 'ProvisionedThroughputExceededException' })
    ).toBe('error')
  })
})
