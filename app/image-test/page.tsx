'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDishImage } from '@/hooks/useDishImage';
import { useDishThumbnail } from '@/hooks/useDishImage';
import ImageCarousel from '@/components/ImageCarousel';

export default function ImageTestPage() {
  const [testParams, setTestParams] = useState({
    name: '宫保鸡丁',
    desc: '经典川菜，鸡肉配花生米',
    gen_desc: '麻辣鲜香的经典川菜',
    category: '川菜',
    count: 3,
  });

  const [thumbnailParams, setThumbnailParams] = useState({
    name: '麻婆豆腐',
    category: '川菜',
  });

  // 测试完整图片获取
  const { imageUrls, isLoading, error, refetch } = useDishImage(testParams);

  // 测试缩略图获取
  const {
    thumbnailUrl,
    isLoading: thumbnailLoading,
    error: thumbnailError,
    refetch: refetchThumbnail,
  } = useDishThumbnail(thumbnailParams.name, thumbnailParams.category);

  const handleTestChange = (field: string, value: string) => {
    setTestParams(prev => ({
      ...prev,
      [field]: field === 'count' ? parseInt(value) || 1 : value,
    }));
  };

  const handleThumbnailChange = (field: string, value: string) => {
    setThumbnailParams(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">图片获取功能测试</h1>
        <p className="text-gray-600 mb-6">测试菜品图片获取API和缩略图功能</p>
      </div>

      {/* 环境变量检查 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 环境配置检查
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  process.env.NODE_ENV === 'development'
                    ? 'default'
                    : 'secondary'
                }>
                {process.env.NODE_ENV}
              </Badge>
              <span className="text-sm text-gray-600">运行环境</span>
            </div>
            <div className="text-sm text-gray-600">
              <strong>注意：</strong>请确保已设置 DIFY_API_KEY_MATCHER 环境变量
            </div>
            <div className="text-xs text-gray-500">
              创建 .env.local 文件并添加：DIFY_API_KEY_MATCHER=your_api_key_here
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 完整图片获取测试 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📸 完整图片获取测试
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">菜品名称</Label>
              <Input
                id="name"
                value={testParams.name}
                onChange={e => handleTestChange('name', e.target.value)}
                placeholder="输入菜品名称"
              />
            </div>
            <div>
              <Label htmlFor="category">分类</Label>
              <Input
                id="category"
                value={testParams.category}
                onChange={e => handleTestChange('category', e.target.value)}
                placeholder="输入分类"
              />
            </div>
            <div>
              <Label htmlFor="desc">描述</Label>
              <Input
                id="desc"
                value={testParams.desc}
                onChange={e => handleTestChange('desc', e.target.value)}
                placeholder="输入描述"
              />
            </div>
            <div>
              <Label htmlFor="gen_desc">通用描述</Label>
              <Input
                id="gen_desc"
                value={testParams.gen_desc}
                onChange={e => handleTestChange('gen_desc', e.target.value)}
                placeholder="输入通用描述"
              />
            </div>
            <div>
              <Label htmlFor="count">图片数量</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="10"
                value={testParams.count}
                onChange={e => handleTestChange('count', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={refetch} disabled={isLoading}>
              {isLoading ? '获取中...' : '获取图片'}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setTestParams({
                  name: '宫保鸡丁',
                  desc: '经典川菜，鸡肉配花生米',
                  gen_desc: '麻辣鲜香的经典川菜',
                  category: '川菜',
                  count: 3,
                })
              }>
              重置
            </Button>
          </div>

          {/* 状态显示 */}
          <div className="space-y-2">
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                正在获取图片...
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                <div className="text-red-700">
                  <strong>错误：</strong> {error}
                </div>
              </div>
            )}

            {!isLoading && !error && imageUrls.length > 0 && (
              <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                <div className="text-green-700">
                  <strong>成功：</strong> 获取到 {imageUrls.length} 张图片
                </div>
              </div>
            )}
          </div>

          {/* 图片轮播 */}
          {!isLoading && !error && imageUrls.length > 0 && (
            <div className="mt-4">
              <ImageCarousel
                images={imageUrls}
                className="w-full"
                showIndicators={true}
                showControls={true}
                autoPlay={false}
                fallbackImage="/placeholder.jpg"
              />
            </div>
          )}

          {/* 图片URL列表 */}
          {!isLoading && !error && imageUrls.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">图片URL列表：</h4>
              <div className="space-y-1">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="text-xs bg-gray-100 p-2 rounded break-all">
                    {index + 1}. {url}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 缩略图测试 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🖼️ 缩略图获取测试
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="thumbnail-name">菜品名称</Label>
              <Input
                id="thumbnail-name"
                value={thumbnailParams.name}
                onChange={e => handleThumbnailChange('name', e.target.value)}
                placeholder="输入菜品名称"
              />
            </div>
            <div>
              <Label htmlFor="thumbnail-category">分类</Label>
              <Input
                id="thumbnail-category"
                value={thumbnailParams.category}
                onChange={e =>
                  handleThumbnailChange('category', e.target.value)
                }
                placeholder="输入分类"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={refetchThumbnail} disabled={thumbnailLoading}>
              {thumbnailLoading ? '获取中...' : '获取缩略图'}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setThumbnailParams({
                  name: '麻婆豆腐',
                  category: '川菜',
                })
              }>
              重置
            </Button>
          </div>

          {/* 状态显示 */}
          <div className="space-y-2">
            {thumbnailLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                正在获取缩略图...
              </div>
            )}

            {thumbnailError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                <div className="text-red-700">
                  <strong>错误：</strong> {thumbnailError}
                </div>
              </div>
            )}

            {!thumbnailLoading && !thumbnailError && thumbnailUrl && (
              <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                <div className="text-green-700">
                  <strong>成功：</strong> 获取到缩略图
                </div>
              </div>
            )}
          </div>

          {/* 缩略图显示 */}
          {!thumbnailLoading && !thumbnailError && thumbnailUrl && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">缩略图：</h4>
              <div className="w-32 h-32 relative rounded-lg overflow-hidden border">
                <img
                  src={thumbnailUrl}
                  alt="缩略图"
                  className="w-full h-full object-cover"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.jpg';
                  }}
                />
              </div>
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded break-all">
                {thumbnailUrl}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 预设测试用例 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 预设测试用例
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() =>
                setTestParams({
                  name: '红烧肉',
                  desc: '肥而不腻的红烧肉',
                  gen_desc: '经典家常菜',
                  category: '家常菜',
                  count: 2,
                })
              }>
              红烧肉
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setTestParams({
                  name: '糖醋里脊',
                  desc: '酸甜可口的糖醋里脊',
                  gen_desc: '经典鲁菜',
                  category: '鲁菜',
                  count: 2,
                })
              }>
              糖醋里脊
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setTestParams({
                  name: '水煮鱼',
                  desc: '麻辣鲜香的水煮鱼',
                  gen_desc: '经典川菜',
                  category: '川菜',
                  count: 2,
                })
              }>
              水煮鱼
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setTestParams({
                  name: '白切鸡',
                  desc: '鲜嫩爽滑的白切鸡',
                  gen_desc: '经典粤菜',
                  category: '粤菜',
                  count: 2,
                })
              }>
              白切鸡
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
