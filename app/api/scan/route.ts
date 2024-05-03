import type { NextRequest } from "next/server";
import { parse as parseYaml } from "yaml";
import shortUUID from "short-uuid";
import { analyze_prompt } from "./prompt";
import { processFile } from "./fileUpload";
import {
  type Content,
  type GenerateContentRequest,
  VertexAI,
} from "@google-cloud/vertexai";
import sqlite from "sqlite3";

const db = new sqlite.Database("./db.sqlite");

db.run(
  `
CREATE TABLE IF NOT EXISTS foods (
    food_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    title TEXT,
    date TIMESTAMP,
    proteins DECIMAL(5,2),
    ingredients TEXT,
    images TEXT,
    allergens TEXT,
    carbs DECIMAL(5,2),
    fats DECIMAL(5,2),
    salt DECIMAL(5,2),
    fiber DECIMAL(5,2),
    calories INT,
    sugars DECIMAL(5,2)
);
`
);

async function getGeminiResponse(messages: Content[], systemPrompt: string) {
  const vertex_ai = new VertexAI({
    project: "neostack-391613",
    location: "europe-west2",
  });
  const model = "gemini-1.5-pro-preview-0409";

  // Instantiate the models
  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 8192,
      topP: 0.95,
      temperature: 0.0,
    },
    systemInstruction: {
      role: "system",
      parts: [{ text: systemPrompt }],
    },
  });

  async function generateContent() {
    const req: GenerateContentRequest = {
      // contents: [{ role: "user", parts: [{ text: `hey!` }] }],
      contents: messages,
    };

    const resp = await generativeModel.generateContent(req);

    return resp.response.candidates[0].content.parts[0].text;
  }

  return generateContent();
}

export async function POST(request: NextRequest) {
  const fd = await request.formData();
  // const file = fd.get("file") as File;
  // const imageId = await processFile(file, file.name);

  const file = await fetch(
    "https://www.allrecipes.com/thmb/ecb0XKvcrE7OyxBLX3OVEd30TbE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/686460-todds-famous-blueberry-pancakes-Dianne-1x1-1-9bd040b975634bce884847ce2090de16.jpg"
  ).then((res) => res.blob());
  const imageId = await processFile(file, "blueberry.png");

  // file to base64
  const fileBuffer = await file.arrayBuffer();
  const fileBase64 = Buffer.from(fileBuffer).toString("base64");

  const response = await getGeminiResponse(
    [
      {
        role: "user",
        parts: [
          {
            text: analyze_prompt,
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: fileBase64,
            },
          },
        ],
      },
    ],
    `You are an expert food nutrition estimator. Estimate the conttents of this food. Only respond with a yaml`
  );
  // const response = await getOpenAIResponse(
  //   [
  //     {
  //       role: "user",
  //       content: [
  //         {
  //           type: "text",
  //           text: analyze_prompt,
  //         },
  //         {
  //           type: "image_url",
  //           image_url: {
  //             url: "data:image/png;base64," + fileBase64,
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   `You are an expert food nutrition estimator. Estimate the conttents of this food. Only respond with a yaml`
  // );

  const outData = response || "No response";

  try {
    let yaml_data = outData.split("```")[1];
    yaml_data = yaml_data.slice(yaml_data.indexOf("\n") + 1);

    const data = parseYaml(yaml_data);

    const food_id = shortUUID().new();

    db.prepare(
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

    const meal = await new Promise<any>((resolve, reject) =>
      db
        .prepare(
          `
        SELECT * FROM foods WHERE food_id = ?
        `
        )
        .bind(food_id)
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
