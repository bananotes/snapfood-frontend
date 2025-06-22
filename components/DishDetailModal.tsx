'use client';

import { useEffect, useState } from 'react';
import { X, Heart, Share2 } from 'lucide-react';
import type { Dish } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ImageCarousel from './ImageCarousel';
import { useDishImage } from '@/hooks/useDishImage';

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishDetailModal({
  dish,
  isOpen,
  onClose,
}: DishDetailModalProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // 只有当弹窗打开且有菜品时才获取图片
  const shouldSkip = !isOpen || !dish;

  const { imageUrls, isLoading, error, refetch } = useDishImage(
    {
      name: dish?.name || '',
      desc: dish?.desc || '',
      gen_desc: dish?.gen_desc || '',
      category: dish?.category || '',
      count: 6,
      place_id: dish?.id || '',
    },
    shouldSkip, // 使用skip参数
  );

  // 当菜品改变时，重置收藏状态
  useEffect(() => {
    setIsFavorite(false);
  }, [dish?.id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !dish) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        {/* Header with close button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900">菜品详情</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* 菜品图片轮播 */}
          <div className="mb-6">
            {isLoading && (
              <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-500">正在获取菜品图片...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-sm text-gray-500 mb-2">图片加载失败</p>
                  <p className="text-xs text-gray-400 mb-3">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refetch}
                    className="text-xs">
                    重试
                  </Button>
                </div>
              </div>
            )}

            {!isLoading && !error && (
              <ImageCarousel
                images={imageUrls}
                className="w-full"
                showIndicators={true}
                showControls={true}
                autoPlay={false}
                fallbackImage="/placeholder.jpg"
              />
            )}

            {/* 图片状态提示 */}
            {!isLoading && !error && imageUrls.length === 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-3 rounded">
                <p className="text-sm text-yellow-800">
                  📸 <strong>暂无图片</strong> -
                  未找到相关菜品图片，显示占位图片
                </p>
              </div>
            )}

            {!isLoading && !error && imageUrls.length > 0 && (
              <div className="bg-green-50 border-l-4 border-green-400 p-3 mt-3 rounded">
                <p className="text-sm text-green-800">
                  📸 <strong>菜品图片</strong> - 已获取 {imageUrls.length}{' '}
                  张相关图片
                </p>
              </div>
            )}
          </div>

          {/* 菜品基本信息 */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {dish.name}
                  </h1>
                  <Badge variant="secondary">{dish.category}</Badge>
                  {dish.vegen_desc && (
                    <Badge className="bg-green-100 text-green-800">素食</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  {dish.price && (
                    <span className="text-lg font-semibold text-[#FF6D28]">
                      {dish.price}
                    </span>
                  )}
                  {dish.desc && (
                    <span className="text-sm text-gray-500">{dish.desc}</span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">{dish.gen_desc}</p>
              </div>
            </div>

            {/* 详细描述 */}
            {dish.gen_desc && dish.desc && dish.gen_desc !== dish.desc && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  详细描述
                </h3>
                <p className="text-gray-600 leading-relaxed">{dish.gen_desc}</p>
              </div>
            )}
          </div>

          {/* 额外信息 */}
          <div className="space-y-4">
            {/* 辣度信息 */}
            {dish.spice_level && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">辣度等级</h4>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < dish.spice_level! ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-orange-700 ml-2">
                    {dish.spice_level}/5
                  </span>
                </div>
              </div>
            )}

            {/* 过敏信息 */}
            {dish.aller_desc && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">过敏信息</h4>
                <p className="text-sm text-red-700">{dish.aller_desc}</p>
              </div>
            )}

            {/* 素食信息 */}
            {dish.vegen_desc && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">素食信息</h4>
                <p className="text-sm text-green-700">{dish.vegen_desc}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between rounded-b-2xl">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}>
              <Heart
                className={`w-4 h-4 mr-2 ${
                  isFavorite ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              {isFavorite ? '已收藏' : '收藏'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>
          <Button onClick={onClose}>关闭</Button>
        </div>
      </div>
    </div>
  );
}
