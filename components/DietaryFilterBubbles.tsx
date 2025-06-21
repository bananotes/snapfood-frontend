"use client"

import type React from "react"
import { useState } from "react"
import { Leaf, Wheat, Fish, Milk, Vegan, UtensilsCrossed } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DietaryFilter {
  id: string
  label: string
  icon?: React.ElementType
}

const exampleDietaryFilters: DietaryFilter[] = [
  { id: "vegan", label: "Vegan", icon: Vegan },
  { id: "vegetarian", label: "Vegetarian", icon: Leaf },
  { id: "halal", label: "Halal", icon: UtensilsCrossed },
  { id: "gluten-free", label: "Gluten-Free", icon: Wheat },
  { id: "pescatarian", label: "Pescatarian", icon: Fish },
  { id: "dairy-free", label: "Dairy-Free", icon: Milk },
]

export default function DietaryFilterBubbles() {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false)
  const [hasShownDisclaimer, setHasShownDisclaimer] = useState(false)

  const handleFilterClick = (filterId: string) => {
    const isAddingFirstFilter = selectedFilters.size === 0 && !selectedFilters.has(filterId)

    if (isAddingFirstFilter && !hasShownDisclaimer) {
      setIsDisclaimerOpen(true)
    }
    toggleFilter(filterId)
  }

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prevSelected) => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(filterId)) {
        newSelected.delete(filterId)
      } else {
        newSelected.add(filterId)
      }
      console.log("Selected dietary filters:", Array.from(newSelected))
      return newSelected
    })
  }

  const handleAcknowledge = () => {
    setIsDisclaimerOpen(false)
    setHasShownDisclaimer(true)
  }

  return (
    <>
      <div className="bg-white py-3 px-4 border-b border-[#E8E6E3]">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {exampleDietaryFilters.map((filter) => {
            const IconComponent = filter.icon
            const isSelected = selectedFilters.has(filter.id)
            return (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id)}
                className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors
                flex items-center space-x-2
                ${isSelected ? "bg-[#8B7355] text-white" : "bg-[#F5F4F2] text-[#6B6B6B] hover:bg-[#E8E6E3]"}
              `}
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                <span>{filter.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      <Dialog open={isDisclaimerOpen} onOpenChange={setIsDisclaimerOpen}>
        <DialogContent className="sm:max-w-md bg-card rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[#2D2A26]">Dietary Information Disclaimer</DialogTitle>
            <DialogDescription>
              This information is for reference only. If you have strict dietary requirements, please confirm with the
              restaurant staff when ordering.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start pt-4">
            {" "}
            {/* Added pt-4 for spacing */}
            <Button
              type="button"
              onClick={handleAcknowledge}
              className="bg-[#8B7355] hover:bg-[#6B5B47] text-white" // Consistent button style
            >
              Acknowledge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
