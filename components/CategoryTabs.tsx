"use client"

import { useAppContext, type Category } from "@/contexts/AppContext"

interface CategoryTabsProps {
  categories: Category[]
}

export default function CategoryTabs({ categories }: CategoryTabsProps) {
  const { activeCategory, setActiveCategory } = useAppContext()

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                py-4 px-2 whitespace-nowrap text-sm font-medium border-b-2 transition-colors
                ${
                  activeCategory === category.id
                    ? "border-[#FF6D28] text-[#FF6D28]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {category.name}
              {category.count > 0 && <span className="ml-1 text-xs text-gray-400">({category.count})</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
