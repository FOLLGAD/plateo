"use client";
import { apiURL } from "@/components/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DetailsBar } from "../components/DetailsBar";
import { BerryPancake } from "@/components/imgs";
import { Card } from "@/components/ui/card";
import {
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@radix-ui/react-icons";

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
  const dayOfWeek = new Date(now.getTime()).toLocaleDateString("en-US", {
    weekday: "long",
  });

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
          <Image src="/plateo.svg" width={128} height={128} alt="logo" />
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
        <Card className="flex items-center justify-center px-4 py-4 gap-4 w-full border-0 drop-shadow-lg shadow">
          <BerryPancake />
          <div className="flex-grow">
            <p className="text-snaptrack-text font-bold">Breakfast</p>
            <p className="text-black font-medium">Berry Pancakes</p>
          </div>
          <div className="text-right">
            <p className="text-black font-medium">1589 kcal</p>
          </div>
        </Card>
        <Card className="flex items-center justify-center px-4 py-4 gap-4 w-full border-0 drop-shadow-lg shadow">
          <BerryPancake />
          <div className="flex-grow">
            <p className="text-snaptrack-text font-bold">Lunch</p>
            <p className="text-black font-medium">Pesto Pasta</p>
          </div>
          <div className="text-right">
            <p className="text-black font-medium">720 kcal</p>
          </div>
        </Card>
      </div>

      <h2 className="text-xl font-bold uppercase ml-4 mt-8 mb-4">
        <span className="text-snaptrack-text">AI Suggested ⚡️</span>
      </h2>

      <div className="flex flex-col items-center justify-center gap-4 px-4">
        <Card
          className="flex items-center justify-center px-4 py-4 gap-4 w-full border-0 drop-shadow-lg shadow bg-snaptrack-light"
          onClick={() => router.push("/gen")}
        >
          <BerryPancake />
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
