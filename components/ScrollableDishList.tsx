"use client"

import { useState } from "react"
import type { Dish, Category } from "@/contexts/AppContext"
import DishListItem from "./DishListItem"
import DishModalAlternative from "./DishModalAlternative"

interface ScrollableDishListProps {
  dishes: Dish[]
  categories: Category[]
}

export default function ScrollableDishList({ dishes, categories }: ScrollableDishListProps) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)

  const groupedDishes = categories.reduce(
    (acc, category) => {
      acc[category.id] = dishes.filter((dish) => dish.category === category.id)
      return acc
    },
    {} as Record<string, Dish[]>,
  )

  return (
    <>
      <div className="bg-[#FAFAF9] min-h-screen">
        {categories.map((category) => (
          <section key={category.id} id={`section-${category.id}`} className="mb-6">
            {/* Remove sticky positioning from category title */}
            <div className="bg-[#FAFAF9] px-4 py-4">
              <h2 className="text-lg font-semibold text-[#2D2A26]">{category.name}</h2>
            </div>

            <div className="bg-white mx-4 rounded-lg shadow-sm">
              <div className="divide-y divide-[#E8E6E3]">
                {groupedDishes[category.id]?.map((dish, index) => (
                  <DishListItem key={`${category.id}-${index}`} dish={dish} onClick={() => setSelectedDish(dish)} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {selectedDish && <DishModalAlternative dish={selectedDish} onClose={() => setSelectedDish(null)} />}
    </>
  )
}
