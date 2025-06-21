"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Camera, Zap, ImageIcon, ScanLine } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { processImage } from "@/utils/ocr"

export default function CameraScanner() {
  const { setState, setProgress, setError, setDishes, setCategories } = useAppContext() // Assuming setDishes and setCategories might be needed from context
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Use a ref to manage the stream internally to avoid useEffect loops with `stream` state as dependency
  const _streamRef = useRef<MediaStream | null>(null)
  // Keep a state for stream if other parts of the component need to react to it,
  // but primary control for start/stop will use the ref.
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null)

  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      try {
        setState("ocr_processing")
        setProgress(10)

        const ocrResult = await processImage(file, (ocrProgress) => {
          setProgress(10 + ocrProgress * 0.6) // 10% to 70% for OCR
        })

        setProgress(70)
        setState("querying")

        // Store OCR results in context
        setDishes(ocrResult.dishes)
        setCategories(ocrResult.categories)

        // Simulate API call delay or handle actual API call
        // const response = await fetch("/api/query", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ dishes: ocrResult.dishes }),
        // })

        // if (!response.ok) {
        //   console.warn("API request failed, proceeding with OCR results or mock data.")
        //   // Potentially use mock data or just OCR results if API fails
        // }
        // const apiData = await response.json();
        // setDishes(apiData.dishes); // Assuming API might refine dishes
        // setCategories(apiData.categories); // Assuming API might refine categories

        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network latency for querying

        setProgress(100)
        setTimeout(() => {
          setState("show_cards")
        }, 300)
      } catch (error) {
        console.error("Processing failed:", error)
        setError(error instanceof Error ? error.message : "Image processing failed, please try again.")
        setState("error")
      }
    },
    [setState, setProgress, setError, setDishes, setCategories],
  )

  const startCamera = useCallback(async () => {
    if (_streamRef.current) {
      _streamRef.current.getTracks().forEach((track) => track.stop())
      _streamRef.current = null
    }
    setCurrentStream(null)
    setIsCameraReady(false)
    setCameraError(null)

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      _streamRef.current = mediaStream
      setCurrentStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true)
        }
        // Ensure video plays if autoplay is not consistent
        await videoRef.current.play().catch((err) => {
          console.warn("Video play() failed, possibly due to browser policy:", err)
          // Some browsers require user interaction to play video even if muted
        })
      }
      setCameraError(null)
    } catch (err) {
      console.error("Error accessing camera:", err)
      let errorMessage = "Could not access camera. Please check permissions and try again."
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorMessage =
            "Camera access denied. Please enable camera permissions in your browser/system settings and try again."
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          errorMessage = "No camera found. Please ensure a camera is connected and enabled."
        } else if (
          err.name === "NotReadableError" ||
          err.name === "TrackStartError" ||
          err.name === "OverconstrainedError" ||
          err.name === "ConstraintNotSatisfiedError"
        ) {
          errorMessage =
            "Camera is busy, not supported, or hardware error. Try closing other apps using the camera or check camera settings."
        } else if (err.name === "AbortError") {
          errorMessage = "Camera access was aborted. Please try again."
        } else {
          errorMessage = `Camera error: ${err.message} (${err.name}). Please try again.`
        }
      }
      setCameraError(errorMessage)
      setIsCameraReady(false)
      if (_streamRef.current) {
        _streamRef.current.getTracks().forEach((track) => track.stop())
        _streamRef.current = null
      }
      setCurrentStream(null)
    }
  }, [videoRef, setCurrentStream, setIsCameraReady, setCameraError]) // Dependencies are stable setters or refs

  useEffect(() => {
    startCamera() // Attempt to start camera on mount
    return () => {
      // Cleanup when component unmounts
      if (_streamRef.current) {
        _streamRef.current.getTracks().forEach((track) => track.stop())
        _streamRef.current = null
      }
      setCurrentStream(null)
    }
  }, [startCamera]) // `startCamera` callback is stable now

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current && isCameraReady && _streamRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" })
              handleFile(file) // Process the file
              // Stop the camera stream after capture
              if (_streamRef.current) {
                _streamRef.current.getTracks().forEach((track) => track.stop())
                _streamRef.current = null
              }
              setCurrentStream(null)
              setIsCameraReady(false)
            }
          },
          "image/jpeg",
          0.9,
        )
      }
    }
  }, [isCameraReady, handleFile, videoRef, canvasRef, setCurrentStream, setIsCameraReady])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Stop camera if it's running before processing uploaded file
      if (_streamRef.current) {
        _streamRef.current.getTracks().forEach((track) => track.stop())
        _streamRef.current = null
        setCurrentStream(null)
        setIsCameraReady(false)
      }
      handleFile(file)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1C1C1E] text-white">
      {/* Top Bar - Empty for cleaner look, adjust padding if needed for status bar */}
      <div className="h-[72px] flex items-center justify-between px-4 pt-safe-top">
        {/* Intentionally empty or for status bar spacing */}
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black bg-opacity-75 z-10">
            <Camera size={48} className="text-red-500 mb-4" />
            <p className="text-lg mb-2">Camera Error</p>
            <p className="text-sm text-gray-400 mb-4">{cameraError}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
            <p className="text-xs text-gray-500 mt-4">Or, upload an image:</p>
            <label
              htmlFor="error-file-upload"
              className="mt-2 text-sm px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
            >
              Upload Image
            </label>
            <input id="error-file-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraReady ? "opacity-100" : "opacity-0"}`}
        />
        {!isCameraReady && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <ScanLine size={64} className="text-white animate-pulse" />
          </div>
        )}

        {/* Viewfinder Overlay - Four corners */}
        {isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
            {" "}
            {/* Added padding to pull corners from edge */}
            <div className="relative w-[85%] aspect-[3/4] max-w-md max-h-[70vh]">
              {" "}
              {/* Adjusted aspect ratio and max size */}
              {/* Top-left corner */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
              {/* Top-right corner */}
              <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
              {/* Bottom-left corner */}
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
              {/* Bottom-right corner */}
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-xl"></div>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom Controls - No background color, icons directly on video feed */}
      <div className="h-[120px] flex items-center justify-around px-4 pb-safe-bottom">
        <label
          htmlFor="file-upload-camera"
          className="p-3 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer"
          title="Upload from gallery"
        >
          <ImageIcon size={28} className="text-white shadow-sm" />
          <input id="file-upload-camera" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
        <button
          onClick={captureImage}
          disabled={!isCameraReady || !!cameraError}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-300/70 shadow-xl
                     flex items-center justify-center
                     disabled:opacity-50 disabled:cursor-not-allowed
                     active:scale-95 transition-transform"
          aria-label="Capture image"
        >
          {/* Optional: Inner circle for shutter button style */}
          {/* <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-400"></div> */}
        </button>
        <button
          className="p-3 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          title="Toggle flash (not implemented)"
        >
          <Zap size={28} className="text-white shadow-sm" /> {/* Flash Icon */}
        </button>
      </div>
    </div>
  )
}
