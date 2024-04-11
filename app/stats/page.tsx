"use client";
import { DailyNutrition } from "@/components/DailyNutrition";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { useMeals } from "@/components/utils";

export default function Page() {
  const todayISO = new Date().toISOString().split("T")[0];
  const todaysMeals = useMeals(todayISO);

  return (
    <div>
      <Header />
      <div className="px-8">
        <Card>
          <div className="flex flex-col items-stretch justify-center w-full">
            <DailyNutrition meals={todaysMeals} />
          </div>
        </Card>
      </div>
    </div>
  );
}
