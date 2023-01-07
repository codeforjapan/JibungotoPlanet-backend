export interface Config {
  stage: string

  aws: {
    accountId: string;
    region: string;
  };
}

export function getConfig (stage: string): Config {
  return require(`../config/${ stage }.json`)
}
