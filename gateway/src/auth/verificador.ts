import { createRemoteJWKSet, jwtVerify } from 'jose';

const ISSUER    = process.env.COGNITO_ISSUER!;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID!;

const jwks = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`));

export type Claims = {
  sub: string;
  scope: string;
  client_id: string;
  token_use: string;
  'cognito:groups'?: string[];
};

export async function verificar(cabecera?: string): Promise<Claims> {
  if (!cabecera?.startsWith('Bearer ')) {
    throw new Error('sin token');
  }

  const { payload } = await jwtVerify(cabecera.slice(7), jwks, { issuer: ISSUER });

  if (payload.token_use !== 'access') {
    throw new Error('no es un access token');
  }

  if (payload.client_id !== CLIENT_ID) {
    throw new Error('app client desconocido');
  }

  return payload as unknown as Claims;
}

export function tieneScope(claims: Claims, requerido: string): boolean {
  return (claims.scope ?? '').split(' ').includes(requerido);
}

export function estaEnGrupo(claims: Claims, grupo: string): boolean {
  return (claims['cognito:groups'] ?? []).includes(grupo);
}