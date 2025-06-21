"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/AppContext"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// ChevronDown is removed

interface LanguageOption {
  code: string // Will be used for display on the button
  name: string
  flag: string // Emoji for simplicity
}

const languageOptions: LanguageOption[] = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "中文", name: "Chinese", flag: "🇨🇳" }, // Assuming "中文" is the desired 2-char code for Chinese
  { code: "ES", name: "Español", flag: "🇪🇸" },
  { code: "FR", name: "Français", flag: "🇫🇷" },
  { code: "日本語", name: "Japanese", flag: "🇯🇵" }, // Added Japanese as an example
  { code: "한국어", name: "Korean", flag: "🇰🇷" }, // Added Korean as an example
]

export default function OnboardingScreen() {
  const { setState } = useAppContext()
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(languageOptions[0])

  const handleGetStarted = () => {
    setState("idle") // Transition to camera scanner view
  }

  return (
    // Updated background and default text color for the screen
    <div className="flex flex-col h-screen bg-[#FAFAF9] text-[#2D2A26]">
      {/* Top Right Language Switcher - Small circle, no arrow */}
      <div className="absolute top-0 right-0 p-4 pt-safe-top z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-50 active:scale-95 transition-all border border-[#E8E6E3]"
              aria-label="Select language"
            >
              <span className="text-xl">{selectedLanguage.flag}</span>
              {/* <span className="font-medium text-xs ml-1">{selectedLanguage.code}</span> */}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-[#E8E6E3] shadow-lg w-48">
            {languageOptions.map((option) => (
              <DropdownMenuItem
                key={option.code}
                onClick={() => setSelectedLanguage(option)}
                className="hover:bg-[#F5F4F2] cursor-pointer text-sm py-2 px-3 flex items-center"
              >
                <span className="text-lg mr-2">{option.flag}</span>
                <span className="flex-1 text-[#2D2A26]">{option.name}</span>
                {selectedLanguage.code === option.code && (
                  <span className="text-xs text-[#8B7355] ml-auto">({option.code})</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* GIF Placeholder Area - Themed */}
      <div className="flex-1 flex items-center justify-center bg-[#E8E6E3] overflow-hidden relative px-4">
        {/* Phone mock styling adjusted */}
        <div className="w-full max-w-[280px] sm:max-w-xs aspect-[9/19.5] bg-white rounded-[36px] shadow-2xl flex items-center justify-center p-1.5 border-2 border-gray-200">
          <Image
            src="/placeholder.svg?height=600&width=300"
            alt="App feature: scanning a menu"
            width={270} // Slightly smaller to fit padding
            height={585} // Maintain aspect ratio
            className="object-contain rounded-[30px] bg-gray-700" // Added bg for placeholder visibility
          />
        </div>
      </div>

      {/* Bottom Content Area - Themed text colors */}
      <div className="px-6 sm:px-8 py-8 sm:py-10 pb-safe-bottom flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[#2D2A26]">Unlock Menu Secrets</h1>
        <p className="text-base sm:text-lg text-[#6B6B6B] mb-6 max-w-md">
          Snap a photo, discover dishes, and explore ratings instantly.
        </p>
        <button
          onClick={handleGetStarted}
          className="w-full max-w-xs bg-[#2D2A26] text-white font-semibold py-3.5 sm:py-4 rounded-full text-lg hover:bg-[#1e1c1a] transition-colors active:scale-95 shadow-md"
        >
          Scan Your First Menu
        </button>
      </div>
    </div>
  )
}
