/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { apiURL } from "@/components/utils";
import Chart from "react-apexcharts";
import { Meal } from "@/components/utils";
import { LoadSpinner } from "@/components/LoadSpinner";
import { Card } from "@/components/ui/card";

const toGrams = (weight?: string | number) => {
  if (!weight) return 0;
  if (typeof weight === "number") {
    return weight;
  }
  const splitterRegex = /([\d\.]+)\s?(\w+)?/;
  const match = weight.match(splitterRegex);
  if (match) {
    const number = parseFloat(match[1]);
    const unit = match[2] || "g";
    if (unit === "g") {
      return number;
    } else if (unit === "kg") {
      return number * 1000;
    } else if (unit === "mg") {
      return number * 0.001;
    } else {
      return number;
    }
  }
  return 0;
};

export default function Meal() {
  const { meal_id } = useParams();

  const [mealData, setMealData] = useState<null | Meal>(null);

  useEffect(() => {
    if (meal_id) {
      fetch(`${apiURL}/meals/${meal_id}`, {
        method: "GET",
        headers: {
          token: "emil:1234",
        },
      })
        .then((res) => res.json())
        .then((data) => setMealData(data))
        .catch((error) => console.error(error));
    }
  }, [meal_id]);

  if (!mealData) {
    return (
      <div>
        <Header />
        <LoadSpinner />
      </div>
    );
  }

  const data = [
    {
      name: "Proteins",
      data: toGrams(mealData.proteins),
      color: "#C254CC",
    },
    {
      name: "Carbs",
      data: toGrams(mealData.carbs),
      // green
      color: "#6DDA6B",
    },
    {
      name: "Fats",
      data: toGrams(mealData.fats),
      color: "#F5E080",
    },
    {
      name: "Salt",
      data: toGrams(mealData.salt),
      color: "#f5c5f0",
    },
    {
      name: "Fiber",
      data: toGrams(mealData.fiber),
      color: "#5E5EF0",
    },
    {
      name: "Sugars",
      data: toGrams(mealData.sugars),
      color: "#F05E5E",
    },
  ];

  return (
    <div>
      <Header backlinkUrl="/" />

      <div className="px-2">
        <h1 className="text-3xl font-bold px-4 text-snaptrack-text">
          {mealData.title}
        </h1>
        <h2 className="font-semibold text-snaptrack-text px-4 flex items-center justify-between">
          <div>
            {new Date(mealData.date).toLocaleTimeString()}{" "}
            {new Date(mealData.date).toLocaleDateString()}
          </div>
          <div>
            <p className="">{mealData.calories}kcal</p>
          </div>
        </h2>
      </div>

      <div className="flex flex-col w-full p-4 pb-2">
        <img
          src={apiURL + "/images/" + mealData.images[0]}
          alt={mealData.title}
          className="w-full h-96 object-cover rounded-[32px]"
        />
      </div>
      <div className="flex flex-col w-full p-4 pb-2 px-8 pb-6 text-sm">
        <Card className="rounded-xl">
          <div className="flex gap-8 text-center font-semibold w-full px-4">
            <div className="basis-[1px] flex-grow">
              <p>Carbs</p>
              <div className="w-full h-2 rounded-full bg-gray-200">
                <div
                  className="max-w-full h-full bg-[#F5E080] rounded-full"
                  style={{
                    width: (toGrams(mealData.carbs) / 300) * 100 + "%",
                  }}
                />
              </div>
              <p>{toGrams(mealData.carbs)}g</p>
            </div>
            <div className="basis-[1px] flex-grow">
              <p>Fats</p>
              <div className="w-full h-2 rounded-full bg-gray-200">
                <div
                  className="max-w-full h-full bg-[#CE4050] rounded-full"
                  style={{
                    width: (toGrams(mealData.fats) / 65) * 100 + "%",
                  }}
                />
              </div>
              <p>{toGrams(mealData.fats)}g</p>
            </div>
            <div className="basis-[1px] flex-grow">
              <p>Protein</p>
              <div className="w-full h-2 rounded-full bg-gray-200">
                <div
                  className="max-w-full h-full bg-[#3463ce] rounded-full"
                  style={{
                    width: (toGrams(mealData.proteins) / 50) * 100 + "%",
                  }}
                />
              </div>
              <p>{toGrams(mealData.proteins)}g</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="w-full p-4 px-8 pt-0">
        <div className="flex flex-wrap gap-2">
          {mealData.ingredients?.map((ingredient) => (
            <div
              key={ingredient.name}
              className="bg-blue-400 text-white p-2 px-3 rounded-full text-sm font-medium text-gray-500 max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap"
            >
              {ingredient.name}
            </div>
          ))}
          {mealData.allergens?.map((allergen) => (
            <div
              key={allergen}
              className="bg-red-200 p-2 px-3 rounded-full text-sm font-medium text-gray-500 max-w-32 overflow-hidden overflow-ellipsis whitespace-nowrap"
            >
              {allergen}
            </div>
          ))}
        </div>
      </div>
      <div className="pl-4 flex-grow">
        <p>
          Calories: <b>{mealData.calories}kcal</b>
        </p>
        <p>
          Fat: <b>{toGrams(mealData.fats)}g</b>
        </p>
        <p>
          Protein: <b>{toGrams(mealData.proteins)}g</b>
        </p>
        <p>
          Carbs: <b>{toGrams(mealData.carbs)}g</b>
        </p>
      </div>
      <div style={{ maxWidth: 512 }}>
        <Chart
          type="pie"
          options={{
            labels: data.map((d) => d.name),
            legend: {
              show: false,
            },
            fill: {
              colors: data.map((d) => d.color),
            },
            tooltip: {
              enabled: true,
            },
            dataLabels: {
              formatter(val, opts) {
                const name = opts.w.globals.labels[opts.seriesIndex];
                return [
                  name,
                  parseFloat(val as string).toFixed(1) + "%",
                ] as any as string;
              },
            },
            plotOptions: {
              pie: {
                expandOnClick: false,
              },
            },
          }}
          series={data.map((d) => d.data)}
        />
      </div>
    </div>
  );
}
