import { randomBytes, createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

// --- Datos de tu ficha.txt ---
const DOMINIO = 'https://us-east-1rynzlw8os.auth.us-east-1.amazoncognito.com';
const CLIENT_ID = '1laqa3ba4419ialkks41kj3rle';
const REDIRECT_URI = 'http://localhost:4200/callback';
const SCOPE = 'openid biblioteca/libros.leer';

// 1. code_verifier: un secreto aleatorio que generas TÚ y nunca viaja todavía
const codeVerifier = randomBytes(32).toString('base64url');

// 2. code_challenge: el hash SHA-256 del verifier. Esto sí viaja en la URL.
//    Cognito lo guarda, y al final va a pedir el verifier original para comparar.
const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');

// 3. state: para confirmar que la respuesta que vuelve es la que tú pediste
const state = randomBytes(16).toString('base64url');

// Guardamos verifier y state para usarlos en el canje, sin copiarlos a mano
writeFileSync('.pkce-tmp.json', JSON.stringify({ codeVerifier, state }, null, 2));

const url = new URL(`${DOMINIO}/oauth2/authorize`);
url.searchParams.set('client_id', CLIENT_ID);
url.searchParams.set('response_type', 'code');
url.searchParams.set('scope', SCOPE);
url.searchParams.set('redirect_uri', REDIRECT_URI);
url.searchParams.set('code_challenge', codeChallenge);
url.searchParams.set('code_challenge_method', 'S256');
url.searchParams.set('state', state);

console.log('\nAbre esta URL en el navegador para loguearte:\n');
console.log(url.toString());
console.log('\n(code_verifier y state quedaron guardados en .pkce-tmp.json)\n');