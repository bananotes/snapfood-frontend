"use client"

import { Star, Plus } from "lucide-react"
import type { Dish } from "@/contexts/AppContext"
import Image from "next/image"

interface DishListItemProps {
  dish: Dish
  onClick: () => void
}

export default function DishListItem({ dish, onClick }: DishListItemProps) {
  const renderStars = (rating: number) => {
    const percentage = Math.round((rating / 5) * 100)
    return (
      <div className="flex items-center space-x-1">
        <div className="flex items-center">
          <Star className="w-3 h-3 fill-[#8B7355] text-[#8B7355]" />
        </div>
        <span className="text-sm font-medium text-[#2D2A26]">{percentage}%</span>
        <span className="text-sm text-[#6B6B6B]">({Math.floor(Math.random() * 200) + 50})</span>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-[#FAFAF9] cursor-pointer transition-colors active:bg-[#F5F4F2]"
    >
      <div className="flex-1 pr-4">
        <h3 className="text-base font-medium text-[#2D2A26] mb-1 line-clamp-2 leading-tight">{dish.name}</h3>

        <div className="flex items-center space-x-2 mb-2">
          {dish.price && <span className="text-lg font-semibold text-[#2D2A26]">{dish.price}</span>}
          <span className="text-[#6B6B6B]">•</span>
          {renderStars(dish.rating)}
        </div>

        {dish.description && <p className="text-sm text-[#6B6B6B] mb-2 line-clamp-2">{dish.description}</p>}

        <p className="text-sm text-[#6B6B6B] line-clamp-2">{dish.summary}</p>
      </div>

      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F5F4F2]">
          <Image
            src={dish.photoUrl || "/placeholder.svg"}
            alt={dish.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
        <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-[#E8E6E3] hover:bg-[#FAFAF9] transition-colors">
          <Plus className="w-4 h-4 text-[#8B7355]" />
        </button>
      </div>
    </div>
  )
}
