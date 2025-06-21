"use client"

import { useEffect, useState } from "react"

interface HotdogLoadingAnimationProps {
  progress: number // 0 to 100
}

export default function HotdogLoadingAnimation({ progress }: HotdogLoadingAnimationProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative w-48 h-24 mb-8">
        {/* Bottom Bun */}
        <div
          className="absolute bottom-0 left-0 w-full h-10 bg-[#D4A574] rounded-b-full border-2 border-[#B8935F] shadow-inner"
          style={{ clipPath: "inset(50% 0 0 0)" }} // Show only bottom half
        />
        <div className="absolute bottom-0 left-0 w-full h-10 bg-[#D4A574] rounded-full border-2 border-[#B8935F] shadow-md"></div>

        {/* Sausage Container (Mask for filling effect) */}
        <div className="absolute left-[10px] right-[10px] top-[calc(50%-12px)] h-6 rounded-full overflow-hidden bg-[#F5E8D8] border border-[#E0D0B8] shadow-inner">
          {/* Sausage - Fills based on progress */}
          <div
            className="h-full bg-gradient-to-r from-[#C4704A] to-[#A85D3F] rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${normalizedProgress}%` }}
          >
            {/* Grill marks - appear as sausage fills */}
            {normalizedProgress > 20 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-1 h-3/5 bg-[#A85D3F]/50 rounded-sm transform -rotate-12"></div>
            )}
            {normalizedProgress > 50 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-1 h-3/5 bg-[#A85D3F]/50 rounded-sm transform -rotate-12"></div>
            )}
            {normalizedProgress > 80 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-3/4 w-1 h-3/5 bg-[#A85D3F]/50 rounded-sm transform -rotate-12"></div>
            )}
          </div>
        </div>

        {/* Top Bun */}
        <div
          className="absolute top-0 left-0 w-full h-10 bg-[#D4A574] rounded-t-full border-2 border-[#B8935F] shadow-inner"
          style={{ clipPath: "inset(0 0 50% 0)" }} // Show only top half
        />
        <div className="absolute top-0 left-0 w-full h-10 bg-[#D4A574] rounded-full border-2 border-[#B8935F] shadow-md">
          {/* Sesame Seeds */}
          <div className="absolute top-2 left-8 w-1 h-1 bg-[#8B7355]/70 rounded-full animate-pulse delay-100"></div>
          <div className="absolute top-3 left-16 w-0.5 h-0.5 bg-[#8B7355]/70 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-2 right-10 w-1 h-1 bg-[#8B7355]/70 rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Bouncing Condiments - appear as sausage fills */}
        {normalizedProgress > 30 && (
          <div
            className="absolute w-2 h-2 bg-red-500 rounded-full animate-bounce"
            style={{ top: "calc(50% - 18px)", left: "30%", animationDelay: "0s" }}
          ></div>
        )}
        {normalizedProgress > 60 && (
          <div
            className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"
            style={{ top: "calc(50% - 20px)", left: "50%", animationDelay: "0.2s" }}
          ></div>
        )}
        {normalizedProgress > 90 && (
          <div
            className="absolute w-2 h-2 bg-red-500 rounded-full animate-bounce"
            style={{ top: "calc(50% - 18px)", left: "70%", animationDelay: "0.4s" }}
          ></div>
        )}
      </div>

      <h3 className="text-lg font-medium text-[#2D2A26] mb-1">Analyzing your menu</h3>
      <p className="text-sm text-[#6B6B6B] h-4">Please wait{dots}</p>
    </div>
  )
}
