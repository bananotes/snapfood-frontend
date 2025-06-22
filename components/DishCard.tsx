'use client';

import { useRouter } from 'next/navigation';
import type { Dish } from '@/contexts/AppContext';
import Image from 'next/image';

interface DishCardProps {
  dish: Dish;
  onClick?: () => void;
}

export default function DishCard({ dish, onClick }: DishCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (dish.id) {
      // 导航到菜品详情页
      router.push(`/dish/${dish.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] group">
      <div className="aspect-square relative overflow-hidden rounded-t-xl">
        <Image
          src="/placeholder.jpg"
          alt={dish.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          crossOrigin="anonymous"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {dish.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">{dish.gen_desc}</p>

        {dish.price && (
          <p className="text-md font-semibold text-gray-800 mt-2">
            {dish.price}
          </p>
        )}
      </div>
    </div>
  );
}
