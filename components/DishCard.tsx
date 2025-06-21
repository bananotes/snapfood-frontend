"use client"

import { Star } from "lucide-react"
import type { Dish } from "@/contexts/AppContext"
import Image from "next/image"

interface DishCardProps {
  dish: Dish
  onClick: () => void
}

export default function DishCard({ dish, onClick }: DishCardProps) {
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-[#FF6D28] text-[#FF6D28]" />)
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-[#FF6D28] text-[#FF6D28]" />
          </div>
        </div>,
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] group"
    >
      <div className="aspect-square relative overflow-hidden rounded-t-xl">
        <Image
          src={dish.photoUrl || "/placeholder.svg"}
          alt={dish.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          crossOrigin="anonymous"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{dish.name}</h3>

        <div className="flex items-center space-x-1 mb-2">
          {renderStars(dish.rating)}
          <span className="text-sm text-gray-600 ml-2">{dish.rating.toFixed(1)}</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{dish.summary}</p>
      </div>
    </div>
  )
}
