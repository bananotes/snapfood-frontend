'use client';

import { useEffect } from 'react';
import { X, Star } from 'lucide-react';
import type { Dish } from '@/contexts/AppContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DishModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishModalAlternative({
  dish,
  isOpen,
  onClose,
}: DishModalProps) {
  if (!isOpen || !dish) return null;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const mockReviews = [
    'Authentic taste, generous portion, great value for money!',
    'Expertly prepared, rich layers of flavor, highly recommended.',
    'Classic dish, order it every time, never disappoints.',
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4 p-6 relative animate-in-up"
        onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="aspect-square relative">
          <Image
            src="/placeholder.jpg"
            alt={dish.name}
            fill
            className="object-cover"
            crossOrigin="anonymous"
          />
        </div>

        <div className="mt-4">
          <h2 className="text-3xl font-bold text-[#2D2A26] mb-2">
            {dish.name}
          </h2>
          <p className="text-lg font-semibold text-[#FF6D28] mb-4">
            {dish.price}
          </p>
          <p className="text-md text-[#6B6B6B] leading-relaxed mb-6">
            {dish.gen_desc}
          </p>

          {dish.vegen_desc && (
            <div className="mb-4">
              <Badge className="bg-green-100 text-green-800">素食</Badge>
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold text-[#2D2A26] mb-3">
              关于这道菜
            </h3>
            <p className="text-[#2D2A26] leading-relaxed">{dish.gen_desc}</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-[#2D2A26] mb-3">Customer Reviews</h4>
          <div className="space-y-3">
            {mockReviews.map((review, index) => (
              <div key={index} className="bg-[#FAFAF9] rounded-lg p-3">
                <p className="text-sm text-[#2D2A26]">"{review}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
