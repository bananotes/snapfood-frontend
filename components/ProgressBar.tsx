"use client"

import { useAppContext } from "@/contexts/AppContext"
import { useEffect, useState } from "react"

export default function ProgressBar() {
  const { state, progress } = useAppContext()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (state === "ocr_processing" || state === "querying") {
      setVisible(true)
    } else if (state === "show_cards" || state === "error") {
      setTimeout(() => setVisible(false), 300)
    }
  }, [state])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-0.5 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-[#FF6D28] to-[#FF8A50] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
