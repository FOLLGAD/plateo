/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { apiURL } from "@/components/utils";
import { useParams, useRouter } from "next/navigation";
import { LoadSpinner } from "@/components/LoadSpinner";
import Markdown from "react-markdown";

export const runtime = "edge";

const recipes = [
  {
    id: "n9ipxdls",
    title: "Bean stew",
    instructions: `# **Ingredients:**

1 pound dried beans (like black, pinto, or kidney)

1 large onion, chopped

2 cloves garlic, minced

2 tablespoons olive oil

6 cups water or broth

1 bay leaf

1 teaspoon ground cumin

1 teaspoon paprika

Salt and pepper to taste

# **Optional Additions:**

1 diced bell pepper

1 diced carrot

2 diced celery stalks

1 diced tomato

Fresh herbs like cilantro or parsley

# **Instructions:**
Preparation: Rinse the beans thoroughly under cold water to remove any dirt or debris. If time allows, soak them overnight in a large bowl with enough water to cover them by a few inches. This reduces cooking time and makes them more digestible.

Cooking the Aromatics: Heat the olive oil in a large pot over medium heat. Add the chopped onion, garlic, and any optional vegetables like bell pepper, carrot, or celery. Cook until the onions are translucent and the vegetables begin to soften.

Adding Beans and Spices: Drain the beans if they were soaked and add them to the pot along with the water or broth, bay leaf, cumin, and paprika. Bring the mixture to a boil, then reduce the heat to low and simmer. Cover the pot and let the beans cook until they are tender, which will take about 1 to 2 hours depending on whether they were soaked.

Final Touches: Once the beans are cooked, add salt and pepper to taste. If using, add diced tomatoes and cook for another 10 minutes. Remove the bay leaf.

Serving: Serve hot, garnished with fresh herbs like cilantro or parsley if desired. Beans can be a great side dish or a main course if served over rice or with cornbread.`,
    image:
      "https://imgcdn.stablediffusionweb.com/2024/4/25/34d81a1b-7fe5-40d6-b176-b31db873640a.jpg",
  },
];

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
  const { recipe_id } = useParams();
  // const recipe = useRecipe(recipe_id as string);
  const recipe = recipes[0];

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
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">{recipe.title}</h1>
        <Markdown className="">{recipe.instructions}</Markdown>
      </div>
    </div>
  );
}
