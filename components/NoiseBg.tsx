"use client";
import { useEffect, useRef, useState } from "react";

const useAnimationFrame = (callback: () => void) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // loop
    const loop = () => {
      savedCallback.current?.();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => {};
  }, []);
};

export const NoiseBg = () => {
  const [seed, setSeed] = useState("0");

  useAnimationFrame(() => {
    setSeed(((Math.random() * 100000) | 0) + "");
  });

  return (
    <div className="w-full h-full bg-black">
      <div
        className="w-full h-full bg-white"
        style={{ filter: 'url("#noiseFilter") grayscale(1) brightness(2)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.25"
              numOctaves="3"
              stitchTiles="stitch"
              seed={seed}
              key={seed}
            />
          </filter>
        </svg>
      </div>
    </div>
  );
};
