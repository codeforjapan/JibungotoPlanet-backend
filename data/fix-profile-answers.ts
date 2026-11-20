// 保存済みのプロフィールの回答を、validate.ts の条件に合うように直すスクリプト。
//
// - 上限・下限を超える数値は、上限・下限に切り詰める
// - 選択肢にない値や型の違う値は、回答から消す（未回答として扱う）
// - 直したプロフィールは estimated を false にし、次に開いたときに再計算させる
//
// 使い方（既定は書き込まない確認だけ。--apply を付けたときだけ書き込む）:
//   AWS_PROFILE=footprint npx ts-node data/fix-profile-answers.ts --stage dev --report fix-report.json
//   AWS_PROFILE=footprint npx ts-node data/fix-profile-answers.ts --stage dev --report fix-report.json --apply
//
// report には、直したプロフィールの直す前と直した後の回答を書き出す（元に戻すときの控え）。
import * as fs from 'fs'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  NumberValue,
  ScanCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb'
import { validate } from '../lib/lambda/actions/validate'

const ANSWER_KEYS = [
  'housingAnswer',
  'mobilityAnswer',
  'foodAnswer',
  'otherAnswer'
]

const args = process.argv.slice(2)
const option = (name: string) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
const stage = option('--stage')
const reportPath = option('--report')
const apply = args.includes('--apply')
if (!stage || !['dev', 'prd'].includes(stage) || !reportPath) {
  console.error(
    'usage: fix-profile-answers.ts --stage <dev|prd> --report <file> [--apply]'
  )
  process.exit(1)
}
const tableName = `${stage}JibungotoPlanetprofile`

// 安全な整数の範囲を超える数値もそのまま読めるように、数値は NumberValue で受け取る
const dynamodb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: 'ap-northeast-1' }),
  { unmarshallOptions: { wrapNumbers: true } }
)

const schema: any = (validate as any).schema

type Change = { field: string; before: any; after: any }

const toNumber = (value: any) =>
  value instanceof NumberValue ? Number(value.value) : value

// 1つの回答（housingAnswer など）を直す。直した内容と、直した後の回答を返す
const fixAnswer = (answerKey: string, answer: any) => {
  const properties = schema.properties[answerKey].properties
  const fixed: any = {}
  const changes: Change[] = []
  for (const [key, raw] of Object.entries<any>(answer)) {
    const def = properties[key]
    const value = toNumber(raw)
    const field = `${answerKey}.${key}`
    if (!def) {
      // validate.ts が知らない項目は、そのまま残す
      fixed[key] = raw
      continue
    }
    if (def.type === 'number') {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        changes.push({ field, before: String(value), after: null })
      } else if (def.maximum !== undefined && value > def.maximum) {
        fixed[key] = def.maximum
        changes.push({ field, before: String(value), after: def.maximum })
      } else if (def.minimum !== undefined && value < def.minimum) {
        fixed[key] = def.minimum
        changes.push({ field, before: String(value), after: def.minimum })
      } else {
        fixed[key] = value
      }
    } else if (def.type === 'string') {
      if (
        typeof value !== 'string' ||
        (def.pattern && !new RegExp(def.pattern).test(value))
      ) {
        changes.push({ field, before: value, after: null })
      } else {
        fixed[key] = value
      }
    } else if (def.type === 'boolean') {
      if (typeof value !== 'boolean') {
        changes.push({ field, before: value, after: null })
      } else {
        fixed[key] = value
      }
    } else {
      fixed[key] = raw
    }
  }
  return { fixed, changes }
}

const fixProfile = (profile: any) => {
  const answers: any = {}
  const changes: Change[] = []
  for (const answerKey of ANSWER_KEYS) {
    const answer = profile[answerKey]
    if (!answer || typeof answer !== 'object') continue
    const result = fixAnswer(answerKey, answer)
    if (result.changes.length > 0) {
      answers[answerKey] = result.fixed
      changes.push(...result.changes)
    }
  }
  return { answers, changes }
}

const main = async () => {
  console.log(
    `table: ${tableName} / ${apply ? 'APPLY（書き込む）' : 'dry run（書き込まない）'}`
  )

  // 1. 直す必要のあるプロフィールを探す
  const candidates: string[] = []
  let scanned = 0
  let startKey: any
  do {
    const data = await dynamodb.send(
      new ScanCommand({
        TableName: tableName,
        ProjectionExpression:
          'id, housingAnswer, mobilityAnswer, foodAnswer, otherAnswer',
        ExclusiveStartKey: startKey
      })
    )
    for (const item of data.Items || []) {
      scanned++
      if (fixProfile(item).changes.length > 0) {
        candidates.push(item.id)
      }
    }
    startKey = data.LastEvaluatedKey
  } while (startKey)
  console.log(`scanned: ${scanned}, to fix: ${candidates.length}`)

  // 2. 1件ずつ最新の内容を読み直して直す（スキャン中に回答が変わっていても、最新の内容を直す）
  const report: any[] = []
  const summary: { [field: string]: number } = {}
  let invalidAfterFix = 0
  for (const id of candidates) {
    const data = await dynamodb.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
        ConsistentRead: true
      })
    )
    const profile = data.Item
    if (!profile) continue
    const { answers, changes } = fixProfile(profile)
    if (changes.length === 0) continue

    for (const change of changes) {
      summary[change.field] = (summary[change.field] || 0) + 1
    }
    // 直した後の回答全体が validate を通ることを確かめる
    const after: any = {}
    for (const answerKey of ANSWER_KEYS) {
      if (profile[answerKey]) {
        after[answerKey] = fixAnswer(answerKey, profile[answerKey]).fixed
      }
    }
    if (!validate(after)) {
      invalidAfterFix++
      console.error(`still invalid after fix: ${id}`, validate.errors)
      continue
    }
    report.push({
      id,
      estimated: String(profile.estimated),
      changes,
      before: Object.fromEntries(
        Object.keys(answers).map((key) => [
          key,
          JSON.parse(
            JSON.stringify(profile[key], (_, v) =>
              v instanceof NumberValue ? v.value : v
            )
          )
        ])
      ),
      after: answers
    })

    if (apply) {
      const names: any = { '#estimated': 'estimated' }
      const values: any = { ':estimated': false }
      const sets = ['#estimated = :estimated']
      Object.keys(answers).forEach((key, i) => {
        names[`#a${i}`] = key
        values[`:a${i}`] = answers[key]
        sets.push(`#a${i} = :a${i}`)
      })
      await dynamodb.send(
        new UpdateCommand({
          TableName: tableName,
          Key: { id },
          UpdateExpression: 'SET ' + sets.join(', '),
          ConditionExpression: 'attribute_exists(id)',
          ExpressionAttributeNames: names,
          ExpressionAttributeValues: values
        })
      )
    }
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(
    `${apply ? 'fixed' : 'would fix'}: ${report.length} profiles (still invalid: ${invalidAfterFix})`
  )
  console.log('changes by field:')
  Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .forEach(([field, count]) => console.log(`  ${field}: ${count}`))
  console.log(`report: ${reportPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
