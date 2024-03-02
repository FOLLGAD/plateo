"use client";
import { useState } from "react";
import FoodSnap from "./FoodSnap";

type Step = "camera" | "main";

const MainScreen = ({ setStep }: { setStep: (s: Step) => void }) => {
  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setStep("camera")}
      >
        Take a picture
      </button>
    </div>
  );
};

export default function Home() {
  const [step, setStep] = useState<Step>("main");

  const stage = {
    camera: (
      <div>
        <FoodSnap />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setStep("main")}
        >
          Go to main screen
        </button>
      </div>
    ),
    main: <MainScreen setStep={setStep} />,
  }[step];

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-5xl font-bold mb-4">SnapTrack</h1>
      {stage}
    </main>
  );
}
