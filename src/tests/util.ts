import xlsx from 'xlsx'

export type Answer = {
  answer: string
  name: string
  value: string | boolean | number
}
export type Expectation = {
  domain: string
  item: string
  subdomain: string
  value: number
  unit: string
  type: string
  estimated: boolean
}

export class TestCase {
  constructor(testCase: string) {
    this.case = testCase
  }
  case: string
  answers: Answer[] = []
  expectations: Expectation[] = []

  toRequest(): any {
    const request = {} as any
    for (const answer of this.answers) {
      if (!request[answer.answer]) {
        request[answer.answer] = {}
      }
      request[answer.answer][answer.name] = answer.value
    }
    return request
  }
}

export const createTestCases = (workbook: xlsx.WorkBook) => {
  const answers = xlsx.utils.sheet_to_json(workbook.Sheets['answers']) as any[]

  const testCases: { [name: string]: TestCase } = {}
  const testCaseList: TestCase[] = []

  for (const answer of answers) {
    let testCase = testCases[answer.case]
    if (!testCase) {
      testCase = new TestCase(answer.case)
      testCases[answer.case] = testCase
      testCaseList.push(testCase)
    }
    testCase.answers.push({
      answer: answer.answer,
      name: answer.name,
      value:
        answer.valueType === 'boolean'
          ? Boolean(answer.value)
          : answer.valueType === 'number'
          ? Number(answer.value)
          : String(answer.value)
    })
  }

  Object.entries(testCases).forEach(([key, value]) => {
    const expectations = xlsx.utils.sheet_to_json(workbook.Sheets[key]) as any[]
    value.expectations = expectations.map((e) => ({
      domain: e.domain,
      item: e.item,
      subdomain: e.subdomain,
      value: e.value,
      unit: e.unit,
      type: e.type,
      estimated: e.estimated
    }))
  })

  return testCaseList
}
