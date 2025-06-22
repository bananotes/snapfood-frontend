'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  className?: string;
  showIndicators?: boolean;
  showControls?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onImageClick?: (index: number) => void;
  fallbackImage?: string;
}

export default function ImageCarousel({
  images,
  className = '',
  showIndicators = true,
  showControls = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onImageClick,
  fallbackImage = '/placeholder.jpg',
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 最小滑动距离
  const minSwipeDistance = 50;

  // 处理触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // 处理触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // 处理触摸结束
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      previousImage();
    }
  };

  // 下一张图片
  const nextImage = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  }, [images.length]);

  // 上一张图片
  const previousImage = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  }, [images.length]);

  // 跳转到指定图片
  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // 处理图片点击
  const handleImageClick = useCallback(() => {
    if (onImageClick) {
      onImageClick(currentIndex);
    } else {
      setIsFullscreen(true);
    }
  }, [currentIndex, onImageClick]);

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case 'Escape':
          setIsFullscreen(false);
          setIsZoomed(false);
          break;
        case 'ArrowLeft':
          previousImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case ' ':
          e.preventDefault();
          setIsZoomed(!isZoomed);
          break;
      }
    },
    [isFullscreen, previousImage, nextImage, isZoomed],
  );

  // 自动播放
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        nextImage();
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, nextImage, images.length]);

  // 键盘事件监听
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // 全屏时禁止滚动
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  // 如果没有图片，显示占位图
  if (!images || images.length === 0) {
    return (
      <div
        className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
        <img
          src={fallbackImage}
          alt="暂无图片"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 text-sm">暂无图片</p>
        </div>
      </div>
    );
  }

  // 主轮播组件
  const CarouselContent = () => (
    <div className="relative group">
      {/* 主图片 */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        <img
          key={`${images[currentIndex]}-${currentIndex}`}
          src={images[currentIndex]}
          alt={`图片 ${currentIndex + 1}`}
          className={`w-full h-48 object-cover transition-transform duration-300 cursor-pointer ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          onClick={handleImageClick}
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
            target.alt = '图片加载失败';
          }}
        />

        {/* 加载遮罩 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />

        {/* 图片计数器 */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* 控制按钮 */}
      {showControls && images.length > 1 && (
        <>
          <button
            onClick={previousImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
            aria-label="上一张图片">
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
            aria-label="下一张图片">
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* 指示器 */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`跳转到第 ${index + 1} 张图片`}
            />
          ))}
        </div>
      )}
    </div>
  );

  // 全屏模态框
  const FullscreenModal = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* 关闭按钮 */}
      <button
        onClick={() => {
          setIsFullscreen(false);
          setIsZoomed(false);
        }}
        className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        aria-label="关闭全屏">
        <X size={24} />
      </button>

      {/* 缩放按钮 */}
      <button
        onClick={() => setIsZoomed(!isZoomed)}
        className="absolute top-4 left-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        aria-label={isZoomed ? '缩小' : '放大'}>
        {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
      </button>

      {/* 全屏图片容器 */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`图片 ${currentIndex + 1}`}
          className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
            target.alt = '图片加载失败';
          }}
        />

        {/* 全屏控制按钮 */}
        {images.length > 1 && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
              aria-label="上一张图片">
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
              aria-label="下一张图片">
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* 全屏指示器 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`跳转到第 ${index + 1} 张图片`}
              />
            ))}
          </div>
        )}

        {/* 图片计数器 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CarouselContent />
      {isFullscreen && <FullscreenModal />}
    </>
  );
}
