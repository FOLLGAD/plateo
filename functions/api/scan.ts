import {
  D1Database,
  PagesFunction,
  R2Bucket,
  Response,
} from "@cloudflare/workers-types";

const triple_quotes = "```";
const analyze_prompt = `
You are an expert food nutrition estimator. Estimate the conttents of this food.
If unsure or if it varies, please provide an educated guess/average. Don't include units or other text, except for in the ingredients. 

Respond with a yaml with the following schema:
${triple_quotes}
type: meal|drink|snack|other
title: xxx
ingredients:
  - name: xxx
    weight: xxxg
  - name: yyy
    weight: xxxg
allergens:
  - xxx
proteins: xxx
carbs: xxx
fats: xxx
salt: xxx
fiber: xxx
calories: xxx
sugars: xxx
${triple_quotes}

Short and brief analysis is preferred.
`.trim();

// @app.post("/upload")
// async def upload(file: UploadFile = File(...), token: str = Header(...)):
//     user_id = decode_token(token)

//     filename = file.filename or "img.png"
//     ext = filename.split(".")[-1]
//     random_filename = f"{get_random_filename()}.{ext}"

//     content = await file.read()
//     base64_content = base64.b64encode(content).decode()
//     b64 = f"data:image/png;base64,{base64_content}"

//     with open(f"static/{random_filename}", "wb") as f:
//         f.write(content)

//     response = openai_client.chat.completions.create(
//         model="gpt-4-turbo",
//         messages=[
//             {
//                 "role": "user",
//                 "content": [
//                     {
//                         "type": "text",
//                         "text": analyze_prompt,
//                     },
//                     {
//                         "type": "image_url",
//                         "image_url": {
//                             "url": b64,
//                             # "url": "https://www.inspiredtaste.net/wp-content/uploads/2016/08/Easy-Homemade-Hamburger-Recipe-1-1200.jpg"
//                         },
//                     },
//                 ],
//             }
//         ],
//         max_tokens=400,
//     )

//     outData = response.choices[0].message.content or "No response"

//     try:
//         yaml_data = outData.split("```")[1]
//         yaml_data = yaml_data[yaml_data.find("\n") + 1 :]

//         data = yaml.safe_load(yaml_data)
//     except:
//         error = "Food not recognized. Please try again."
//         return {"error": error}

//     print(data)
//     food_id = db.add_food(
//         user_id=user_id,
//         date=time.strftime("%Y-%m-%dT%H:%M:%S"),
//         ingredients=data["ingredients"],
//         images=[random_filename],
//         title=data["title"],
//         allergens=data["allergens"],
//         proteins=data["proteins"],
//         carbs=data["carbs"],
//         fats=data["fats"],
//         salt=data["salt"],
//         fiber=data["fiber"],
//         calories=data["calories"],
//         sugars=data["sugars"],
//     )

//     food_data = db.get_food(food_id)

//     return {
//         "message": f"File {filename} uploaded for user {user_id}",
//         "data": food_data,
//     }

interface Env {
  DB: D1Database;
}

interface Ingredient {
  name: string;
  weight: string;
}

interface Food {
  title: string;
  user_id: string;
  date: string;
  ingredients: Ingredient[];
  allergens: string[];
  proteins: number;
  carbs: number;
  fats: number;
  salt: number;
  fiber: number;
  calories: number;
  sugars: number;
  images: string[];
}

interface Recipe {
  title: string;
  instructions: string[];
  image: string;
}

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === "POST") {
    try {
      const formData = await context.request.formData();
      const file = formData.get("file") as File | undefined | string;
      if (file && file instanceof File) {
        const fileName = file.name;
        const fileStream = file.stream();

        // Store the file in the R2 bucket
        // @ts-ignore
        await context.env.BUCKET.put(fileName, fileStream, {
          httpMetadata: {
            contentType: file.type,
          },
        });

        return new Response("File uploaded successfully", { status: 200 });
      }
      return new Response("Invalid file", { status: 400 });
    } catch (err) {
      return new Response("Error processing request", { status: 500 });
    }
  }
  return new Response("Method not supported", { status: 405 });
};
