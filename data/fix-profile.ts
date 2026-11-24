// 保存済みのプロフィールを、validate.ts の条件に合うように直す処理（fix-profile-answers.ts から使う）
//
// - 上限を少し（10倍まで）超えた数値は、上限に寄せる
// - それより大きい数値や下限より小さい数値、選択肢にない値、型の違う値は、入力ミスや古い形式とみなして消す（未回答に戻す）
// - 住居人数は、寄せると推定値が変わってしまうので、範囲外なら消す
import Ajv from 'ajv'
import { NumberValue } from '@aws-sdk/lib-dynamodb'
import { validate } from '../lib/lambda/actions/validate'

export const ANSWER_KEYS = [
  'housingAnswer',
  'mobilityAnswer',
  'foodAnswer',
  'otherAnswer'
]
const TOP_LEVEL_KEYS = ['gender', 'age', 'region']

// 上限の何倍までを「少し超えた」とみなして上限に寄せるか
const CLAMP_LIMIT_RATE = 10
// 上限に寄せずに消す項目
const NO_CLAMP_KEYS = ['residentCount']

const schema: any = (validate as any).schema
const ajv = new Ajv({ allowUnionTypes: true })
const validators = new Map<any, any>()
const validatorOf = (def: any) => {
  if (!validators.has(def)) {
    validators.set(def, ajv.compile(def))
  }
  return validators.get(def)
}

export type Change = { field: string; before: any; after: any }

// NumberValue（wrapNumbers で読んだ数値）を number に変える
export const toPlain = (value: any): any => {
  if (value instanceof NumberValue) return Number(value.value)
  if (Array.isArray(value)) return value.map(toPlain)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, toPlain(v)])
    )
  }
  return value
}

// 型を残したまま JSON にする（数値は桁が丸まらないように { $number: "..." } で書く）
export const toRecord = (value: any): any => {
  if (value instanceof NumberValue) return { $number: value.value }
  if (Array.isArray(value)) return value.map(toRecord)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, toRecord(v)])
    )
  }
  return value
}

const show = (value: any) =>
  value instanceof NumberValue ? value.value : JSON.stringify(value)

// 安全な整数の範囲を超える数値や、有限でない数値を含むか
export const hasUnsafeNumber = (value: any): boolean => {
  if (value instanceof NumberValue || typeof value === 'number') {
    const n = Number(value instanceof NumberValue ? value.value : value)
    return !Number.isFinite(n) || Math.abs(n) > Number.MAX_SAFE_INTEGER
  }
  if (Array.isArray(value)) return value.some(hasUnsafeNumber)
  if (value && typeof value === 'object') {
    return Object.values(value).some(hasUnsafeNumber)
  }
  return false
}

// 1つの値を直す。残すなら { keep: true, value }、消すなら { keep: false }
const fixValue = (key: string, def: any, raw: any) => {
  const value = toPlain(raw)
  if (validatorOf(def)(value)) {
    return { keep: true, value }
  }
  if (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    def.maximum !== undefined &&
    value > def.maximum &&
    value <= def.maximum * CLAMP_LIMIT_RATE &&
    !NO_CLAMP_KEYS.includes(key)
  ) {
    return { keep: true, value: def.maximum }
  }
  return { keep: false }
}

// 1つの回答（housingAnswer など）を直す。直した内容と、直した後の回答を返す
export const fixAnswer = (answerKey: string, answer: any) => {
  const { properties, additionalProperties } = schema.properties[answerKey]
  const fixed: any = {}
  const changes: Change[] = []
  for (const [key, raw] of Object.entries<any>(answer)) {
    const def = properties[key] || additionalProperties
    const field = `${answerKey}.${key}`
    const result = fixValue(key, def, raw)
    if (!result.keep) {
      changes.push({ field, before: show(raw), after: null })
      continue
    }
    fixed[key] = result.value
    if (result.value !== toPlain(raw)) {
      changes.push({ field, before: show(raw), after: result.value })
    }
  }
  return { fixed, changes }
}

// プロフィールを直す。updates には直す項目の新しい値を入れる（undefined は項目を消す）
export const fixProfile = (profile: any) => {
  const updates: { [key: string]: any } = {}
  const changes: Change[] = []
  for (const answerKey of ANSWER_KEYS) {
    const answer = profile[answerKey]
    if (answer === undefined) continue
    if (!answer || typeof answer !== 'object' || Array.isArray(answer)) {
      updates[answerKey] = undefined
      changes.push({ field: answerKey, before: show(answer), after: null })
      continue
    }
    const result = fixAnswer(answerKey, answer)
    if (result.changes.length > 0) {
      updates[answerKey] = result.fixed
      changes.push(...result.changes)
    }
  }
  for (const key of TOP_LEVEL_KEYS) {
    const value = profile[key]
    if (value === undefined) continue
    if (!fixValue(key, schema.properties[key], value).keep) {
      updates[key] = undefined
      changes.push({ field: key, before: show(value), after: null })
    }
  }
  return { updates, changes }
}

// 直した後のプロフィールが、フロントが PUT で送る形で validate を通るか
export const isValidAfterFix = (profile: any, updates: any) => {
  const body: any = {}
  for (const key of [
    ...ANSWER_KEYS,
    ...TOP_LEVEL_KEYS,
    'actionIntensityRates'
  ]) {
    const value = key in updates ? updates[key] : toPlain(profile[key])
    if (value !== undefined) body[key] = value
  }
  return { valid: validate(body), errors: validate.errors }
}
