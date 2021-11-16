import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

dotenv.config();

const client = jwksRsa({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header: any, callback: (error: any, signingKey: string) => void) {
  client.getSigningKey(header.kid, function(error, key: any) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

async function isTokenValid(token: String): Promise<{ error: jwt.VerifyErrors | string | null, decoded: jwt.JwtPayload | null }> {
  if (token) {
    const bearerToken = token.split(" ");

    const result = new Promise<{ error: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | null }>((resolve, reject) => {
      jwt.verify(bearerToken[1], getKey, {
        audience: process.env.API_IDENTIFIER,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ["RS256"]
      }, (error, decoded) => {
        if (error) {
          resolve({ error, decoded: null });
        }
        if (decoded) {
          resolve({ error: null, decoded });
        }
      })
    });

    return result;
  }

  return { error: "No token provided", decoded: null };
}

export default isTokenValid;
