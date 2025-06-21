"use client"

import { useState } from "react"
import type { Dish } from "@/contexts/AppContext"
import DishListItem from "./DishListItem"
import DishModal from "./DishModalAlternative"

interface DishListProps {
  dishes: Dish[]
}

export default function DishList({ dishes }: DishListProps) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)

  return (
    <>
      <div className="bg-white">
        <div className="divide-y divide-gray-100">
          {dishes.map((dish, index) => (
            <DishListItem key={index} dish={dish} onClick={() => setSelectedDish(dish)} />
          ))}
        </div>
      </div>

      {selectedDish && <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />}
    </>
  )
}
