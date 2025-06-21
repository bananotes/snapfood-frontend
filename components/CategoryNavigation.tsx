"use client"

import { useEffect, useState, useRef } from "react"
import { useAppContext, type Category } from "@/contexts/AppContext"
import { List } from "lucide-react" // Import List icon
import CategoryModal from "./CategoryModal"

interface CategoryNavigationProps {
  categories: Category[]
}

export default function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const { activeCategory, setActiveCategory } = useAppContext()
  const [activeSection, setActiveSection] = useState("Recommended")
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 })
  const navRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const UNDERLINE_EXTRA_PADDING = 12 // 6px on each side

  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((cat) => document.getElementById(`section-${cat.id}`))
      const scrollPosition = window.scrollY + (navRef.current?.offsetHeight || 60) + 72 + 50 // Header + Nav + Offset

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          if (activeSection !== categories[i].id) {
            setActiveSection(categories[i].id)
          }
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [categories, activeSection])

  useEffect(() => {
    const updateUnderline = () => {
      const activeIndex = categories.findIndex((cat) => cat.id === activeSection)
      const activeButton = buttonRefs.current[activeIndex]
      const activeTextSpan = activeButton?.querySelector("span")

      if (activeButton && activeTextSpan && navRef.current) {
        const navRect = navRef.current.getBoundingClientRect()
        // Get width of the text span itself
        const textWidth = activeTextSpan.offsetWidth
        // Get offset of the text span relative to its button
        const textOffsetLeftInButton = activeTextSpan.offsetLeft

        // Calculate the button's left position relative to the scrollable nav container
        const buttonOffsetLeftInNav = activeButton.offsetLeft

        setUnderlineStyle({
          width: textWidth + UNDERLINE_EXTRA_PADDING,
          left: buttonOffsetLeftInNav + textOffsetLeftInButton - UNDERLINE_EXTRA_PADDING / 2,
        })
      }
    }

    const timer = setTimeout(updateUnderline, 50)
    window.addEventListener("resize", updateUnderline)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateUnderline)
    }
  }, [activeSection, categories, UNDERLINE_EXTRA_PADDING])

  const scrollToSection = (categoryId: string) => {
    const element = document.getElementById(`section-${categoryId}`)
    if (element) {
      const headerHeight = 72
      const navHeight = navRef.current?.offsetHeight || 60
      const totalOffset = headerHeight + navHeight
      const elementPosition = element.offsetTop - totalOffset
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
    // setActiveCategory(categoryId) // This is handled by scroll listener now
    setActiveSection(categoryId) // Directly set active section for immediate underline update
  }

  const handleShowAllCategories = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="bg-white border-b border-[#E8E6E3] sticky top-[72px] z-40 shadow-sm">
        <div className="flex items-center px-4">
          {" "}
          {/* Container for icon and scrollable list */}
          <button
            onClick={handleShowAllCategories}
            className="p-2 mr-2 text-gray-700 hover:text-black flex-shrink-0"
            aria-label="Show all categories"
          >
            <List className="w-6 h-6" />
          </button>
          <div ref={navRef} className="flex-grow flex space-x-1 overflow-x-auto scrollbar-hide py-3 relative">
            {categories.map((category, index) => (
              <button
                key={category.id}
                ref={(el) => (buttonRefs.current[index] = el)}
                onClick={() => scrollToSection(category.id)}
                className={`
                whitespace-nowrap text-sm font-medium transition-colors min-w-fit relative
                py-2 px-3
                ${activeSection === category.id ? "text-[#8B7355]" : "text-[#6B6B6B] hover:text-[#2D2A26]"}
              `}
              >
                <span>{category.name}</span>
              </button>
            ))}
            <div
              className="absolute bottom-0 h-1 bg-[#8B7355] transition-all duration-300 ease-out rounded-t-sm"
              style={{
                width: `${underlineStyle.width}px`,
                transform: `translateX(${underlineStyle.left}px)`,
              }}
            />
          </div>
        </div>
      </div>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        activeCategoryId={activeSection}
        onSelectCategory={scrollToSection}
      />
    </>
  )
}
