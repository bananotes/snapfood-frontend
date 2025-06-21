"use client"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, Star } from "lucide-react"
import type { Dish } from "@/contexts/AppContext"
import Image from "next/image"

interface DishModalProps {
  dish: Dish
  onClose: () => void
}

export default function DishModal({ dish, onClose }: DishModalProps) {
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-[#FF6D28] text-[#FF6D28]" />)
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-5 h-5 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-5 h-5 fill-[#FF6D28] text-[#FF6D28]" />
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
    "味道很正宗，分量足够，性价比很高！",
    "制作精良，口感层次丰富，值得推荐。",
    "经典菜品，每次来都会点，从不失望。",
  ]

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                as="div"
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
              >
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
                  <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2">{dish.name}</Dialog.Title>

                  {dish.price && <div className="text-2xl font-bold text-[#FF6D28] mb-3">{dish.price}</div>}

                  <div className="flex items-center space-x-1 mb-4">
                    {renderStars(dish.rating)}
                    <span className="text-lg font-medium text-gray-900 ml-2">{dish.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500 ml-1">({Math.round((dish.rating / 5) * 100)}% 好评)</span>
                  </div>

                  {dish.description && (
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed">{dish.description}</p>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">菜品介绍</h4>
                    <p className="text-gray-600 leading-relaxed">{dish.summary}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">用户评价</h4>
                    <div className="space-y-3">
                      {mockReviews.map((review, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">"{review}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-[#FF6D28] text-white py-3 rounded-lg font-medium hover:bg-[#E55A1F] transition-colors">
                    加入购物车
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
