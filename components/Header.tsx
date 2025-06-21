"use client"

import { useAppContext } from "@/contexts/AppContext"

export default function Header() {
  const { state } = useAppContext()

  const isShowingCards = state === "show_cards"

  return (
    <header className="bg-white border-b border-[#E8E6E3] sticky top-0 z-50">
      <div className="px-4 py-4">
        <div className="text-center">
          {isShowingCards ? (
            <>
              <h1 className="text-2xl font-bold text-[#2D2A26] mb-1">Golden Dragon Restaurant</h1>
              <p className="text-sm text-[#6B6B6B]">Authentic Chinese Cuisine</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#2D2A26] mb-1">
                <span className="text-[#8B7355]">Snap</span>Dish
              </h1>
              <p className="text-sm text-[#6B6B6B]">Snap photos, discover delicious dishes</p>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
