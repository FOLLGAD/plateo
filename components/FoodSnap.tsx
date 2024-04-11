"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiURL } from "./utils";
import { ScanCrosshair } from "./ScanCrosshair";
import { cn } from "@/lib/utils";

export default function FoodSnap({
  onResults,
}: {
  onResults: (results: any) => void;
}) {
  const [camera, setCamera] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [data, setData] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "environment" },
      })
      .then((mediaStream) => {
        setCamera(mediaStream);
      })
      .catch((err) => {
        setError(err.message);
      });

    return () => {
      camera?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  const capturePhoto = () => {
    setError(null);
    if (videoRef.current && canvasRef.current) {
      const w = videoRef.current.videoWidth,
        h = videoRef.current.videoHeight;
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      const context = canvasRef.current.getContext("2d");
      context?.drawImage(videoRef.current, 0, 0, w, h);
      const data = canvasRef.current.toDataURL("image/png");
      setData(data);
    }
  };

  const sendPhoto = useCallback(async () => {
    if (data) {
      setLoading(true);
      const formData = new FormData();
      const byteString = atob(data.split(",")[1]);
      const mimeString = data.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      formData.append("file", blob, "image.png");

      const results = await fetch(apiURL + "/upload", {
        method: "POST",
        body: formData,
        headers: {
          token: "emil:1234",
        },
      }).then((res) => res.json());

      if (results.error) {
        setError(results.error);
        setLoading(false);
        setData(null);
        return;
      }

      onResults(results.data);
    }
  }, [data, onResults]);

  const errorComponent = error ? <div>{error}</div> : null;

  if (!camera) {
    return (
      <div>
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-4 border-snaptrack-dark"></div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div>
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-4 border-snaptrack-dark"></div>
        </div>
        <div className="flex justify-center mt-10">
          <p>Sit tight, we're analyzing your meal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-full absolute top-0 left-0 right-0 bottom-0 z-10">
        {!data && (
          <>
            <video
              autoPlay
              playsInline
              ref={(video) => {
                if (video) {
                  video.srcObject = camera;
                  videoRef.current = video;
                }
              }}
              onClick={capturePhoto}
              className="h-full w-full object-cover"
            />
            <div className="flex items-center justify-center w-full absolute bottom-0 left-0 right-0 mb-5">
              <button
                onClick={capturePhoto}
                className="text-white px-4 py-2 rounded hover:bg-snaptrack-dark"
              >
                <div className={cn("stroke-none")}>
                  <svg
                    width="72"
                    height="72"
                    viewBox="0 0 72 72"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="36" cy="36" r="36" fill="#408B4B" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M25.625 29.7083C25.625 30.1172 25.4626 30.5093 25.1735 30.7985C24.8843 31.0876 24.4922 31.25 24.0833 31.25C23.6745 31.25 23.2823 31.0876 22.9932 30.7985C22.7041 30.5093 22.5417 30.1172 22.5417 29.7083V26.5063C22.5417 25.3346 22.6681 24.6794 23.0335 23.998C23.3772 23.352 23.8937 22.8356 24.5397 22.4918C25.2211 22.1264 25.8747 22 27.048 22H30.25C30.6589 22 31.051 22.1624 31.3401 22.4515C31.6292 22.7407 31.7917 23.1328 31.7917 23.5417C31.7917 23.9505 31.6292 24.3427 31.3401 24.6318C31.051 24.9209 30.6589 25.0833 30.25 25.0833H27.048C26.3403 25.0833 26.1692 25.1172 25.9935 25.2097C25.8895 25.2633 25.8049 25.3479 25.7514 25.4518C25.6589 25.626 25.625 25.7987 25.625 26.5063V29.7083ZM30.25 46.6667C30.6589 46.6667 31.051 46.8291 31.3401 47.1182C31.6292 47.4073 31.7917 47.7995 31.7917 48.2083C31.7917 48.6172 31.6292 49.0093 31.3401 49.2985C31.051 49.5876 30.6589 49.75 30.25 49.75H27.048C25.8763 49.75 25.2211 49.6236 24.5397 49.2582C23.8987 48.9174 23.3743 48.3929 23.0335 47.752C22.6681 47.0706 22.5417 46.4169 22.5417 45.2437V42.0417C22.5417 41.6328 22.7041 41.2407 22.9932 40.9515C23.2823 40.6624 23.6745 40.5 24.0833 40.5C24.4922 40.5 24.8843 40.6624 25.1735 40.9515C25.4626 41.2407 25.625 41.6328 25.625 42.0417V45.2437C25.625 45.9513 25.6589 46.1225 25.7514 46.2982C25.81 46.4061 25.8855 46.4832 25.9935 46.5402C26.1677 46.6327 26.3403 46.6667 27.048 46.6667H30.25ZM41.0417 23.5417C41.0417 23.9505 41.2041 24.3427 41.4932 24.6318C41.7823 24.9209 42.1745 25.0833 42.5833 25.0833H45.7854C46.493 25.0833 46.6641 25.1172 46.8399 25.2097C46.9478 25.2683 47.0249 25.3439 47.0819 25.4518C47.1744 25.626 47.2083 25.7987 47.2083 26.5063V29.7083C47.2083 30.1172 47.3708 30.5093 47.6599 30.7985C47.949 31.0876 48.3411 31.25 48.75 31.25C49.1589 31.25 49.551 31.0876 49.8401 30.7985C50.1292 30.5093 50.2917 30.1172 50.2917 29.7083V26.5063C50.2917 25.3346 50.1652 24.6794 49.7999 23.998C49.4591 23.3571 48.9346 22.8326 48.2937 22.4918C47.6122 22.1264 46.9586 22 45.7854 22H42.5833C42.1745 22 41.7823 22.1624 41.4932 22.4515C41.2041 22.7407 41.0417 23.1328 41.0417 23.5417ZM47.2083 42.0417C47.2083 41.6328 47.3708 41.2407 47.6599 40.9515C47.949 40.6624 48.3411 40.5 48.75 40.5C49.1589 40.5 49.551 40.6624 49.8401 40.9515C50.1292 41.2407 50.2917 41.6328 50.2917 42.0417V45.2437C50.2917 46.4154 50.1652 47.0706 49.7999 47.752C49.459 48.3929 48.9345 48.9173 48.2937 49.2582C47.6122 49.6236 46.9586 49.75 45.7854 49.75H42.5833C42.1745 49.75 41.7823 49.5876 41.4932 49.2985C41.2041 49.0093 41.0417 48.6172 41.0417 48.2083C41.0417 47.7995 41.2041 47.4073 41.4932 47.1182C41.7823 46.8291 42.1745 46.6667 42.5833 46.6667H45.7854C46.493 46.6667 46.6641 46.6327 46.8399 46.5402C46.9439 46.4868 47.0285 46.4022 47.0819 46.2982C47.1744 46.124 47.2083 45.9513 47.2083 45.2437V42.0417ZM22.5417 34.3333C22.1328 34.3333 21.7407 34.4958 21.4515 34.7849C21.1624 35.074 21 35.4661 21 35.875C21 36.2839 21.1624 36.676 21.4515 36.9651C21.7407 37.2542 22.1328 37.4167 22.5417 37.4167H50.2917C50.7005 37.4167 51.0927 37.2542 51.3818 36.9651C51.6709 36.676 51.8333 36.2839 51.8333 35.875C51.8333 35.4661 51.6709 35.074 51.3818 34.7849C51.0927 34.4958 50.7005 34.3333 50.2917 34.3333H22.5417Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </button>
            </div>
            <div className="absolute top-0 left-0 right-0 bottom-0 z-20 opacity-50 flex items-center justify-center">
              <ScanCrosshair />
            </div>
          </>
        )}
        <div
          style={{ display: data ? "block" : "none" }}
          className="flex relative w-full h-full"
        >
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <canvas ref={canvasRef} className="max-h-full max-w-full" />
          </div>
          <div className="flex w-full p-4 absolute bottom-0 left-0 right-0 justify-around">
            <button
              onClick={() => {
                setData(null);
              }}
              className="text-white px-4 py-2 rounded bg-snaptrack-main hover:bg-snaptrack-dark"
            >
              Retake
            </button>
            <button
              onClick={() => {
                sendPhoto();
              }}
              className="text-white px-4 py-2 rounded bg-snaptrack-main hover:bg-snaptrack-dark"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      {errorComponent && (
        <div className="flex justify-center mt-10 text-red-500">
          {errorComponent}
        </div>
      )}
    </div>
  );
}
