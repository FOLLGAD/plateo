"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const apiURL = "http://127.0.0.1:5000";

export default function FoodSnap({}) {
  const [camera, setCamera] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
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

  const sendPhoto = useCallback(() => {
    if (data) {
      // convert base64 to formdata file
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

      fetch(apiURL + "/upload", {
        method: "POST",
        body: formData,
      });
    }
  }, [data]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!camera) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ height: 480 }}
    >
      {!data && (
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
      )}
      <div
        style={{ display: data ? "block" : "none" }}
        className="flex relative w-full h-full"
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <canvas ref={canvasRef} />
        </div>
        {/* toolbar, send and delete */}
        <div className="flex w-full p-4 absolute bottom-0 left-0 right-0 justify-around">
          <button
            onClick={() => {
              setData(null);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Retake
          </button>
          <button
            onClick={() => {
              sendPhoto();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
