import ExcelJS from 'exceljs'

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

const sheetToJson = (worksheet: ExcelJS.Worksheet): any[] => {
  const rows: any[] = []
  const headers: string[] = []

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.eachCell((cell) => {
        headers.push(cell.value as string)
      })
    } else {
      const rowData: any = {}
      row.eachCell((cell, colNumber) => {
        rowData[headers[colNumber - 1]] = cell.value
      })
      rows.push(rowData)
    }
  })

  return rows
}

export const createTestCases = (workbook: ExcelJS.Workbook) => {
  const answersSheet = workbook.getWorksheet('answers')
  if (!answersSheet) throw new Error('answers sheet not found')

  const answers = sheetToJson(answersSheet)

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
    const sheet = workbook.getWorksheet(key)
    if (!sheet) return

    const expectations = sheetToJson(sheet)
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
