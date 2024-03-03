import { useState } from "react";

export const apiURL = "http://127.0.0.1:5000";

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
