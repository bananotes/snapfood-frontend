'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useAppContext, type Dish } from '@/contexts/AppContext';
import MobileDishListItem from './mobile/MobileDishListItem';
import DishDetailModal from './DishDetailModal';
import Image from 'next/image';

export default function SearchOverlay() {
  const { dishes, isSearchActive, closeSearch } = useAppContext();
  const [query, setQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Reset query when overlay is closed
    if (!isSearchActive) {
      setQuery('');
      setSelectedDish(null);
      setIsModalOpen(false);
    }
  }, [isSearchActive]);

  const filteredDishes = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    return dishes.filter(
      dish =>
        dish.name.toLowerCase().includes(searchTerm) ||
        dish.gen_desc?.toLowerCase().includes(searchTerm) ||
        dish.desc?.toLowerCase().includes(searchTerm) ||
        dish.category?.toLowerCase().includes(searchTerm),
    );
  }, [query, dishes]);

  const handleDishClick = (dish: Dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDish(null);
  };

  const handleCloseSearch = () => {
    closeSearch();
  };

  if (!isSearchActive) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-white animate-fade-in">
        {/* Search Header */}
        <div className="h-16 flex items-center px-4 border-b border-[#E8E6E3] pt-safe-top">
          <button
            onClick={handleCloseSearch}
            className="p-3 mr-2 text-gray-700 hover:text-black rounded-full transition-colors active:bg-gray-100 touch-manipulation">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜索菜品..."
              autoFocus
              className="w-full h-12 pl-10 pr-10 bg-[#F5F4F2] rounded-2xl border border-transparent focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] outline-none transition-colors text-[#2D2A26] placeholder-[#6B6B6B]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-black rounded-full transition-colors active:bg-gray-100 touch-manipulation">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto h-[calc(100vh-64px)] pb-safe-bottom">
          {query.trim() && filteredDishes.length > 0 && (
            <div className="divide-y divide-[#F5F4F2]">
              {filteredDishes.map(dish => (
                <MobileDishListItem
                  key={dish.id || `search-${dish.name}-${Math.random()}`}
                  dish={dish}
                  onClick={() => handleDishClick(dish)}
                />
              ))}
            </div>
          )}

          {query.trim() && filteredDishes.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 bg-[#F5F4F2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#6B6B6B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2D2A26] mb-2">
                未找到相关菜品
              </h3>
              <p className="text-[#6B6B6B]">
                没有找到包含 "{query}" 的菜品，请尝试其他关键词
              </p>
            </div>
          )}

          {!query.trim() && (
            <div className="flex flex-col items-center justify-center text-center pt-20 px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-[#8B7355] to-[#6B5B47] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#2D2A26] mb-3">
                搜索您喜欢的菜品
              </h3>
              <p className="text-[#6B6B6B] leading-relaxed max-w-sm">
                输入菜品名称、描述或分类来查找您想要的美食
              </p>

              {/* Search Tips */}
              <div className="mt-8 w-full max-w-sm">
                <h4 className="font-semibold text-[#2D2A26] mb-3 text-sm">
                  💡 搜索技巧
                </h4>
                <div className="space-y-2 text-xs text-[#6B6B6B]">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#8B7355] rounded-full mr-2"></span>
                    <span>输入菜品名称，如"宫保鸡丁"</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#8B7355] rounded-full mr-2"></span>
                    <span>搜索分类，如"主菜"、"汤类"</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#8B7355] rounded-full mr-2"></span>
                    <span>搜索特色，如"素食"、"辣"</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 菜品详情浮空窗口 */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
