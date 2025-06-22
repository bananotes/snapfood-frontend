'use client';

import { useRouter } from 'next/navigation';
import type { Dish } from '@/contexts/AppContext';
import Image from 'next/image';
import { useDishThumbnail } from '@/hooks/useDishImage';

interface DishCardProps {
  dish: Dish;
  onClick?: () => void;
}

export default function DishCard({ dish, onClick }: DishCardProps) {
  const router = useRouter();

  // 使用useDishThumbnail Hook获取菜品缩略图
  // 自动获取缩略图，当用户查看菜品时触发
  const { thumbnailUrl, isLoading, error, refetch } = useDishThumbnail(
    dish.name,
    dish.category,
    true, // 自动获取
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (dish.id) {
      // 导航到菜品详情页
      router.push(`/dish/${dish.id}`);
    }
  };

  // 确定显示的图片
  const displayImage = thumbnailUrl || '/placeholder.jpg';

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] group">
      <div className="aspect-square relative overflow-hidden rounded-t-xl">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}

        <Image
          src={displayImage}
          alt={dish.name}
          fill
          className={`object-cover group-hover:scale-105 transition-transform duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          crossOrigin="anonymous"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.jpg';
            target.alt = '图片加载失败';
          }}
        />

        {/* 错误状态指示器 */}
        {error && !isLoading && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            ⚠️
          </div>
        )}

        {/* 成功状态指示器 */}
        {thumbnailUrl && !isLoading && !error && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            ✓
          </div>
        )}
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

        {/* 图片状态提示 */}
        {error && (
          <div className="mt-2 text-xs text-red-600">
            图片加载失败，点击重试
          </div>
        )}
      </div>
    </div>
  );
}
