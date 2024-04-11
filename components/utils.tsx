import { useEffect, useState } from "react";
const env = process.env.NODE_ENV;
export const apiURL =
  env == "development" ? "http://127.0.0.1:8000" : "https://plateo.ngrok.app";

export const useToggle = (initialState: boolean) => {
  const [state, setState] = useState(initialState);
  const toggle = () => setState((state) => !state);
  return [state, toggle] as const;
};
export interface Meal {
  food_id: string;
  title: string;
  images: string[];
  date: string;
  ingredients: { name: string; weight: string }[];
  allergens: string[];
  proteins: number;
  carbs: number;
  fats: number;
  salt: number;
  fiber: number;
  calories: number;
  sugars: number;
}
export const useMeals = (date: string) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  useEffect(() => {
    fetch(`${apiURL}/meals/date/${date}`, {
      method: "GET",
      headers: {
        token: "emil:1234",
      },
    })
      .then((res) => res.json())
      .then((data) => setMeals(data))
      .catch((error) => console.error(error));
  }, [date]);
  return meals;
};
