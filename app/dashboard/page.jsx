"use client";
import { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import './App.css';

const Dashboard = () => {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  // Start video stream from the webcam
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error("Error starting video stream:", err);
      });
  };

  // Load face-api.js models
  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]);
    faceMyDetect();
  };

  // Detect faces and draw them on the canvas
  const faceMyDetect = () => {
    setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        // Clear the canvas before drawing
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Resize canvas to match video size
        faceapi.matchDimensions(canvas, {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });

        const resizedDetections = faceapi.resizeResults(detections, {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }
    }, 1000);
  };

  return (
    <>
      <div className="myapp">
        <div className="appvide">
          <video crossOrigin="anonymous" ref={videoRef} autoPlay muted width="940" height="650"></video>
          <canvas ref={canvasRef} width="940" height="650" className="appcanvas" />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
