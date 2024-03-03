"use client";
import FoodSnap from "@/components/FoodSnap";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function Snap() {
  const router = useRouter();

  const onResults = (results: any) => {
    console.log(results);
    router.push(`/meals/${results.food_id}`);
  };
  return (
    <div>
      <Header />
      <FoodSnap onResults={onResults} />
    </div>
  );
}
