import express from 'express'

// 本文のないリクエストでも req.body を空のオブジェクトにする
// （aws-serverless-express のときと同じ挙動。各ルートは req.body がある前提で書かれている）
export const defaultBody = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.body === undefined) {
    req.body = {}
  }
  next()
}

// どのルートにも当たらないときは JSON で 404 を返す
// （Express の既定の 404 処理は @codegenie/serverless-express では 500 になるため）
export const notFound = (req: express.Request, res: express.Response) => {
  res.statusCode = 404
  res.json({ error: 'Not Found' })
}

// 想定外のエラーは JSON で返す
// （Express の既定のエラーページはスタックトレースを含むため）
export const errorHandler = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (res.headersSent) {
    return next(err)
  }
  const status = err.status || err.statusCode || 500
  if (status >= 500) {
    console.error(err)
  }
  res.statusCode = status
  res.json({ error: status < 500 ? err.message : 'Internal Server Error' })
}
