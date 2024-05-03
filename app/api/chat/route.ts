import type { NextRequest } from "next/server";
import shortUUID from "short-uuid";
import sqlite from "sqlite3";
import { getGeminiResponse } from "../getGeminiResponse";
import { Content } from "@google-cloud/vertexai";

const db = new sqlite.Database("./db.sqlite");
db.run(
  `
  CREATE TABLE IF NOT EXISTS chats (
      chat_id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50),
      date TIMESTAMP,
      role TEXT,
      content TEXT
  );
  `
);
db.run(
  `
    CREATE TABLE IF NOT EXISTS symptoms (
        memory_id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        date TIMESTAMP,
        summary TEXT
    );
  `
);

export async function POST(request: NextRequest) {
  const data = await request.json();
  if (!data.question) {
    return new Response("No question provided", {
      status: 400,
    });
  }

  // 1. get all tracked symptoms from the database
  // 2. get all foods from the database
  // 3. merge the two lists, sorting by date, limiting to the last 20 items
  // 4. use that as the first message in the chat
  // 5. fetch the last 10 chat history from the database
  // 6. use as messages for the chat

  //   1:
  const symptoms = await new Promise<any>((resolve, reject) =>
    db
      .prepare(
        `
    SELECT * FROM symptoms
    `
      )
      .all((err, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
  );

  //   2:
  const foods = await new Promise<any>((resolve, reject) =>
    db
      .prepare(
        `
    SELECT * FROM foods
    `
      )
      .all((err, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
  );

  //   3:
  const merged = [
    ...symptoms.map((s) => `${s.date} Symptom reported: ${s.summary}`),
    ...foods.map((f) => `${f.date} Food consumed: ${f.title}`),
  ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const limited = merged.slice(0, 30);

  //   4:
  const firstMessage = limited.join("\n");

  //   5:
  const chatHistory = await new Promise<any>((resolve, reject) =>
    db
      .prepare(
        `
    SELECT * FROM chats
    ORDER BY date DESC, role ASC
    LIMIT 10
    `
      )
      .all((err, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
  );

  //   6:
  const messages = [
    {
      parts: [{ text: firstMessage }],
      role: "user",
    },
    {
      parts: [{ text: "Hey, what can I help you with?" }],
      role: "model",
    },
    ...chatHistory.reverse().map((c) => ({
      parts: [{ text: c.content }],
      role: c.role === "assistant" ? "model" : "user",
    })),
    {
      parts: [{ text: data.question }],
      role: "user",
    },
  ] as Content[];

  const response = await getGeminiResponse(
    messages,
    `
You are an expert dietician and nutritionist, and a helpful AI assistant. You are able to answer questions about food and nutrition. You can also provide information about diet and exercise. Your responses should be informative and helpful.
You have access to the user's food and nutritional data, which you can use to provide personalized recommendations. You can also use the user's symptoms to provide more accurate recommendations.

Do chat about the user's symptoms, and what they've been eating! And make recommendations!

You can also report symptoms to the system. Do this by appending a code fence like this:
\`\`\`symptom
headache, fatigue, bloating
\`\`\`
Symptom summaries should be short and concise. One sentence max.

Be brief.
    `.trim()
  );

  const extractedSymptoms = response.match(/```symptom\n(.*?)\n```/g);

  if (extractedSymptoms) {
    const symptoms = extractedSymptoms[0]
      .replace(/```symptom\n/g, "")
      .replace("```", "")
      .trim();

    db.run(
      `
    INSERT INTO symptoms (memory_id, user_id, date, summary)
    VALUES (?, ?, ?, ?)
    `,
      [shortUUID().new(), "emil", new Date().toISOString(), symptoms]
    );
  }

  const cleanedResponse = // convert symptom to "**Symptom tracked:** headache, fatigue, bloating"
    response.replace(/```symptom\n*(.*?)\n*```/g, "**Symptom tracked:** $1");

  db.run(
    `
    INSERT INTO chats (chat_id, user_id, date, role, content)
    VALUES (?, ?, ?, ?, ?)
    `,
    [shortUUID().new(), "emil", new Date().toISOString(), "user", data.question]
  );
  db.run(
    `
      INSERT INTO chats (chat_id, user_id, date, role, content)
      VALUES (?, ?, ?, ?, ?)
      `,
    [
      shortUUID().new(),
      "emil",
      new Date().toISOString(),
      "assistant",
      cleanedResponse,
    ]
  );

  return new Response(JSON.stringify({ message: cleanedResponse }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function GET(request: NextRequest) {
  // get all the last 20 chats from the database
  const chats = await new Promise<any>((resolve, reject) =>
    db
      .prepare(
        `
    SELECT chat_id, user_id, date, role, content FROM chats
    ORDER BY date DESC, role ASC
    LIMIT 20
    `
      )
      .all((err, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
  );

  return new Response(JSON.stringify({ chats: chats.reverse() }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
