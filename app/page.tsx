'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MobileOptimizedHeader from '@/components/mobile/MobileOptimizedHeader';
import MobileCameraScanner from '@/components/mobile/MobileCameraScanner';
import ProgressBar from '@/components/ProgressBar';
import CategoryNavigation from '@/components/CategoryNavigation';
import DietaryFilterBubbles from '@/components/DietaryFilterBubbles';
import ScrollableDishList from '@/components/ScrollableDishList';
import HotdogLoadingAnimation from '@/components/HotdogLoadingAnimation';
import Toast from '@/components/Toast';
import SearchOverlay from '@/components/SearchOverlay';
import MobileOnboardingScreen from '@/components/mobile/MobileOnboardingScreen';
import MobileRestaurantSelection from '@/components/mobile/MobileRestaurantSelection';
import ErrorBoundary from '@/components/ErrorBoundary';
import TouchGestureHandler from '@/components/TouchGestureHandler';
import { useAppContext, type Dish, type Category } from '@/contexts/AppContext';
import { mockDishes, mockCategories } from '@/lib/mockData';

const queryClient = new QueryClient();

function AppContent() {
  const {
    state,
    dishes,
    categories,
    error,
    clearError,
    setDishes,
    setCategories,
    isSearchActive,
    progress,
    setState,
    setError,
    setProgress,
  } = useAppContext();

  // 临时状态存储 OCR 和 Dify 数据
  const [ocrData, setOcrData] = React.useState<{
    text: string;
    difyResponse: any;
  } | null>(null);

  // 当进入餐厅选择状态时，从 window 对象获取 OCR 数据
  React.useEffect(() => {
    if (state === 'restaurant_selection' && !ocrData) {
      const windowOcrData = (window as any).ocrData;
      if (windowOcrData) {
        setOcrData(windowOcrData);
      }
    }
  }, [state, ocrData]);

  // 解析 Dify.ai 菜品数据的函数
  const parseDishesFromDify = (difyResponse: any) => {
    try {
      console.log('Parsing dishes from Dify response:', difyResponse);

      const dishes = difyResponse?.data?.outputs?.dishes || [];
      console.log('Raw dishes from Dify:', dishes);

      if (!Array.isArray(dishes)) {
        console.warn('Dishes is not an array:', dishes);
        return [];
      }

      return dishes.map((dish: any, index: number) => ({
        id: dish.id || `dish-${index}`,
        name: dish.name || dish.title || '未知菜品',
        gen_desc: dish.gen_desc || '',
        price: dish.price
          ? `$${Number(dish.price).toFixed(2)}`
          : dish.cost || '',
        category: dish.category || dish.type || '其他',
        vegen_desc: dish.vegen_desc || '',
        spice_level: dish.spice_level,
        aller_desc: dish.aller_desc || '',
        desc: dish.desc || '',
      }));
    } catch (error) {
      console.error('Failed to parse dishes from Dify:', error);
      return [];
    }
  };

  // 解析分类数据的函数
  const parseCategoriesFromDishes = (dishes: any[]) => {
    try {
      const categoryMap = new Map<string, number>();

      dishes.forEach(dish => {
        const category = dish.category || '其他';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      return Array.from(categoryMap.entries()).map(([name, count]) => ({
        id: name,
        name,
        count,
      }));
    } catch (error) {
      console.error('Failed to parse categories:', error);
      return [];
    }
  };

  const handleRestaurantSelect = (restaurant: { id: string; name: string }) => {
    console.log('Selected restaurant:', restaurant);

    if (ocrData?.difyResponse) {
      // 先进入查询状态
      setState('querying');
      setProgress(90);

      // 模拟短暂的处理时间
      setTimeout(() => {
        // 解析真实的菜品数据
        const parsedDishes = parseDishesFromDify(ocrData.difyResponse);
        const parsedCategories = parseCategoriesFromDishes(parsedDishes);

        console.log('Parsed dishes:', parsedDishes);
        console.log('Parsed categories:', parsedCategories);

        if (parsedDishes.length > 0) {
          setDishes(parsedDishes);
          setCategories(parsedCategories);
          setProgress(100);
          setState('show_cards');
        } else {
          setError('未找到菜品数据，请检查 Dify.ai 响应格式');
          setState('error');
        }
      }, 1000); // 1秒的处理时间
    } else {
      setError('缺少 Dify.ai 响应数据');
      setState('error');
    }
  };

  // 触摸手势处理函数
  const handleSwipeDown = () => {
    if (state === 'show_cards') {
      // 下拉刷新 - 返回餐厅选择
      setState('restaurant_selection');
    }
  };

  const handleSwipeUp = () => {
    if (state === 'restaurant_selection') {
      // 上滑确认 - 选择第一个餐厅
      if (ocrData?.difyResponse) {
        const restaurants =
          ocrData.difyResponse?.data?.outputs?.restaurants || [];
        if (restaurants.length > 0) {
          handleRestaurantSelect(restaurants[0]);
        }
      }
    }
  };

  if (state === 'onboarding') {
    return (
      <ErrorBoundary>
        <TouchGestureHandler>
          <MobileOnboardingScreen />
        </TouchGestureHandler>
      </ErrorBoundary>
    );
  }

  if (state === 'idle') {
    return (
      <ErrorBoundary>
        <TouchGestureHandler>
          <MobileCameraScanner />
        </TouchGestureHandler>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <TouchGestureHandler
        onSwipeDown={handleSwipeDown}
        onSwipeUp={handleSwipeUp}
        disabled={state === 'ocr_processing' || state === 'querying'}>
        <div className="min-h-screen bg-[#FAFAF9]">
          <ProgressBar />
          <MobileOptimizedHeader />
          <main className={isSearchActive ? 'hidden' : ''}>
            {(state === 'ocr_processing' || state === 'querying') && (
              <div className="px-4 flex items-center justify-center min-h-[calc(100vh-72px)]">
                <HotdogLoadingAnimation progress={progress} />
              </div>
            )}
            {state === 'restaurant_selection' && ocrData && (
              <MobileRestaurantSelection
                ocrText={ocrData.text}
                difyResponse={ocrData.difyResponse}
                onSelect={handleRestaurantSelect}
              />
            )}
            {state === 'show_cards' && (
              <>
                <CategoryNavigation categories={categories} />
                <DietaryFilterBubbles />
                <ScrollableDishList dishes={dishes} categories={categories} />
              </>
            )}
            {state === 'error' && (
              <div className="px-4 py-12">
                <div className="text-center">
                  <div className="text-red-500 mb-4">处理失败，请重试</div>
                  <button
                    onClick={clearError}
                    className="px-6 py-3 bg-[#8B7355] text-white rounded-2xl hover:bg-[#6B5B47] transition-colors font-medium touch-manipulation">
                    重新开始
                  </button>
                </div>
              </div>
            )}
          </main>
          {error && <Toast message={error} type="error" onClose={clearError} />}
          <SearchOverlay />
        </div>
      </TouchGestureHandler>
    </ErrorBoundary>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
