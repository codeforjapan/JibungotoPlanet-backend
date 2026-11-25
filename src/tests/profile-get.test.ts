import request from 'supertest'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import app from '../../lib/lambda/profile-app'

// DynamoDB の代わりに、send を差し替えて使うテスト
const send = jest.spyOn(DynamoDBDocumentClient.prototype, 'send' as any)

afterEach(() => {
  send.mockReset()
})

describe('Test profile GET and PUT without the database', () => {
  test('returns 404 for unknown profiles', async () => {
    send.mockResolvedValue({} as never)
    const resGet = await request(app).get('/profiles/unknown')
    expect(resGet.statusCode).toBe(404)
    const resPut = await request(app)
      .put('/profiles/unknown')
      .send({ estimate: true })
    expect(resPut.statusCode).toBe(404)
  })

  test('returns stored answers when recalculation fails', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})
    const profile = {
      id: 'a',
      shareId: 's',
      estimated: false,
      housingAnswer: { residentCount: 2 }
    }
    send.mockImplementation((async (command: any) => {
      if (command.constructor.name === 'GetCommand') {
        return { Item: { ...profile } }
      }
      throw new Error('calculation failed')
    }) as any)

    const res = await request(app).get('/profiles/a')
    expect(res.statusCode).toBe(200)
    expect(res.body.housingAnswer).toEqual({ residentCount: 2 })
    expect(res.body.baselines).toEqual([])
    expect(res.body.estimations).toEqual([])
    expect(res.body.actions).toEqual([])
    expect(error).toHaveBeenCalledWith(
      'ESTIMATE_FAILED id=a',
      expect.any(Error)
    )
    error.mockRestore()
  })

  test('returns stored estimates when saving the recalculation fails', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})
    const baselines = [{ domain: 'housing', item: 'rent', value: 1 }]
    let saved = false
    send.mockImplementation((async (command: any) => {
      const name = command.constructor.name
      if (name === 'GetCommand' && command.input.Key.id === 'a') {
        return {
          // 回答がないので、再計算は DB を読まずに成功する
          Item: { id: 'a', estimated: false, baselines }
        }
      }
      if (name === 'PutCommand') {
        saved = true
        // prd で起きていたように、NaN などで保存に失敗する
        throw new Error('Number NaN is not allowed')
      }
      return { Items: [] }
    }) as any)

    const res = await request(app).get('/profiles/a')
    expect(saved).toBe(true)
    expect(res.statusCode).toBe(200)
    expect(res.body.baselines).toEqual(baselines)
    expect(res.body.estimations).toEqual([])
    expect(error).toHaveBeenCalledWith(
      'ESTIMATE_FAILED id=a',
      expect.any(Error)
    )
    error.mockRestore()
  })
})
