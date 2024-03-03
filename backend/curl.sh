curl 'http://127.0.0.1:5000/recipes/generate' \
  -H 'token: emil:1234' -X POST \
  -d '{
    "mealType": "Dinner",
    "nutrition": {
      "calories": 2000,
      "proteins": 50,
      "carbs": 250,
      "fats": 70,
      "sugars": 90,
      "fiber": 30
    }
  }' \
  -H 'Content-Type: application/json'
