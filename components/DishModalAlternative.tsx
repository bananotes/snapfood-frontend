"use client"

import { useEffect } from "react"
import { X, Star } from "lucide-react"
import type { Dish } from "@/contexts/AppContext"
import Image from "next/image"

interface DishModalProps {
  dish: Dish
  onClose: () => void
}

export default function DishModalAlternative({ dish, onClose }: DishModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [onClose])

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-[#8B7355] text-[#8B7355]" />)
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-5 h-5 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-5 h-5 fill-[#8B7355] text-[#8B7355]" />
          </div>
        </div>,
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)
    }

    return stars
  }

  const mockReviews = [
    "Authentic taste, generous portion, great value for money!",
    "Expertly prepared, rich layers of flavor, highly recommended.",
    "Classic dish, order it every time, never disappoints.",
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-square relative">
              <Image
                src={dish.photoUrl || "/placeholder.svg"}
                alt={dish.name}
                fill
                className="object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#2D2A26] mb-2">{dish.name}</h3>

            {dish.price && <div className="text-2xl font-bold text-[#8B7355] mb-3">{dish.price}</div>}

            <div className="flex items-center space-x-1 mb-4">
              {renderStars(dish.rating)}
              <span className="text-lg font-medium text-[#2D2A26] ml-2">{dish.rating.toFixed(1)}</span>
              <span className="text-sm text-[#6B6B6B] ml-1">({Math.round((dish.rating / 5) * 100)}% positive)</span>
            </div>

            {dish.description && (
              <div className="mb-4">
                <p className="text-[#2D2A26] leading-relaxed">{dish.description}</p>
              </div>
            )}

            <div className="mb-6">
              <h4 className="font-medium text-[#2D2A26] mb-2">About this dish</h4>
              <p className="text-[#6B6B6B] leading-relaxed">{dish.summary}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-[#2D2A26] mb-3">Customer Reviews</h4>
              <div className="space-y-3">
                {mockReviews.map((review, index) => (
                  <div key={index} className="bg-[#FAFAF9] rounded-lg p-3">
                    <p className="text-sm text-[#2D2A26]">"{review}"</p>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-[#8B7355] text-white py-3 rounded-lg font-medium hover:bg-[#6B5B47] transition-colors active:bg-[#5A4A3A]">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
