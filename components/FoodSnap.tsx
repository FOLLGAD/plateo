"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiURL } from "./utils";

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
    <div>
      <div
        className="flex flex-col items-center justify-center w-full relative"
        style={{ height: 480 }}
      >
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
            />
            <div className="flex items-center justify-center w-full absolute bottom-0 left-0 right-0 mb-5">
              <button
                onClick={capturePhoto}
                className="text-white px-4 py-2 rounded bg-snaptrack-main hover:bg-snaptrack-dark"
              >
                Capture
              </button>
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
