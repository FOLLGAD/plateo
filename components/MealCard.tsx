import Link from "next/link";
import { apiURL } from "./utils";

export const MealCard = ({ meal }: { meal: any }) => {
  return (
    <div className="flex bg-white shadow-md rounded p-4 m-4 mt-0 w-full">
      <div className="rounded">
        <img
          src={apiURL + "/images/" + meal.images[0]}
          alt={meal.title}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>
      <div className="pl-4 flex-grow">
        <h2 className="text-xl font-bold">{meal.title}</h2>
        <p>
          Total Calories: <b>{meal.calories}</b>
        </p>
        <p>
          Date: <b>{new Date(meal.date).toLocaleDateString()}</b>
        </p>
        <Link
          href={`/meals/${meal.food_id}`}
          className="bg-snaptrack-main hover:bg-snaptrack-dark text-white font-bold py-2 px-4 rounded mt-2 inline-block"
        >
          View
        </Link>
      </div>
    </div>
  );
};
