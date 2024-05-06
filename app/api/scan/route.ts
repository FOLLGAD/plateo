import { OpenAI } from "openai";
import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";
import { parse as parseYaml } from "yaml";
import shortUUID from "short-uuid";
import { analyze_prompt } from "./prompt";
import { processFile } from "./fileUpload";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const context = getRequestContext();
  const client = new OpenAI({
    apiKey: context.env["OPENAI_API_KEY"] || process.env["OPENAI_API_KEY"],
  });
  const fd = await request.formData();
  const file = fd.get("file") as File;
  const imageId = await processFile(file, file.name);

  // file to base64
  const fileBuffer = await file.arrayBuffer();
  const fileBase64 = Buffer.from(fileBuffer).toString("base64");

  const response = await client.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `You are an expert food nutrition estimator. Estimate the conttents of this food. Only respond with a yaml`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: analyze_prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: "data:image/png;base64," + fileBase64,
            },
          },
        ],
      },
    ],
    max_tokens: 400,
  });

  const outData =
    (response.choices[0].message.content as string) || "No response";

  try {
    let yaml_data = outData.split("```")[1];
    yaml_data = yaml_data.slice(yaml_data.indexOf("\n") + 1);

    const data = parseYaml(yaml_data);

    // @ts-expect-error
    const D1 = context.env.DB as D1Database;

    const food_id = shortUUID().new();

    await D1.prepare(
      `
    INSERT INTO foods (food_id, user_id, date, title, proteins, carbs, fats, salt, fiber, calories, sugars, ingredients, allergens, images)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    )
      .bind(
        food_id,
        "emil",
        new Date().toISOString(),
        data["title"],
        data["proteins"],
        data["carbs"],
        data["fats"],
        data["salt"],
        data["fiber"],
        data["calories"],
        data["sugars"],
        JSON.stringify(data["ingredients"]),
        JSON.stringify(data["allergens"]),
        JSON.stringify([imageId])
      )
      .run();

    const meal = await D1.prepare(
      `
        SELECT * FROM foods WHERE food_id = ?
        `
    )
      .bind(food_id)
      .run();

    // @ts-expect-error
    const result = meal.results[0];
    return new Response(
      JSON.stringify({
        message: "Food recognized",
        error: null,
        data: {
          ...result,
          allergens: JSON.parse(result.allergens ?? "[]"),
          ingredients: JSON.parse(result.ingredients ?? "[]"),
          images: JSON.parse(result.images ?? "[]"),
        },
      })
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
    });
  }
}
