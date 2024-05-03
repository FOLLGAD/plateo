"use client";
import Header from "@/components/Header";
import { LoadSpinner } from "@/components/LoadSpinner";
import { apiURL, useMeals } from "@/components/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    //   router.push(`/recipes/${response.recipe_id}`);
    //   setLoading(false);
    // }

    setTimeout(() => {
      const recipe = [
        "n9ipxdls",
      ];
      router.push(
        `/recipes/${recipe[Math.floor(Math.random() * recipe.length)]}`
      );
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="w-full min-h-full flex-grow flex flex-col">
      <Header backlinkUrl="/" />
      <div className="w-full min-h-full flex-grow flex flex-col items-center justify-center">
        {!loading ? (
          <button
            className="bg-snaptrack-text hover:bg-snaptrack-dark text-white font-bold py-2 px-4 rounded text-xl mx-auto"
            onClick={generateRecipe}
          >
            Generate recipe
          </button>
        ) : (
          <div className="flex flex-col items-center justify-center font-semibold">
            <LoadSpinner />
            <div className="text-xl text-snaptrack-text">Generating recipe</div>
            <div className=" text-gray-400">Hold tight...</div>
          </div>
        )}
      </div>
    </div>
  );
}
