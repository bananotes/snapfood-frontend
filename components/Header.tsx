"use client"

import { useAppContext } from "@/contexts/AppContext"
import { X, Search } from "lucide-react"

export default function Header() {
  const { state, setState } = useAppContext()

  const isShowingCards = state === "show_cards"

  const handleBackToUpload = () => {
    setState("idle")
    // Potentially clear dishes and categories as well if needed
    // setDishes([])
    // setCategories([])
  }

  const handleSearchClick = () => {
    // Placeholder for search functionality
    // You can expand this later to open a search bar or modal
    console.log("Search icon clicked")
  }

  return (
    <header className="bg-white border-b border-[#E8E6E3] sticky top-0 z-50 h-[72px] flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        {isShowingCards ? (
          <button
            onClick={handleBackToUpload}
            className="p-2 text-gray-700 hover:text-black rounded-full transition-colors active:bg-gray-100"
            aria-label="Back to upload"
          >
            <X className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10"></div> // Placeholder to balance the layout when X is not shown
        )}

        <div className="text-center flex-grow">
          {isShowingCards ? (
            <>
              <h1 className="text-lg font-semibold text-[#2D2A26] truncate">Golden Dragon Restaurant</h1>
              {/* Removed subtitle to simplify, can be added back if needed */}
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-[#2D2A26]">
                <span className="text-[#8B7355]">Snap</span>Dish
              </h1>
            </>
          )}
        </div>

        {isShowingCards ? (
          <button
            onClick={handleSearchClick}
            className="p-2 text-gray-700 hover:text-black rounded-full transition-all duration-100 ease-in-out active:bg-gray-100 active:scale-90"
            aria-label="Search dishes"
          >
            <Search className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10"></div> // Placeholder
        )}
      </div>
    </header>
  )
}
