"use client";
import { apiURL } from "@/components/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DetailsBar } from "../components/DetailsBar";
import { Card } from "@/components/ui/card";
import {
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const dateTimeToMealOfDay = (
  date: string
): "breakfast" | "lunch" | "dinner" => {
  const now = new Date(date);
  if (now.getHours() < 6) return "dinner";
  const mealOfDay =
    now.getHours() < 11
      ? "breakfast"
      : now.getHours() < 18
      ? "lunch"
      : "dinner";
  return mealOfDay;
};

const useLatestMeals = () => {
  const [meals, setMeals] = useState<null | any[]>(null);

  useEffect(() => {
    fetch(apiURL + "/meals/today", {
      method: "GET",
      headers: {
        token: "emil:1234",
      },
    })
      .then((res) => res.json() as Promise<any[]>)
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
  const dayOfWeek = new Date(now.getTime()).toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todaysMeals = [
    {
      title: "Berry Pancakes",
      date: "2024-05-02T09:00:00.000Z",
      calories: 1589,
      image:
        "https://www.allrecipes.com/thmb/ecb0XKvcrE7OyxBLX3OVEd30TbE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/686460-todds-famous-blueberry-pancakes-Dianne-1x1-1-9bd040b975634bce884847ce2090de16.jpg",
    },
    {
      title: "Pesto Pasta",
      date: "2024-05-02T12:00:00.000Z",
      calories: 720,
      image:
        "https://itsavegworldafterall.com/wp-content/uploads/2022/03/Vegetarian-Pesto-Pasta-4.jpg",
    },
    ...(meals ?? []),
  ];

  return (
    <div>
      <div className="absolute flex justify-center items-center w-full overflow-x-hidden top-0">
        <div className="relative h-[150vw]">
          <div
            className={
              "absolute w-[150vw] h-[100vw] transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-snaptrack-dark -z-10 drop-shadow-lg"
            }
            style={{
              background:
                "radial-gradient(circle at 20% 100%, #ACE4AA 0%, rgb(138, 199, 138) 100%)",
            }}
          ></div>
        </div>
      </div>
      <div className="flex justify-center mt-4 items-center flex-col z-10">
        <div className="w-32 pt-4">
          <Image src="/plateo.png" width={128} height={128} alt="logo" />
        </div>
        <h1 className="text-3xl font-bold mt-2 text-snaptrack-text pl-2">
          Plateo
        </h1>
      </div>
      <div className="w-full p-4">
        <DetailsBar />
      </div>
      <div className="flex justify-center items-center pt-4 pb-4 font-semibold gap-8">
        <CaretLeftIcon className="w-6 h-6 text-gray-500" />
        {/* Day, DD MMMM */}
        {dayOfWeek}, {now.getDate()}{" "}
        {now.toLocaleDateString("en-US", {
          month: "long",
        })}
        <CaretRightIcon className="w-6 h-6 text-gray-500" />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 px-4">
        {todaysMeals.length ? (
          todaysMeals.map((meal, index) => (
            <Link
              href={`/meals/${meal.food_id}`}
              key={index}
              className="w-full"
            >
              <Card
                key={index}
                className="flex items-center justify-center px-4 py-4 gap-4 w-full border-0 drop-shadow-lg shadow"
              >
                <div className="w-16 h-16 rounded-full flex-shrink-0 shadow">
                  <img
                    src={
                      meal.image
                        ? meal.image
                        : `${apiURL}/images/${meal.images[0]}`
                    }
                    alt={meal.title}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-snaptrack-text font-bold">{meal.title}</p>
                  <p className="text-gray-500 font-medium uppercase text-sm">
                    {dateTimeToMealOfDay(meal.date)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-black font-medium">{meal.calories} kcal</p>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          // "nothing scanned today" text
          <p className="text-snaptrack-text text-center font-bold">
            Nothing scanned today
          </p>
        )}
      </div>

      <h2 className="text-xl font-bold uppercase ml-4 mt-8 mb-4">
        <span className="text-snaptrack-text">AI Suggested ⚡️</span>
      </h2>

      <div className="flex flex-col items-center justify-center gap-4 px-4">
        <Card
          className="flex items-center justify-center px-4 py-4 gap-4 w-full border-0 drop-shadow-lg shadow bg-snaptrack-light"
          onClick={() => router.push("/gen")}
        >
          <img
            src="https://ketovegetarianrecipes.com/wp-content/uploads/2023/01/mushroom-salad-insta.jpg"
            alt="Mushroom Salad"
            className="w-16 h-16 rounded-full shadow"
          />
          <div className="flex-grow">
            <p className="text-snaptrack-text font-bold">
              Dinner{" "}
              <span className="ml-4 text-gray-700 font-normal">872 kcal</span>
            </p>
            <p className="text-black font-medium">Mushroom Salad</p>
          </div>
          <div className="text-right">
            <ArrowRightIcon className="w-6 h-6 text-snaptrack-text" />
          </div>
        </Card>
      </div>
    </div>
  );
}
