import type { NextRequest } from "next/server";
import sqlite from "sqlite3";

const db = new sqlite.Database("./db.sqlite");

export async function GET(
  request: NextRequest,
  context: { params: { meal_id: string } }
) {
  const id = context.params.meal_id;

  if (!id) {
    return new Response("No meal id", {
      status: 400,
    });
  }

  const meal = await new Promise<any>((resolve, reject) =>
    db
      .prepare(
        `
        SELECT * FROM foods WHERE food_id = ?
        `
      )
      .bind(id)
      .get((err, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      })
  );

  const result = meal;
  return new Response(
    JSON.stringify({
      message: "Success",
      error: null,
      data: {
        ...result,
        allergens: JSON.parse(result.allergens),
        ingredients: JSON.parse(result.ingredients),
        images: JSON.parse(result.images),
      },
    })
  );
}
