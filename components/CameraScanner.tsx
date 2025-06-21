"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Camera, Zap, ImageIcon, ScanLine } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { processImage } from "@/utils/ocr"

export default function CameraScanner() {
  const { setState, setProgress, setError } = useAppContext()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      try {
        setState("ocr_processing")
        setProgress(10)

        const result = await processImage(file, (ocrProgress) => {
          setProgress(10 + ocrProgress * 0.6)
        })

        setProgress(70)
        setState("querying")

        const response = await fetch("/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dishes: result.dishes }),
        })

        if (!response.ok) {
          console.warn("API request failed, proceeding with OCR results or mock data.")
        }

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
    [setState, setProgress, setError],
  )

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true)
        }
      }
      setCameraError(null)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setCameraError("Could not access camera. Please check permissions and try again.")
      setIsCameraReady(false)
    }
  }, [stream]) // Keep stream dependency to re-init if stream changes externally, though unlikely here.

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [startCamera])

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
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
              handleFile(file)
              if (stream) {
                stream.getTracks().forEach((track) => track.stop())
                setStream(null)
                setIsCameraReady(false)
              }
            }
          },
          "image/jpeg",
          0.9,
        )
      }
    }
  }, [isCameraReady, handleFile, stream])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
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
