"use client"
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "@/components/Header"
import CameraScanner from "@/components/CameraScanner"
import ProgressBar from "@/components/ProgressBar"
import CategoryNavigation from "@/components/CategoryNavigation"
import DietaryFilterBubbles from "@/components/DietaryFilterBubbles"
import ScrollableDishList from "@/components/ScrollableDishList"
// import CuteLoadingAnimation from "@/components/CuteLoadingAnimation" // Remove old
import HotdogLoadingAnimation from "@/components/HotdogLoadingAnimation" // Import new
import Toast from "@/components/Toast"
import SearchOverlay from "@/components/SearchOverlay"
import OnboardingScreen from "@/components/OnboardingScreen"
import { AppProvider, useAppContext, type Dish, type Category } from "@/contexts/AppContext"
import { mockDishes, mockCategories } from "@/lib/mockData"

const queryClient = new QueryClient()

function AppContent() {
  const { state, dishes, categories, error, clearError, setDishes, setCategories, isSearchActive, progress } =
    useAppContext() // Added progress

  React.useEffect(() => {
    if (state === "show_cards" && dishes.length === 0) {
      setDishes(mockDishes)
      setCategories(mockCategories)
    }
  }, [state, dishes.length, setDishes, setCategories])

  if (state === "onboarding") {
    return <OnboardingScreen />
  }
  if (state === "idle") {
    return <CameraScanner />
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <ProgressBar />
      <Header />
      <main className={isSearchActive ? "hidden" : ""}>
        {(state === "ocr_processing" || state === "querying") && (
          <div className="px-4 flex items-center justify-center min-h-[calc(100vh-72px)]">
            {" "}
            {/* Adjusted for centering */}
            <HotdogLoadingAnimation progress={progress} />
          </div>
        )}
        {state === "show_cards" && (
          <>
            <CategoryNavigation categories={categories} />
            <DietaryFilterBubbles />
            <ScrollableDishList dishes={dishes} categories={categories} />
          </>
        )}
        {state === "error" && (
          <div className="px-4 py-12">
            <div className="text-center">
              <div className="text-red-500 mb-4">Processing failed, please try again</div>
              <button
                onClick={clearError}
                className="px-6 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5B47] transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>
      {error && <Toast message={error} type="error" onClose={clearError} />}
      <SearchOverlay />
    </div>
  )
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </QueryClientProvider>
  )
}
