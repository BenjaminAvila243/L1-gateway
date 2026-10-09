import { readFileSync } from 'node:fs';
import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});


pool.on('error', (error) => console.error(`[prestamos] conexion ociosa perdida: ${error.message}`));

const COLUMNAS = `id, libro_id AS "libroId", usuario_sub AS "usuarioSub",
  desde::text AS desde, hasta::text AS hasta, estado = 'devuelto' AS devuelto`;

export async function prepararEsquema() {
  await pool.query(readFileSync(new URL('./esquema.sql', import.meta.url), 'utf8'));
}

export async function listar() {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM prestamos.prestamos ORDER BY id`);
  return rows;
}

export async function crear({ libroId, usuarioSub, desde, hasta }) {
  const { rows } = await pool.query(
    `INSERT INTO prestamos.prestamos (libro_id, usuario_sub, desde, hasta)
     VALUES ($1, $2, $3, $4) RETURNING ${COLUMNAS}`,
    [libroId, usuarioSub, desde, hasta],
  );
  return rows[0];
}

export async function devolver(id) {
  const { rows } = await pool.query(
    `UPDATE prestamos.prestamos
        SET estado = 'devuelto', devuelto_en = coalesce(devuelto_en, now())
      WHERE id = $1 RETURNING ${COLUMNAS}`,
    [id],
  );
  return rows[0] ?? null;
}