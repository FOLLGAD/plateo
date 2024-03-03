import { useRouter } from "next/navigation";
import { Meal, apiURL } from "./utils";
import Link from "next/link";

const getMealImg = (meal: Meal) => {
  return apiURL + "/static/" + meal.images[0];
};

export const MealScroll = ({ meals }: { meals: Meal[] }) => {
  const router = useRouter();

  return (
    <div className="flex overflow-x-auto">
      {meals.map((meal) => (
        <Link
          key={meal.food_id}
          href={`/meals/${meal.food_id}`}
          className="flex-shrink-0 w-64 h-64 bg-gray-200 m-2 relative rounded-2xl overflow-hidden"
        >
          <img
            src={getMealImg(meal)}
            alt={meal.title}
            className="w-64 h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 text-xl p-3">
            <div className="text-white font-semibold drop-shadow">{meal.title}</div>
            <div className="text-white drop-shadow">{meal.calories}kcal</div>
          </div>
        </Link>
      ))}
    </div>
  );
};
