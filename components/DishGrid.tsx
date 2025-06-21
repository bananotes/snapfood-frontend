"use client"

import { useState } from "react"
import type { Dish } from "@/contexts/AppContext"
import DishCard from "./DishCard"
import DishModal from "./DishModal"

interface DishGridProps {
  dishes: Dish[]
}

export default function DishGrid({ dishes }: DishGridProps) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish, index) => (
          <DishCard key={index} dish={dish} onClick={() => setSelectedDish(dish)} />
        ))}
      </div>

      {selectedDish && <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />}
    </>
  )
}
