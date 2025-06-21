"use client"

import { useEffect, useState } from "react"
import { useAppContext, type Category } from "@/contexts/AppContext"

interface CategoryNavigationProps {
  categories: Category[]
}

export default function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const { activeCategory, setActiveCategory } = useAppContext()
  const [activeSection, setActiveSection] = useState("Recommended")

  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((cat) => document.getElementById(`section-${cat.id}`))
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(categories[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [categories])

  const scrollToSection = (categoryId: string) => {
    const element = document.getElementById(`section-${categoryId}`)
    if (element) {
      const headerHeight = 80 // Only header height, no sticky nav
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
    setActiveCategory(categoryId)
  }

  return (
    <div className="bg-white border-b border-[#E8E6E3] sticky top-[72px] z-40">
      <div className="px-4">
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide py-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToSection(category.id)}
              className={`
                whitespace-nowrap text-sm font-medium pb-2 border-b-2 transition-colors min-w-fit
                ${
                  activeSection === category.id
                    ? "border-[#8B7355] text-[#8B7355]"
                    : "border-transparent text-[#6B6B6B] hover:text-[#2D2A26]"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
