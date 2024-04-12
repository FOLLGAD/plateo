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
