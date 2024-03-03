"use client";
import { apiURL } from "@/components/utils";
import { useEffect, useState } from "react";
import { QuickAddButton } from "@/components/QuickAddButton";
import { useRouter } from "next/navigation";
import { Plate } from "@/components/Plate";
import { MealScroll } from "@/components/MealScroll";
import Image from "next/image";

const useLatestMeals = () => {
  const [meals, setMeals] = useState<null | any[]>(null);

  useEffect(() => {
    fetch(apiURL + "/meals/latest", {
      method: "GET",
      headers: {
        token: "emil:1234",
      },
    })
      .then((res) => res.json())
      .then((data) => setMeals(data))
      .catch((error) => console.error(error));
  }, []);

  return meals;
};

export default function Home() {
  const meals = useLatestMeals();
  const router = useRouter();

  const now = new Date();

  const currentMealOfDay: "Breakfast" | "Lunch" | "Dinner" =
    now.getHours() < 12
      ? "Breakfast"
      : now.getHours() < 18
      ? "Lunch"
      : "Dinner";

  const timeOfDay =
    now.getHours() < 12
      ? "morning"
      : now.getHours() < 18
      ? "afternoon"
      : "evening";

  return (
    <div>
      <div className="flex justify-center mt-4 items-center mb-4 flex-col">
        <div className="w-32">
          <Image src="/plateo.svg" width={128} height={128} alt="logo" />
        </div>
        <h1 className="text-3xl font-bold mt-2 text-snaptrack-text pl-2">
          Plateo
        </h1>
      </div>
      <h3 className="text-4xl block mx-12">
        <div className="text-gray-300 font-bold">Good {timeOfDay},</div>
        <div className="font-bold text-gray-600">Ossian</div>
      </h3>
      <div className="ml-16 mt-8 mb-8">
        <button
          className="bg-snaptrack-dark text-snaptrack-text p-2 rounded-2xl rounded-r-none text-left flex items-center"
          style={{ width: "100%" }}
          onClick={() => {
            router.push("/gen");
          }}
        >
          <div className="p-4">
            <Plate />
          </div>
          <div className="ml-4 flex-grow">
            <div className="uppercase font-bold text-xl">
              {currentMealOfDay}
            </div>
            <div className="text-white font-semibold">Generate recipe</div>
          </div>
          <div className="pr-8 font-bold text-xl">→</div>
        </button>
      </div>
      <div className="ml-32 mt-8 mb-8">
        <button
          className="bg-snaptrack-main text-snaptrack-text p-2 rounded-2xl rounded-r-none text-left flex items-center"
          style={{ width: "100%" }}
          onClick={() => {
            router.push("/gen");
          }}
        >
          <div className="p-2">
            <Image src="/progress.svg" width={54} height={54} alt="progress" />
          </div>
          <div className="ml-4 flex-grow">
            <div className="uppercase font-bold text-xl">Progress</div>
            <div className="text-white font-semibold">54%</div>
          </div>
        </button>
      </div>
      {!!meals && (
        <div>
          <h2 className="text-2xl font-bold ml-4">Your latest meals</h2>
          <MealScroll meals={meals} />
        </div>
      )}
      <QuickAddButton
        onClick={() => {
          router.push("/snap");
        }}
      />
    </div>
  );
}
