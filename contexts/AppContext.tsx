'use client';

import { createContext, useContext, useReducer, type ReactNode } from 'react';

// Add 'onboarding' to AppState
export type AppState =
  | 'onboarding'
  | 'idle'
  | 'ocr_processing'
  | 'restaurant_selection'
  | 'querying'
  | 'show_cards'
  | 'error';

export interface Dish {
  id?: string; // 菜品ID
  name: string; // 菜品名称
  gen_desc?: string; // 菜品描述 (真实字段)
  price?: string; // 价格
  category: string; // 分类
  vegen_desc?: string; // 素食描述 (真实字段)
  spice_level?: number; // 辣度等级 (真实字段)
  aller_desc?: string; // 过敏描述 (真实字段)
  desc?: string; // 简短描述 (真实字段)
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

interface AppContextType {
  state: AppState;
  dishes: Dish[];
  categories: Category[];
  activeCategory: string;
  progress: number;
  error: string | null;
  isSearchActive: boolean;
  setState: (state: AppState) => void;
  setDishes: (dishes: Dish[]) => void;
  setCategories: (categories: Category[]) => void;
  setActiveCategory: (category: string) => void;
  setProgress: (progress: number) => void;
  setError: (error: string) => void;
  clearError: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'SET_DISHES'; payload: Dish[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_ACTIVE_CATEGORY'; payload: string }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'CLOSE_SEARCH' };

interface State {
  state: AppState;
  dishes: Dish[];
  categories: Category[];
  activeCategory: string;
  progress: number;
  error: string | null;
  isSearchActive: boolean;
}

// Set initial state to 'onboarding'
const initialState: State = {
  state: 'onboarding', // Changed from "idle"
  dishes: [],
  categories: [],
  activeCategory: '推荐',
  progress: 0,
  error: null,
  isSearchActive: false,
};

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STATE':
      // When clearing error, if current state is error, go to onboarding, else idle
      if (action.payload === 'idle' && state.state === 'error') {
        return { ...state, state: 'onboarding', error: null };
      }
      // Close search when changing states (except when going to show_cards)
      if (action.payload !== 'show_cards' && state.isSearchActive) {
        return { ...state, state: action.payload, isSearchActive: false };
      }
      return { ...state, state: action.payload };
    case 'SET_DISHES':
      return { ...state, dishes: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        state: 'error',
        isSearchActive: false,
      };
    case 'CLEAR_ERROR':
      // When error is cleared, go back to onboarding screen
      return {
        ...state,
        error: null,
        state: 'onboarding',
        isSearchActive: false,
      };
    case 'TOGGLE_SEARCH':
      // Only allow search when in show_cards state
      if (state.state === 'show_cards') {
        return { ...state, isSearchActive: !state.isSearchActive };
      }
      return state;
    case 'CLOSE_SEARCH':
      return { ...state, isSearchActive: false };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const contextValue: AppContextType = {
    ...state,
    setState: (newState: AppState) =>
      dispatch({ type: 'SET_STATE', payload: newState }),
    setDishes: (dishes: Dish[]) =>
      dispatch({ type: 'SET_DISHES', payload: dishes }),
    setCategories: (categories: Category[]) =>
      dispatch({ type: 'SET_CATEGORIES', payload: categories }),
    setActiveCategory: (category: string) =>
      dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: category }),
    setProgress: (progress: number) =>
      dispatch({ type: 'SET_PROGRESS', payload: progress }),
    setError: (error: string) =>
      dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    toggleSearch: () => dispatch({ type: 'TOGGLE_SEARCH' }),
    closeSearch: () => dispatch({ type: 'CLOSE_SEARCH' }),
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
