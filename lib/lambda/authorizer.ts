import {
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import * as util from 'util';
import * as jwks from 'jwks-rsa';

// eventからアクセストークンを取得
const checkToken = (event: APIGatewayAuthorizerEvent) => {
  if (event.type !== 'TOKEN') {
    throw new Error(`event.type parameter must have value TOKEN , but actual value is ${event.type}`);
  }
  const token = event.authorizationToken;
  if (!token) {
    throw new Error("event.authorizationToken parameter must be set, but got null");
  }
  return token
};

// アクセストークンの検証
async function verifyToken(token: string): Promise<string | jwt.JwtPayload> {
  const decodedToken = jwt.decode(token, { complete: true });
  if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
    throw new jwt.JsonWebTokenError('invalid token');
  }

  const client = new jwks.JwksClient({
    jwksUri: process.env.JWKS_URI as string,
  });

  try {
    const getSigningKey = util.promisify(client.getSigningKey);//
    const key = await getSigningKey(decodedToken.header.kid);
    const signingKey =
      (key as jwks.CertSigningKey).publicKey ||
      (key as jwks.RsaSigningKey).rsaPublicKey;
    const tokenInfo = jwt.verify(token, signingKey, {
      audience: process.env.AUDIENCE,
      issuer: process.env.TOKEN_ISSUER,
    });
    return tokenInfo;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error('token expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new Error('token is invalid');
    }
    throw err;
  }
}

//認可ポリシーの生成
function generatePolicy(
  principal: string,
  effect: 'Allow' | 'Deny',
  resource: string,
): APIGatewayAuthorizerResult {
  return {
    principalId: principal,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

export const handler = async (
  event: APIGatewayAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  console.log('event', JSON.stringify(event, undefined, 2));
  try {
    const token = checkToken(event);
    const res = await verifyToken(token);
    return generatePolicy(res.sub as string, 'Allow', event.methodArn);
  } catch (error) {
    console.log(error);
    throw error
  }
};
