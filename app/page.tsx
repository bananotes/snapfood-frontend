"use client"
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "@/components/Header"
import UploadZone from "@/components/UploadZone"
import ProgressBar from "@/components/ProgressBar"
import CategoryNavigation from "@/components/CategoryNavigation"
import DietaryFilterBubbles from "@/components/DietaryFilterBubbles"
import ScrollableDishList from "@/components/ScrollableDishList"
import CuteLoadingAnimation from "@/components/CuteLoadingAnimation"
import Toast from "@/components/Toast"
import SearchOverlay from "@/components/SearchOverlay" // Import SearchOverlay
import { AppProvider, useAppContext, type Dish, type Category } from "@/contexts/AppContext"

const queryClient = new QueryClient()

function AppContent() {
  const { state, dishes, categories, error, clearError, setDishes, setCategories, isSearchActive } = useAppContext()

  // Set mock dishes and categories when showing cards state
  React.useEffect(() => {
    if (state === "show_cards" && dishes.length === 0) {
      const mockDishes: Dish[] = [
        // Recommended dishes
        {
          name: "Kung Pao Chicken",
          rating: 4.5,
          price: "$16.80",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Classic Sichuan dish with tender chicken, peanuts, and dried chilies",
          description: "Premium chicken breast with roasted peanuts and dried chilies, sweet and spicy",
          category: "Recommended",
        },
        {
          name: "Mapo Tofu",
          rating: 4.2,
          price: "$13.20",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Silky tofu in spicy Sichuan sauce, perfect with rice",
          description: "Traditional recipe with silky tofu, numbing and spicy but not overwhelming",
          category: "Recommended",
        },
        {
          name: "Sweet & Sour Pork",
          rating: 4.7,
          price: "$18.50",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Crispy pork with tangy sweet and sour sauce, family favorite",
          description: "Premium pork tenderloin with crispy coating, loved by all ages",
          category: "Recommended",
        },
        // Hot dishes
        {
          name: "Braised Pork Belly",
          rating: 4.6,
          price: "$22.00",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Rich and tender, melts in your mouth, traditional Jiangnan style",
          description: "Selected pork belly, slow-braised, glossy red color",
          category: "Hot Dishes",
        },
        {
          name: "Steamed Sea Bass",
          rating: 4.4,
          price: "$28.00",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Fresh and tender fish, light and healthy, preserves natural flavor",
          description: "Fresh sea bass, steamed to perfection, high nutritional value",
          category: "Hot Dishes",
        },
        {
          name: "Sichuan Boiled Fish",
          rating: 4.3,
          price: "$24.50",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Spicy and aromatic, tender fish in rich broth",
          description: "Fresh grass carp with bean sprouts, numbing and spicy delight",
          category: "Hot Dishes",
        },
        // Vegetables
        {
          name: "Garlic Broccoli",
          rating: 4.1,
          price: "$11.50",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Fresh and crisp vegetable, nutritious and aromatic",
          description: "Fresh broccoli, stir-fried to maintain crisp texture",
          category: "Vegetables",
        },
        {
          name: "Spicy Shredded Potatoes",
          rating: 4.0,
          price: "$9.80",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Classic home-style dish, tangy and spicy, crisp and refreshing",
          description: "Finely cut potato strips, perfectly seasoned",
          category: "Vegetables",
        },
        {
          name: "Dry-Fried Green Beans",
          rating: 4.2,
          price: "$12.50",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Sichuan classic, aromatic green beans with rich toppings",
          description: "Green beans stir-fried until slightly charred, with minced pork and pickles",
          category: "Vegetables",
        },
        // Appetizers
        {
          name: "Soup Dumplings",
          rating: 4.8,
          price: "$15.80",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Thin skin, rich filling, juicy broth, Shanghai classic snack",
          description: "Freshly made and steamed, bite-sized perfection",
          category: "Appetizers",
        },
        {
          name: "Pan-Fried Dumplings",
          rating: 4.5,
          price: "$12.80",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Golden crispy bottom, juicy and flavorful filling",
          description: "Pork and chive filling, pan-fried technique, crispy outside tender inside",
          category: "Appetizers",
        },
        {
          name: "Steamed Egg Custard",
          rating: 4.3,
          price: "$8.50",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Silky smooth, nutritious, suitable for all ages",
          description: "Steamed eggs with silky texture, garnished with scallions",
          category: "Appetizers",
        },
        {
          name: "Cold Sesame Noodles",
          rating: 4.4,
          price: "$10.50",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Refreshing cold noodles with rich sesame sauce",
          description: "Perfect summer dish, creamy sesame dressing with fresh vegetables",
          category: "Appetizers",
        },
        {
          name: "Cucumber Salad",
          rating: 4.1,
          price: "$7.80",
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: "Light and refreshing, perfect palate cleanser",
          description: "Crisp cucumbers with garlic and vinegar dressing",
          category: "Appetizers",
        },
      ]

      const mockCategories: Category[] = [
        { id: "Recommended", name: "Recommended", count: 3 },
        { id: "Hot Dishes", name: "Hot Dishes", count: 3 },
        { id: "Vegetables", name: "Vegetables", count: 3 },
        { id: "Appetizers", name: "Appetizers", count: 5 },
      ]

      setDishes(mockDishes)
      setCategories(mockCategories)
    }
  }, [state, dishes.length, setDishes, setCategories])

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <ProgressBar />
      <Header />

      <main className={isSearchActive ? "hidden" : ""}>
        {state === "idle" && (
          <div className="px-4 py-8">
            <UploadZone />
          </div>
        )}

        {(state === "ocr_processing" || state === "querying") && (
          <div className="px-4">
            <CuteLoadingAnimation />
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
              <div className="text-red-600 mb-4">Processing failed, please try again</div>
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

      {/* Render SearchOverlay here */}
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
