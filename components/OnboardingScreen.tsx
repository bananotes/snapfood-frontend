"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/AppContext"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface LanguageOption {
  code: string
  name: string
  flag: string // Emoji for simplicity
}

const languageOptions: LanguageOption[] = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "中文", name: "Chinese", flag: "🇨🇳" },
  { code: "ES", name: "Español", flag: "🇪🇸" },
  { code: "FR", name: "Français", flag: "🇫🇷" },
]

export default function OnboardingScreen() {
  const { setState } = useAppContext()
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(languageOptions[0])

  const handleGetStarted = () => {
    setState("idle") // Transition to camera scanner view
  }

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Top Right Language Switcher */}
      <div className="absolute top-0 right-0 p-4 pt-safe-top z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 border-gray-200"
            >
              <span>{selectedLanguage.flag}</span>
              <span className="font-medium text-sm">{selectedLanguage.code}</span>
              <ChevronDown size={16} className="text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card">
            {languageOptions.map((option) => (
              <DropdownMenuItem
                key={option.code}
                onClick={() => setSelectedLanguage(option)}
                className="hover:bg-gray-100 cursor-pointer"
              >
                <span className="mr-2">{option.flag}</span>
                <span>{option.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* GIF Placeholder Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 overflow-hidden relative">
        <div className="w-[85%] max-w-sm aspect-[9/19.5] bg-gray-800 rounded-[40px] shadow-2xl flex items-center justify-center p-2">
          <Image
            src="/placeholder.svg?height=600&width=300"
            alt="App feature: scanning a menu"
            width={280}
            height={600}
            className="object-contain rounded-[30px]"
          />
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="px-8 py-10 pb-safe-bottom flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Unlock Menu Secrets</h1>
        <p className="text-lg text-gray-600 mb-6 px-4">Snap a photo, discover dishes, and explore ratings instantly.</p>
        <button
          onClick={handleGetStarted}
          className="w-full max-w-xs bg-black text-white font-semibold py-4 rounded-full text-lg hover:bg-gray-800 transition-colors active:scale-95"
        >
          Scan Your First Menu
        </button>
      </div>
    </div>
  )
}
