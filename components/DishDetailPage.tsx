'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useAppContext, type Dish } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ImageCarousel from './ImageCarousel';
import { useDishImage } from '@/hooks/useDishImage';
import HotdogLoadingAnimation from './HotdogLoadingAnimation';

interface DishDetailPageProps {
  dishId: string;
}

export default function DishDetailPage({ dishId }: DishDetailPageProps) {
  const router = useRouter();
  const { getDishById } = useAppContext();
  const [dish, setDish] = useState<Dish | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingDish, setIsLoadingDish] = useState(true);

  useEffect(() => {
    const foundDish = getDishById(dishId);
    setDish(foundDish || null);
    setIsLoadingDish(false);
  }, [dishId, getDishById]);

  const {
    imageUrls,
    isLoading: isLoadingImages,
    error: imageError,
    refetch,
  } = useDishImage(
    {
      name: dish?.name || '',
      desc: dish?.desc || '',
      gen_desc: dish?.gen_desc || '',
      category: dish?.category || '',
      count: 6,
      place_id: dish?.id || '',
    },
    !dish, // 如果没有dish数据，则跳过请求
  );

  if (isLoadingDish) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <HotdogLoadingAnimation progress={50} />
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-xl font-semibold mb-4">找不到菜品</h2>
        <p className="text-gray-600 mb-6">
          该菜品信息不存在或已删除，请返回重试。
        </p>
        <Button onClick={() => router.back()}>返回上一页</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-20 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold truncate">{dish.name}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                /* Share logic */
              }}
              className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto p-4 pb-24">
        {/* Image Carousel */}
        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
          {isLoadingImages && (
            <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}
          {imageError && (
            <div className="aspect-[4/3] bg-red-50 flex flex-col items-center justify-center text-center p-4">
              <p className="text-red-600 font-medium mb-2">图片加载失败</p>
              <p className="text-xs text-gray-500 mb-3">{imageError}</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                重试
              </Button>
            </div>
          )}
          {!isLoadingImages && !imageError && (
            <ImageCarousel
              images={imageUrls}
              fallbackImage="/placeholder.jpg"
              className="w-full"
            />
          )}
        </div>

        {/* Dish Info */}
        <div className="space-y-4">
          <Badge variant="secondary">{dish.category}</Badge>
          <h2 className="text-3xl font-bold">{dish.name}</h2>
          {dish.price && (
            <p className="text-3xl font-bold text-[#FF6D28]">{dish.price}</p>
          )}
          <p className="text-gray-600 leading-relaxed">{dish.gen_desc}</p>
          {dish.desc && dish.desc !== dish.gen_desc && (
            <p className="text-sm text-gray-500">{dish.desc}</p>
          )}

          <div className="py-4">
            <Button
              size="lg"
              className="w-full"
              onClick={() => setIsFavorite(!isFavorite)}>
              <Heart
                className={`w-5 h-5 mr-2 ${
                  isFavorite ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              {isFavorite ? '已收藏' : '添加到收藏'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
