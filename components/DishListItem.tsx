'use client';

import { useRouter } from 'next/navigation';
import type { Dish } from '@/contexts/AppContext';
import Image from 'next/image';
import { useDishThumbnail } from '@/hooks/useDishImage';

interface DishListItemProps {
  dish: Dish;
  onClick?: () => void;
}

export default function DishListItem({ dish, onClick }: DishListItemProps) {
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
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100">
      <div className="flex">
        {/* 图片区域 */}
        <div className="w-24 h-24 relative overflow-hidden rounded-l-lg">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}

          <Image
            src={displayImage}
            alt={dish.name}
            fill
            className={`object-cover ${
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
            <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
              ⚠️
            </div>
          )}

          {/* 成功状态指示器 */}
          {thumbnailUrl && !isLoading && !error && (
            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
              ✓
            </div>
          )}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                {dish.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {dish.gen_desc}
              </p>
              {dish.price && (
                <p className="text-sm font-semibold text-gray-800">
                  {dish.price}
                </p>
              )}
            </div>
          </div>

          {/* 图片状态提示 */}
          {error && (
            <div className="text-xs text-red-600 mt-1">图片加载失败</div>
          )}
        </div>
      </div>
    </div>
  );
}
