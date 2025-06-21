"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Category } from "@/contexts/AppContext"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  activeCategoryId: string
  onSelectCategory: (categoryId: string) => void
}

export default function CategoryModal({
  isOpen,
  onClose,
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryModalProps) {
  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/*
        Explicitly use `bg-card` for a white background (#ffffff from your theme).
        The `DialogContent` component from shadcn/ui already includes styles for
        rounded corners (sm:rounded-lg), shadow (shadow-lg), border, and padding (p-6).
        Text colors for Title and Description are handled by their respective components
        or inherited (text-card-foreground for base text if needed).
      */}
      <DialogContent className="sm:max-w-lg bg-card rounded-xl shadow-xl">
        <DialogHeader>
          {/* Using text-[#2D2A26] for consistency with other titles if DialogTitle doesn't default to it */}
          <DialogTitle className="text-[#2D2A26]">All Categories</DialogTitle>
          <DialogDescription>Select a category to quickly jump to it.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  p-4 text-left rounded-lg border transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#F5F4F2] border-[#8B7355] shadow-sm" // Active state
                      : "bg-[#FAFAF9] border-[#E8E6E3] hover:border-[#A0956B] hover:bg-[#F5F4F2]" // Inactive state
                  }
                `}
              >
                <p className={`font-medium ${isActive ? "text-[#8B7355]" : "text-[#2D2A26]"}`}>{category.name}</p>
                <p className="text-sm text-[#6B6B6B]">{category.count} items</p>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
