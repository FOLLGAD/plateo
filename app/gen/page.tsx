"use client";
import { DailyNutrition } from "@/components/DailyNutrition";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Meal, apiURL } from "@/components/utils";
import { useRouter } from "next/navigation";
import { LoadSpinner } from "@/components/LoadSpinner";

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
  const router = useRouter();
  const todayISO = new Date().toISOString().split("T")[0];
  const todaysMeals = useMeals(todayISO);
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    setLoading(true);
    const calories = todaysMeals.reduce(
      (acc, meal) => acc + Number(meal.calories),
      0
    );
    const proteins = todaysMeals.reduce(
      (acc, meal) => acc + Number(meal.proteins),
      0
    );
    const carbs = todaysMeals.reduce(
      (acc, meal) => acc + Number(meal.carbs),
      0
    );
    const fats = todaysMeals.reduce((acc, meal) => acc + Number(meal.fats), 0);
    const sugars = todaysMeals.reduce(
      (acc, meal) => acc + Number(meal.sugars),
      0
    );
    const fiber = todaysMeals.reduce(
      (acc, meal) => acc + Number(meal.fiber),
      0
    );

    const mealOfDay: "Breakfast" | "Lunch" | "Dinner" =
      new Date().getHours() < 12
        ? "Breakfast"
        : new Date().getHours() < 18
        ? "Lunch"
        : "Dinner";

    // const response = await fetch(`${apiURL}/recipes/generate`, {
    //   method: "POST",
    //   headers: {
    //     token: "emil:1234",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     mealType: mealOfDay,
    //     nutrition: {
    //       calories,
    //       proteins,
    //       carbs,
    //       fats,
    //       sugars,
    //       fiber,
    //     },
    //   }),
    // }).then((res) => res.json());

    // if (response.recipe_id) {
    // sleep 5 secs

    setTimeout(() => {
      const recipe = [
        "n9ipxdls",
        "D_ZwsIXn",
        "GOYtD0XJ",
        "p7dlvuO4",
        "xJDSSr9R",
      ];
      router.push(
        `/recipes/${recipe[Math.floor(Math.random() * recipe.length)]}`
      );
      setLoading(false);
    }, 5000);
    // }
  };

  return (
    <div>
      <Header backlinkUrl="/" />
      <DailyNutrition meals={todaysMeals} />
      {!loading ? (
        <button
          className="bg-snaptrack-main hover:bg-snaptrack-dark text-white font-bold py-2 px-4 rounded text-xl mx-auto"
          onClick={generateRecipe}
        >
          Generate recipe
        </button>
      ) : (
        <LoadSpinner />
      )}
    </div>
  );
}
