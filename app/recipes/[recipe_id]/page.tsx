"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { apiURL } from "@/components/utils";
import { useParams, useRouter } from "next/navigation";
import { LoadSpinner } from "@/components/LoadSpinner";

const useRecipe = (recipe_id: string): Recipe | null => {
  const [recipe, setRecipe] = useState(null);
  useEffect(() => {
    fetch(`${apiURL}/recipes/${recipe_id}`, {
      method: "GET",
      headers: {
        token: "emil:1234",
      },
    })
      .then((res) => res.json())
      .then((data) => setRecipe(data))
      .catch((error) => console.error(error));
  }, [recipe_id]);
  return recipe;
};

interface Recipe {
  title: string;
  instructions: string;
  image: string | null;
}

export default function RecipePage() {
  const router = useRouter();
  const { recipe_id } = useParams();
  const recipe = useRecipe(recipe_id as string);

  if (!recipe) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }

  return (
    <div>
      <Header backlinkUrl="/" />
      {recipe.image && (
        <div className="flex flex-col items-center justify-center w-full max-h-64 overflow-hidden">
          <img
            src={`${apiURL}/static/${recipe.image}`}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">{recipe.title}</h1>
        <p>{recipe.instructions}</p>
      </div>
      <div className="flex justify-center p-4">
        <button className="bg-snaptrack-main hover:bg-snaptrack-dark text-white font-bold py-2 px-4 rounded text-xl">
          Make it!
        </button>
      </div>
    </div>
  );
}
