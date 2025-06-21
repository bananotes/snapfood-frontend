"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

export type AppState = "idle" | "ocr_processing" | "querying" | "show_cards" | "error"

export interface Dish {
  name: string
  rating: number
  photoUrl: string
  summary: string
  price?: string
  category: string
  description?: string
}

export interface Category {
  id: string
  name: string
  count: number
}

interface AppContextType {
  state: AppState
  dishes: Dish[]
  categories: Category[]
  activeCategory: string
  progress: number
  error: string | null
  isSearchActive: boolean
  setState: (state: AppState) => void
  setDishes: (dishes: Dish[]) => void
  setCategories: (categories: Category[]) => void
  setActiveCategory: (category: string) => void
  setProgress: (progress: number) => void
  setError: (error: string) => void
  clearError: () => void
  toggleSearch: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

type Action =
  | { type: "SET_STATE"; payload: AppState }
  | { type: "SET_DISHES"; payload: Dish[] }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "SET_ACTIVE_CATEGORY"; payload: string }
  | { type: "SET_PROGRESS"; payload: number }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "TOGGLE_SEARCH" }

interface State {
  state: AppState
  dishes: Dish[]
  categories: Category[]
  activeCategory: string
  progress: number
  error: string | null
  isSearchActive: boolean
}

const initialState: State = {
  state: "idle",
  dishes: [],
  categories: [],
  activeCategory: "推荐",
  progress: 0,
  error: null,
  isSearchActive: false,
}

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, state: action.payload }
    case "SET_DISHES":
      return { ...state, dishes: action.payload }
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload }
    case "SET_ACTIVE_CATEGORY":
      return { ...state, activeCategory: action.payload }
    case "SET_PROGRESS":
      return { ...state, progress: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, state: "error" }
    case "CLEAR_ERROR":
      return { ...state, error: null, state: "idle" }
    case "TOGGLE_SEARCH":
      return { ...state, isSearchActive: !state.isSearchActive }
    default:
      return state
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const contextValue: AppContextType = {
    ...state,
    setState: (newState: AppState) => dispatch({ type: "SET_STATE", payload: newState }),
    setDishes: (dishes: Dish[]) => dispatch({ type: "SET_DISHES", payload: dishes }),
    setCategories: (categories: Category[]) => dispatch({ type: "SET_CATEGORIES", payload: categories }),
    setActiveCategory: (category: string) => dispatch({ type: "SET_ACTIVE_CATEGORY", payload: category }),
    setProgress: (progress: number) => dispatch({ type: "SET_PROGRESS", payload: progress }),
    setError: (error: string) => dispatch({ type: "SET_ERROR", payload: error }),
    clearError: () => dispatch({ type: "CLEAR_ERROR" }),
    toggleSearch: () => dispatch({ type: "TOGGLE_SEARCH" }),
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
