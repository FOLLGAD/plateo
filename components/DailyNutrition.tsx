import { LoadSpinner } from "./LoadSpinner";
import { Meal } from "./utils";

export const DailyNutrition = ({ meals }: { meals: Meal[] }) => {
  // A summary of the day's nutrition
  const totalCalories = meals.reduce(
    (acc, meal) => acc + Number(meal.calories),
    0
  );
  const totalProteins = meals.reduce(
    (acc, meal) => acc + Number(meal.proteins),
    0
  );
  const totalCarbs = meals.reduce((acc, meal) => acc + Number(meal.carbs), 0);
  const totalFats = meals.reduce((acc, meal) => acc + Number(meal.fats), 0);
  const totalSugars = meals.reduce((acc, meal) => acc + Number(meal.sugars), 0);
  const totalFiber = meals.reduce((acc, meal) => acc + Number(meal.fiber), 0);
  const totalSalt = meals.reduce((acc, meal) => acc + Number(meal.salt), 0);

  if (meals.length === 0) {
    return <LoadSpinner />;
  }
  return (
    <div className="p-4 pt-0">
      <h1 className="text-2xl font-bold">Today</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold">Calories</h2>
          <p>{totalCalories} kcal</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Proteins</h2>
          <p>{totalProteins} g</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Carbs</h2>
          <p>{totalCarbs} g</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Fats</h2>
          <p>{totalFats} g</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Sugars</h2>
          <p>{totalSugars} g</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Salt</h2>
          <p>{totalSalt} g</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Fiber</h2>
          <p>{totalFiber} g</p>
        </div>
      </div>
    </div>
  );
};
