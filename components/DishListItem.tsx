'use client';

import { Plus } from 'lucide-react';
import type { Dish } from '@/contexts/AppContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface DishListItemProps {
  dish: Dish;
  onClick?: () => void;
}

export default function DishListItem({ dish, onClick }: DishListItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (dish.id) {
      router.push(`/dish/${dish.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-4 hover:bg-[#FAFAF9] cursor-pointer transition-colors active:bg-[#F5F4F2]">
      <div className="flex-1 pr-4">
        <h3 className="text-base font-medium text-[#2D2A26] mb-1 line-clamp-2 leading-tight">
          {dish.name}
        </h3>

        <div className="flex items-center space-x-2 mb-2">
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

        <p className="text-sm text-[#6B6B6B] line-clamp-2">{dish.gen_desc}</p>
      </div>

      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F5F4F2]">
          <Image
            src="/placeholder.jpg"
            alt={dish.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
        <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-[#E8E6E3] hover:bg-[#FAFAF9] transition-colors">
          <Plus className="w-4 h-4 text-[#8B7355]" />
        </button>
      </div>
    </div>
  );
}
