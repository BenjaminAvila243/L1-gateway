import { readFileSync } from 'node:fs';

const DOMINIO = 'https://us-east-1rynzlw8os.auth.us-east-1.amazoncognito.com';
const CLIENT_ID = '1laqa3ba4419ialkks41kj3rle';
const REDIRECT_URI = 'http://localhost:4200/callback';

const code = process.argv[2];
const stateRecibido = process.argv[3];

if (!code) {
  console.error('Uso: node cognito-token.mjs <code> <state>');
  process.exit(1);
}

const { codeVerifier, state } = JSON.parse(readFileSync('.pkce-tmp.json', 'utf-8'));

if (stateRecibido && stateRecibido !== state) {
  console.error('El state no coincide. Revisa que copiaste bien la URL.');
  process.exit(1);
}

const body = new URLSearchParams({
  grant_type: 'authorization_code',
  client_id: CLIENT_ID,
  code,
  redirect_uri: REDIRECT_URI,
  code_verifier: codeVerifier,
});

const res = await fetch(`${DOMINIO}/oauth2/token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body,
});

const data = await res.json();

if (!res.ok) {
  console.error('Error de Cognito:', data);
  process.exit(1);
}

console.log('\nAccess token:\n');
console.log(data.access_token);

const [, payloadB64] = data.access_token.split('.');
const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
console.log('\nsub del usuario:', payload.sub);
console.log('grupos:', payload['cognito:groups']);