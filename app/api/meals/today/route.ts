import type { NextRequest } from "next/server";
import sqlite from "sqlite3";

const db = new sqlite.Database("./db.sqlite");

export async function GET(request: NextRequest) {
  const meal = await new Promise<any>((resolve, reject) =>
    db
      .prepare(
        `
        SELECT * FROM foods ORDER BY date DESC LIMIT 10
        `
      )
      .all((err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
  );

  const results = meal;
  return new Response(
    JSON.stringify(
      results.map((result) => ({
        ...result,
        allergens: JSON.parse(result.allergens),
        ingredients: JSON.parse(result.ingredients),
        images: JSON.parse(result.images),
      }))
    )
  );
}
