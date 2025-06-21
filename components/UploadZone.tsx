"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Camera, Upload, ImageIcon } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { processImage } from "@/utils/ocr"

export default function UploadZone() {
  const { setState, setProgress, setError } = useAppContext()
  const [isDragActive, setIsDragActive] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      try {
        setState("ocr_processing")
        setProgress(10)

        const result = await processImage(file, (progress) => {
          setProgress(10 + progress * 0.6) // OCR takes 60% of progress
        })

        setProgress(70)
        setState("querying")

        // Mock API call - replace with actual API
        try {
          const response = await fetch("/api/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dishes: result.dishes }),
          })

          if (!response.ok) {
            throw new Error("API request failed")
          }

          const data = await response.json()
          setProgress(100)

          setTimeout(() => {
            setState("show_cards")
          }, 500)
        } catch (apiError) {
          // If API fails, still show cards with mock data
          console.log("API failed, using mock data")
          setProgress(100)
          setTimeout(() => {
            setState("show_cards")
          }, 500)
        }
      } catch (error) {
        console.error("Processing failed:", error)
        setError("Image processing failed, please try again")
      }
    },
    [setState, setProgress, setError],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      video.addEventListener("loadedmetadata", () => {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(video, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
              handleFile(file)
            }
          },
          "image/jpeg",
          0.8,
        )

        stream.getTracks().forEach((track) => track.stop())
      })
    } catch (error) {
      setError("Unable to access camera, please check permissions")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? "border-[#8B7355] bg-[#F5F4F2]" : "border-[#E8E6E3] hover:border-[#8B7355] hover:bg-[#FAFAF9]"}
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-[#8B7355] rounded-full">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#2D2A26] mb-2">Upload Menu Photo</h3>
            <p className="text-[#6B6B6B]">Drag and drop your image here, or click to select</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="flex items-center space-x-2 px-6 py-3 bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5B47] transition-colors active:bg-[#5A4A3A]"
            >
              <Upload className="w-5 h-5" />
              <span>Choose File</span>
            </button>

            <button
              type="button"
              onClick={handleCameraCapture}
              className="flex items-center space-x-2 px-6 py-3 border border-[#8B7355] text-[#8B7355] rounded-lg hover:bg-[#F5F4F2] transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span>Take Photo</span>
            </button>
          </div>

          <p className="text-sm text-[#6B6B6B]">Supports JPG, PNG, WebP formats, max 10MB</p>
        </div>
      </div>
    </div>
  )
}
