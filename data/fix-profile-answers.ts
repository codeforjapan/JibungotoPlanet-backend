// 保存済みのプロフィールを、validate.ts の条件に合うように直すスクリプト。
//
// - 回答の直し方は fix-profile.ts を参照
// - 計算結果に安全な整数の範囲を超える数値があるプロフィールも対象にする（GET で返せず 500 になるため）
// - 直したプロフィールは、その場で再計算して estimated を true にする
//   （false のままだと、本人が開き直すまで共有ページが 404 になるため）
//   再計算に失敗した場合は estimated を false にし、次に開いたときに再計算させる
// - 読んでから書くまでの間にユーザーが回答を保存した場合は、上書きせずに飛ばす（もう一度実行すれば直る）
//
// 使い方（既定は書き込まない確認だけ。--apply を付けたときだけ書き込む）:
//   AWS_PROFILE=footprint npx ts-node data/fix-profile-answers.ts --stage dev --report fix-report.jsonl
//   AWS_PROFILE=footprint npx ts-node data/fix-profile-answers.ts --stage dev --report fix-report.jsonl --apply
//
// report には1件ごとに追記する（途中で止まっても、それまでの分は残る）。
// - type: 'before' には、書き換える項目の元の値を型を残して書く（数値は { $number: "..." }、なかった項目は absent）
// - type: 'result' には、書き込みの結果（applied / conflict / error）を書く
import * as fs from 'fs'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb'
import {
  ANSWER_KEYS,
  fixProfile,
  hasUnsafeNumber,
  isValidAfterFix,
  toPlain,
  toRecord
} from './fix-profile'

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
if (fs.existsSync(reportPath)) {
  console.error(`report already exists: ${reportPath}`)
  process.exit(1)
}
const tableName = `${stage}JibungotoPlanetprofile`

// 再計算に使うテーブルは、profile-app を読み込む前に環境変数で渡す
process.env.FOOTPRINT_TABLE_NAME = `${stage}JibungotoPlanetfootprint`
process.env.PARAMETER_TABLE_NAME = `${stage}JibungotoPlanetparameter`
process.env.OPTION_TABLE_NAME = `${stage}JibungotoPlanetoption`
process.env.PROFILE_TABLE_NAME = tableName
const { updateProfile } = require('../lib/lambda/profile-app')

// DynamoDBDocumentClient.from は元のクライアントの設定を書き換えるので、クライアントは別々に作る
const newClient = () => new DynamoDBClient({ region: 'ap-northeast-1' })
// 安全な整数の範囲を超える数値もそのまま読めるように、数値は NumberValue で受け取る
const dynamodb = DynamoDBDocumentClient.from(newClient(), {
  unmarshallOptions: { wrapNumbers: true }
})
// 再計算用（footprint・parameter・option テーブルを読む）
const calcDynamodb = DynamoDBDocumentClient.from(newClient())

// 回答や属性が、読んだときから変わっていないことを書き込みの条件にする
const CHECKED_KEYS = [...ANSWER_KEYS, 'gender', 'age', 'region']

const writeReport = (line: any) =>
  fs.appendFileSync(reportPath, JSON.stringify(line) + '\n')

const recalculate = async (profile: any, updates: any) => {
  const target: any = {}
  for (const key of ANSWER_KEYS) {
    const value = key in updates ? updates[key] : toPlain(profile[key])
    if (value !== undefined) target[key] = value
  }
  await updateProfile(calcDynamodb, target)
  const result = {
    baselines: target.baselines,
    estimations: target.estimations,
    actions: target.actions
  }
  if (hasUnsafeNumber(result)) {
    throw new Error('unsafe number in estimation')
  }
  return result
}

const update = async (
  id: string,
  profile: any,
  sets: any,
  removes: string[]
) => {
  const names: any = {}
  const values: any = {}
  const setExprs: string[] = []
  const removeExprs: string[] = []
  const conditions = ['attribute_exists(id)']
  let i = 0
  const name = (key: string) => {
    const n = `#k${i++}`
    names[n] = key
    return n
  }
  for (const [key, value] of Object.entries(sets)) {
    const n = name(key)
    values[`:v${n.slice(2)}`] = value
    setExprs.push(`${n} = :v${n.slice(2)}`)
  }
  for (const key of removes) {
    removeExprs.push(name(key))
  }
  for (const key of CHECKED_KEYS) {
    const n = name(key)
    if (profile[key] === undefined) {
      conditions.push(`attribute_not_exists(${n})`)
    } else {
      values[`:c${n.slice(2)}`] = profile[key]
      conditions.push(`${n} = :c${n.slice(2)}`)
    }
  }
  await dynamodb.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression:
        'SET ' +
        setExprs.join(', ') +
        (removeExprs.length > 0 ? ' REMOVE ' + removeExprs.join(', ') : ''),
      ConditionExpression: conditions.join(' AND '),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values
    })
  )
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
      new ScanCommand({ TableName: tableName, ExclusiveStartKey: startKey })
    )
    for (const item of data.Items || []) {
      scanned++
      if (fixProfile(item).changes.length > 0 || hasUnsafeNumber(item)) {
        candidates.push(item.id)
      }
    }
    startKey = data.LastEvaluatedKey
  } while (startKey)
  console.log(`scanned: ${scanned}, to fix: ${candidates.length}`)

  // 2. 1件ずつ最新の内容を読み直して直す（スキャン中に回答が変わっていても、最新の内容を直す）
  const counts: { [result: string]: number } = {}
  const summary: { [field: string]: number } = {}
  const count = (result: string) => (counts[result] = (counts[result] || 0) + 1)
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
    const { updates, changes } = fixProfile(profile)
    if (changes.length === 0 && !hasUnsafeNumber(profile)) continue

    const { valid, errors } = isValidAfterFix(profile, updates)
    if (!valid) {
      count('invalid')
      console.error(`still invalid after fix: ${id}`, errors)
      writeReport({ type: 'result', id, result: 'invalid', errors })
      continue
    }

    let estimate: any
    try {
      estimate = {
        ...(await recalculate(profile, updates)),
        estimated: true,
        updatedAt: new Date().toISOString()
      }
    } catch (err) {
      count('recalculate_failed')
      console.error(`recalculate failed: ${id}`, err)
      estimate = { estimated: false }
    }

    const sets: any = { ...estimate }
    const removes: string[] = []
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) {
        removes.push(key)
      } else {
        sets[key] = value
      }
    }
    for (const change of changes) {
      summary[change.field] = (summary[change.field] || 0) + 1
    }
    const keys = [...Object.keys(sets), ...removes]
    writeReport({
      type: 'before',
      id,
      changes,
      before: Object.fromEntries(
        keys
          .filter((key) => profile[key] !== undefined)
          .map((key) => [key, toRecord(profile[key])])
      ),
      absent: keys.filter((key) => profile[key] === undefined)
    })

    if (!apply) {
      count('would_apply')
      continue
    }
    try {
      await update(id, profile, sets, removes)
      count('applied')
      writeReport({ type: 'result', id, result: 'applied' })
    } catch (err: any) {
      const result =
        err?.name === 'ConditionalCheckFailedException' ? 'conflict' : 'error'
      count(result)
      console.error(`${result}: ${id}`, err?.message)
      writeReport({ type: 'result', id, result, error: String(err?.message) })
    }
  }

  console.log('results:', counts)
  console.log('changes by field:')
  Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .forEach(([field, n]) => console.log(`  ${field}: ${n}`))
  console.log(`report: ${reportPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
