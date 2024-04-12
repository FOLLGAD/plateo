import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const context = getRequestContext();
  const id = request.nextUrl.searchParams.get("meal_id");

  if (!id) {
    return new Response("No meal id", {
      status: 400,
    });
  }

  // @ts-expect-error
  const D1 = context.env.DB as D1Database;

  const meal = await D1.prepare(
    `
      SELECT * FROM foods WHERE food_id = ?
      `
  )
    .bind(id)
    .run();

  // @ts-expect-error
  const result = meal.results[0];
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
