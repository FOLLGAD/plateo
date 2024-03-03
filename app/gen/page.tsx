"use client";
import { DailyNutrition } from "@/components/DailyNutrition";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Meal, apiURL } from "@/components/utils";

const useMeals = (date: string) => {
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

export default function Page() {
  const todayISO = new Date().toISOString().split("T")[0];
  const todaysMeals = useMeals(todayISO);

  const generateRecipe = () => {
    fetch(`${apiURL}/recipes/generate`, {
      method: "POST",
      headers: {
        token: "emil:1234",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <Header backlinkUrl="/" />
      <DailyNutrition meals={todaysMeals} />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Generate recipe
      </button>
    </div>
  );
}
