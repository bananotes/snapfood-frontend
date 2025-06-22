'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DishDetailPageProps {
  dishId: string;
}

export default function DishDetailPage({ dishId }: DishDetailPageProps) {
  const router = useRouter();
  const { dishes } = useAppContext();
  const [isFavorite, setIsFavorite] = useState(false);

  // 查找当前菜品
  const dish = dishes.find(d => d.id === dishId);

  useEffect(() => {
    // 如果没有菜品数据，返回上一页
    if (dishes.length === 0) {
      console.log('No dishes data available, redirecting back');
      router.back();
      return;
    }

    // 如果找不到指定的菜品，也返回上一页
    if (!dish) {
      console.log(`Dish with ID ${dishId} not found, redirecting back`);
      router.back();
      return;
    }
  }, [dishes, dish, dishId, router]);

  // 如果正在加载或没有数据，显示加载状态
  if (dishes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">正在加载菜品信息...</p>
        </div>
      </div>
    );
  }

  // 如果找不到指定的菜品，显示错误状态
  if (!dish) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">未找到指定的菜品</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2">
            <ChevronLeft className="w-5 h-5" />
            <span>返回</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? 'text-red-500' : 'text-gray-500'}>
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
              />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* 菜品主图 */}
        <div className="relative bg-white">
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src="/placeholder.jpg"
              alt={dish.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 图片提示 */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
            <p className="text-sm text-blue-800">
              📸 <strong>菜品图片</strong> -
              后端同学正在开发真实的菜品图片API，当前显示占位图片
            </p>
          </div>
        </div>

        {/* 菜品基本信息 */}
        <div className="bg-white p-6">
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

        {/* 菜品信息说明 */}
        <div className="bg-white p-6 mt-4 mb-8">
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              菜品信息说明
            </h3>
            <div className="space-y-2 text-sm text-green-700">
              <p>
                ✅ <strong>菜品名称</strong> - 来自OCR识别的真实数据
              </p>
              <p>
                ✅ <strong>菜品描述</strong> - 来自OCR识别的真实数据
              </p>
              <p>
                ✅ <strong>菜品分类</strong> - 来自OCR识别的真实数据
              </p>
              <p>
                ✅ <strong>价格信息</strong> - 来自OCR识别的真实数据
              </p>
              <p>
                ✅ <strong>素食信息</strong> - 来自OCR识别的真实数据
              </p>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                💡 <strong>简化版本说明</strong> -
                当前版本只显示OCR能够识别的真实信息，营养信息、过敏信息等功能将在后续版本中添加。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
