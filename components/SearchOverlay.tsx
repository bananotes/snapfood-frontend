"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, Search, X } from "lucide-react"
import { useAppContext, type Dish } from "@/contexts/AppContext"
import DishListItem from "./DishListItem"
import DishModalAlternative from "./DishModalAlternative"
import Image from "next/image"

export default function SearchOverlay() {
  const { dishes, isSearchActive, toggleSearch } = useAppContext()
  const [query, setQuery] = useState("")
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)

  useEffect(() => {
    // Reset query when overlay is closed
    if (!isSearchActive) {
      setQuery("")
    }
  }, [isSearchActive])

  const filteredDishes = useMemo(() => {
    if (!query) {
      return []
    }
    return dishes.filter((dish) => dish.name.toLowerCase().includes(query.toLowerCase()))
  }, [query, dishes])

  if (!isSearchActive) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-white animate-fade-in">
        {/* Search Header */}
        <div className="h-[72px] flex items-center px-4 border-b border-[#E8E6E3]">
          <button onClick={toggleSearch} className="p-2 mr-2 text-gray-700 hover:text-black">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Dishes..."
              autoFocus
              className="w-full h-11 pl-10 pr-10 bg-[#F5F4F2] rounded-full border border-transparent focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] outline-none transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto h-[calc(100vh-72px)]">
          {query && filteredDishes.length > 0 && (
            <div className="divide-y divide-gray-100">
              {filteredDishes.map((dish, index) => (
                <DishListItem key={index} dish={dish} onClick={() => setSelectedDish(dish)} />
              ))}
            </div>
          )}

          {query && filteredDishes.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600">No results found for "{query}"</p>
            </div>
          )}

          {!query && (
            <div className="flex flex-col items-center justify-center text-center pt-20 px-4">
              <Image
                src="/placeholder.svg?height=180&width=180"
                alt="Cute cake illustration"
                width={180}
                height={180}
                className="mb-8 opacity-75"
              />
              <h3 className="text-lg font-medium text-[#2D2A26]">Search for your favorite dish</h3>
              <p className="text-[#6B6B6B] mt-1">Find anything from appetizers to main courses.</p>
            </div>
          )}
        </div>
      </div>

      {selectedDish && <DishModalAlternative dish={selectedDish} onClose={() => setSelectedDish(null)} />}
    </>
  )
}
