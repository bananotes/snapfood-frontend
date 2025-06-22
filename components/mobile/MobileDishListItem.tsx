'use client';

import { memo } from 'react';
import type { Dish } from '@/contexts/AppContext';
import Image from 'next/image';
import { useDishThumbnail } from '@/hooks/useDishImage';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface MobileDishListItemProps {
  dish: Dish;
  onClick: (dish: Dish) => void;
}

function MobileDishListItem({ dish, onClick }: MobileDishListItemProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: '200px',
  });

  const { thumbnailUrl, isLoading, error } = useDishThumbnail(
    dish.name,
    dish.category,
    isIntersecting,
  );

  const displayImage = thumbnailUrl || '/placeholder.jpg';

  return (
    <div
      ref={ref}
      onClick={() => onClick(dish)}
      className="flex items-center justify-between p-4 hover:bg-[#FAFAF9] cursor-pointer transition-colors active:bg-[#F5F4F2]">
      <div className="flex-1 pr-4">
        <h3 className="text-base font-medium text-[#2D2A26] mb-1 line-clamp-2 leading-tight">
          {dish.name}
        </h3>
        <p className="text-sm text-[#6B6B6B] line-clamp-2">{dish.gen_desc}</p>
        <div className="flex items-center space-x-2 mt-2">
          {dish.price && (
            <span className="text-lg font-semibold text-[#2D2A26]">
              {dish.price}
            </span>
          )}
          {dish.vegen_desc && (
            <>
              <span className="text-[#6B6B6B]">•</span>
              <span className="text-sm text-green-700">素食</span>
            </>
          )}
        </div>
      </div>

      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F5F4F2] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}

          <Image
            src={displayImage}
            alt={dish.name}
            width={80}
            height={80}
            className={`w-full h-full object-cover ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            crossOrigin="anonymous"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.jpg';
              target.alt = '图片加载失败';
            }}
          />
        </div>

        {error && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-100 rounded-full shadow-md flex items-center justify-center border border-red-200">
            <span className="text-red-500 text-xs">!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(MobileDishListItem);
