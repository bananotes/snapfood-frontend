'use client';

import { Plus, Star, Clock, MapPin } from 'lucide-react';
import type { Dish } from '@/contexts/AppContext';
import Image from 'next/image';

interface MobileDishListItemProps {
  dish: Dish;
  onClick?: () => void;
}

export default function MobileDishListItem({
  dish,
  onClick,
}: MobileDishListItemProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border-b border-[#F5F4F2] active:bg-[#FAFAF9] transition-colors touch-manipulation">
      <div className="flex p-4">
        {/* Dish Image */}
        <div className="relative flex-shrink-0 mr-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F5F4F2] shadow-sm">
            <Image
              src="/placeholder.jpg"
              alt={dish.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>

          {/* Quick Add Button */}
          <button
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-[#E8E6E3] hover:bg-[#FAFAF9] transition-colors active:scale-95 touch-manipulation"
            onClick={e => {
              e.stopPropagation();
              // Handle quick add logic
            }}>
            <Plus className="w-4 h-4 text-[#8B7355]" />
          </button>
        </div>

        {/* Dish Information */}
        <div className="flex-1 min-w-0">
          {/* Title and Category */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-[#2D2A26] mb-1 line-clamp-2 leading-tight">
                {dish.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 bg-[#F5F4F2] text-[#6B6B6B] text-xs rounded-full">
                  {dish.category}
                </span>
                {dish.vegen_desc && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    素食
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between mb-2">
            {dish.price && (
              <span className="text-lg font-bold text-[#FF6D28]">
                {dish.price}
              </span>
            )}
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-[#6B6B6B]">4.5</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#6B6B6B] line-clamp-2 leading-relaxed mb-2">
            {dish.gen_desc || dish.desc || '暂无描述'}
          </p>

          {/* Additional Info */}
          <div className="flex items-center space-x-4 text-xs text-[#6B6B6B]">
            {dish.spice_level && (
              <div className="flex items-center">
                <span className="mr-1">🌶️</span>
                <span>{dish.spice_level}/5</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>5-10分钟</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span>热门</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
