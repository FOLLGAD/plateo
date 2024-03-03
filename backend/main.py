from fastapi import Body, FastAPI, File, Header, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import base64
import requests
from tinydb import TinyDB, Query
import time, yaml

# users (user_id, username, weight, height, age)
# foods (food_id, user_id, date, time, ingredients, total_calories, images)


class FoodAppDB:
    def __init__(self):
        self.db = TinyDB("./db.json")
        self.users = self.db.table("users")
        self.foods = self.db.table("foods")
        self.recipe = self.db.table("recipe")

    def add_user(self, username, weight, height, age):
        user_id = get_random_filename()
        self.users.insert(
            {
                "username": username,
                "weight": weight,
                "height": height,
                "age": age,
                "user_id": user_id,
            }
        )
        return user_id

    def get_user(self, user_id):
        User = Query()
        user = self.users.get(User.user_id == user_id)
        return user

    def add_food(
        self,
        title,
        user_id,
        date,
        ingredients,
        allergens,
        proteins,
        carbs,
        fats,
        salt,
        fiber,
        calories,
        sugars,
        images: list = [],
    ):
        food_id = get_random_filename()

        self.foods.insert(
            {
                "food_id": food_id,
                "user_id": user_id,
                "title": title,
                "date": date,
                "ingredients": ingredients,
                "images": images,
                "allergens": allergens,
                "proteins": proteins,
                "carbs": carbs,
                "fats": fats,
                "salt": salt,
                "fiber": fiber,
                "calories": calories,
                "sugars": sugars,
            }
        )
        return food_id

    def get_foods(self, user_id, date):
        Food = Query()
        foods = self.foods.search((Food.user_id == user_id) & (Food.date == date))
        return foods

    def get_food(self, food_id):
        Food = Query()
        food = self.foods.get(Food.food_id == food_id)
        return food

    def add_recipe(self, title, instructions, image):
        recipe_id = get_random_filename()
        self.recipe.insert(
            {
                "recipe_id": recipe_id,
                "title": title,
                "instructions": instructions,
                "image": image,
            }
        )
        return recipe_id

    def get_recipe(self, recipe_id):
        Recipe = Query()
        recipe = self.recipe.get(Recipe.recipe_id == recipe_id)
        return recipe


db = FoodAppDB()


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


def get_random_filename():
    return (
        base64.urlsafe_b64encode(os.urandom(6))
        .decode()
        .replace("=", "")
        .replace("-", "_")
        .replace("/", "_")
    )


def decode_token(token: str) -> str:
    return token.split(":")[0]


from openai import OpenAI

openai_client = OpenAI()

analyze_prompt = """
You are an expert food nutrition estimator. Estimate the conttents of this food.
If unsure or if it varies, please provide an educated guess/average. Don't include units or other text, except for in the ingredients. 

Respond with a yaml with the following schema:
```
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
```

Short and brief analysis is preferred.
""".strip()


@app.post("/upload")
async def upload(file: UploadFile = File(...), token: str = Header(...)):
    user_id = decode_token(token)

    filename = file.filename or "img.png"
    ext = filename.split(".")[-1]
    random_filename = f"{get_random_filename()}.{ext}"

    content = await file.read()
    base64_content = base64.b64encode(content).decode()
    b64 = f"data:image/png;base64,{base64_content}"

    with open(f"static/{random_filename}", "wb") as f:
        f.write(content)

    response = openai_client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": analyze_prompt,
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": b64,
                            # "url": "https://www.inspiredtaste.net/wp-content/uploads/2016/08/Easy-Homemade-Hamburger-Recipe-1-1200.jpg"
                        },
                    },
                ],
            }
        ],
        max_tokens=400,
    )

    outData = response.choices[0].message.content or "No response"

    try:
        yaml_data = outData.split("```")[1]
        yaml_data = yaml_data[yaml_data.find("\n") + 1 :]

        data = yaml.safe_load(yaml_data)
    except:
        error = "Food not recognized. Please try again."
        return {"error": error}

    print(data)
    food_id = db.add_food(
        user_id=user_id,
        date=time.strftime("%Y-%m-%dT%H:%M:%S"),
        ingredients=data["ingredients"],
        images=[random_filename],
        title=data["title"],
        allergens=data["allergens"],
        proteins=data["proteins"],
        carbs=data["carbs"],
        fats=data["fats"],
        salt=data["salt"],
        fiber=data["fiber"],
        calories=data["calories"],
        sugars=data["sugars"],
    )

    food_data = db.get_food(food_id)

    return {
        "message": f"File {filename} uploaded for user {user_id}",
        "data": food_data,
    }


@app.get("/images/{image_id}")
async def img(image_id: str):
    return FileResponse("static/" + image_id)


@app.get("/meals/weekly")
async def get_weekly(token: str = Header(...)):
    user_id = decode_token(token)
    query = Query()
    # get all of the last week
    weekago = time.time() - 60 * 60 * 24 * 7
    meals = db.foods.search(query.date >= weekago)

    meals.sort(key=lambda x: x["date"], reverse=True)

    if len(meals) == 0:
        return {"error": "No meals found"}

    num = 3
    return meals[:num]


@app.get("/meals/latest")
async def get_latest_meals(token: str = Header(...)):
    user_id = decode_token(token)
    query = Query()
    meals = db.foods.search(query.user_id == user_id)
    meals.sort(key=lambda x: x["date"], reverse=True)

    if len(meals) == 0:
        return {"error": "No meals found"}

    num = -1
    return meals[:num]


@app.get("/meals/date/{date}")
async def get_meals_by_date(date: str, token: str = Header(...)):
    user_id = decode_token(token)
    day_after = time.strftime(
        "%Y-%m-%dT%H:%M:%S",
        time.localtime(time.mktime(time.strptime(date, "%Y-%m-%d")) + 60 * 60 * 24),
    )
    query = Query()
    meals = db.foods.search(
        (query.user_id == user_id) & (query.date > date) & (query.date < day_after)
    )

    return meals


import replicate


@app.post("/recipes/generate")
async def generate_recipe(data: dict = Body(...), token: str = Header(...)):
    user_id = decode_token(token)
    print("hiki")
    nutrition = data["nutrition"]
    meal_type = data["mealType"]
    recipe = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": f"""
Generate a {meal_type} recipe. The user today has already with the following nutrition: {nutrition}.
For example, if the user had too much protein, you can suggest a recipe with less protein.

IMPORTANT: Respond in a yaml with the following schema:
```
title: xxx
recipe_outline: "free text describing the recipe. max 100 words"
```
                        """.strip(),
            },
        ],
        max_tokens=400,
    )

    outData = recipe.choices[0].message.content or "No response"

    try:
        yaml_data = outData.split("```")[1]
        yaml_data = yaml_data[yaml_data.find("\n") + 1 :]

        data = yaml.safe_load(yaml_data)
    except Exception as e:
        print(e)
        error = "Food not recognized. Please try again."
        print(outData)
        return {"error": error}

    print(data)
    try:
        output = replicate.run(
            "dhanushreddy291/sdxl-turbo:53a8078c87ad900402a246bf5e724fa7538cf15c76b0a22753594af58850a0e3",
            input={
                "prompt": data.get("title"),
                "num_outputs": 1,
                "negative_prompt": "blurry, bad",
                "num_inference_steps": 2,
            },
        )
        ext_img_url = output[0]
        filename = f"{get_random_filename()}.png"
        img_path = f"static/{filename}"
        with open(img_path, "wb") as f:
            f.write(requests.get(ext_img_url).content)
    except Exception as e:
        print(e)
        recipe_id = db.add_recipe(data["title"], data["recipe_outline"], None)
        return {"message": f"Recipe generated. Recipe ID: {recipe_id}"}

    recipe_id = db.add_recipe(data["title"], data["recipe_outline"], filename)
    return {
        "message": f"Recipe generated. Recipe ID: {recipe_id}",
        "recipe_id": recipe_id,
    }


@app.get("/recipes/{recipe_id}")
async def get_recipe(recipe_id: str):
    recipe = db.get_recipe(recipe_id)

    return recipe


@app.get("/meals/{meal_id}")
async def get_meal(meal_id: str):
    meal = db.get_food(meal_id)

    return meal
