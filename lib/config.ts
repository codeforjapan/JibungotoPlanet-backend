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
}

export function getConfig(stage: string): Config {
  return require(`../config/${stage}.json`)
}
