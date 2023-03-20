export interface Config {
  stage: string

  aws: {
    accountId: string
    region: string
  }

  domain: string
  certificateArn: string

  auth: {
    audience: string
    jwksUri: string
    tokenIssuer: string
  }

  web3: {
    jsonRpcProvider: string
    actionHistoryAddr: string
    privateKey: string
  }
}

export function getConfig(stage: string): Config {
  return require(`../config/${stage}.json`)
}
