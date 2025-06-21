"use client"

import { useEffect, useState, useRef } from "react"
import { Search, ChevronLeft } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext" // Assuming this might be used

export default function Header() {
  const { appState, setState, setSearchQuery, searchQuery } = useAppContext() // Example context usage
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0) // Default to 0, measure dynamically

  // Measure header height
  useEffect(() => {
    if (headerRef.current) {
      // Use a common variable for header height, e.g., from CSS or a fixed value
      // For dynamic measurement:
      setHeaderHeight(headerRef.current.offsetHeight)
      // Or, if using CSS variable:
      // const cssVarHeight = getComputedStyle(headerRef.current).getPropertyValue('--header-height').trim();
      // if (cssVarHeight.endsWith('px')) {
      //   setHeaderHeight(parseInt(cssVarHeight, 10));
      // }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return
      // Use measured headerHeight or a fixed value if preferred.
      // If headerHeight is 0 (not measured yet), use a sensible default or don't hide.
      const currentMeasuredHeight = headerRef.current.offsetHeight || 60 // Fallback height

      const currentScrollY = window.scrollY
      const scrollThreshold = 5 // To prevent flickering

      if (currentScrollY < lastScrollY.current - scrollThreshold || currentScrollY < currentMeasuredHeight) {
        setIsVisible(true) // Show if scrolling up or near the top
      } else if (currentScrollY > lastScrollY.current + scrollThreshold && currentScrollY > currentMeasuredHeight) {
        setIsVisible(false) // Hide if scrolling down and past header
      }
      lastScrollY.current = currentScrollY
    }

    // Only attach scroll listener if header is meant to be hideable (e.g., not in camera view)
    // This example assumes the header is part of the main scrollable page.
    if (appState !== "camera_scan" && appState !== "ocr_processing" && appState !== "querying") {
      window.addEventListener("scroll", handleScroll, { passive: true })
    } else {
      setIsVisible(true) // Always visible during camera/processing states
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [appState, headerHeight]) // Re-run if appState changes or headerHeight is determined

  // Example: Show back button if in search results or dish details, otherwise restaurant name
  const isSearchView = appState === "search_results" || appState === "show_dish_details" // Example states

  const handleBack = () => {
    // Logic to go back, e.g., setState('show_cards') or router.back()
    if (appState === "search_results") {
      setState("show_cards") // Or previous state
      setSearchQuery("") // Clear search
    } else {
      // Handle other back scenarios
    }
  }

  // Don't render header during camera scan or initial loading states
  if (
    appState === "camera_scan" ||
    appState === "onboarding" ||
    appState === "initial_loading" ||
    appState === "ocr_processing" ||
    appState === "querying"
  ) {
    return null
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-sm transition-transform duration-300 ease-in-out flex items-center justify-between px-4 dark:text-white`}
      style={{
        height: "var(--header-height, 60px)", // Use CSS var or fallback. Ensure this var is defined in globals.css
        transform: isVisible ? "translateY(0)" : "-translateY(100%)",
      }}
    >
      {isSearchView ? (
        <button onClick={handleBack} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
      ) : (
        <h1 className="text-lg font-semibold truncate">餐厅名称</h1> // Restaurant Name
      )}

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setState(searchQuery ? "search_results" : "search_overlay")}
          className="p-2"
          aria-label="Search"
        >
          <Search size={22} />
        </button>
        {/* <button className="p-2" aria-label="Settings">
          <Settings2 size={22} />
        </button> */}
      </div>
    </header>
  )
}
