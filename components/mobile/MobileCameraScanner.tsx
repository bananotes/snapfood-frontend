'use client';

import type React from 'react';
import { useCallback, useState } from 'react';
import {
  Camera,
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { processImage } from '@/utils/ocr';

export default function MobileCameraScanner() {
  const { setState, setProgress, setError, setDishes, setCategories } =
    useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotoSelected = useCallback(
    async (file: File) => {
      if (isProcessing) return;

      try {
        setIsProcessing(true);
        setState('ocr_processing');
        setProgress(10);

        // Step 1: OCR Processing
        const ocrResult = await processImage(file, ocrProgress => {
          setProgress(10 + ocrProgress * 0.4 * 100);
        });

        setProgress(50);

        // Step 2: Get location
        let longitude = '';
        let latitude = '';
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
              });
            },
          );
          longitude = position.coords.longitude.toString();
          latitude = position.coords.latitude.toString();
        } catch (error) {
          console.log('Location access denied or unavailable');
        }

        setProgress(60);

        // Step 3: Call Dify.ai API
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('language', 'zh-CN');
        formData.append('longitude', longitude);
        formData.append('latitude', latitude);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to analyze menu');
        }

        const difyResponse = await response.json();
        setProgress(80);

        // Step 4: Transition to restaurant selection
        setState('restaurant_selection');

        // Store OCR and Dify data for restaurant selection
        (window as any).ocrData = {
          text: ocrResult.text,
          difyResponse: difyResponse,
        };
      } catch (error) {
        console.error('Processing failed:', error);
        setError(
          error instanceof Error ? error.message : '图片处理失败，请重试。',
        );
        setState('error');
      } finally {
        setIsProcessing(false);
      }
    },
    [setState, setProgress, setError, setDishes, setCategories, isProcessing],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePhotoSelected(file);
    }
    event.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#FAFAF9]">
      {/* Top Section - Instructions */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#8B7355] to-[#6B5B47] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-[#2D2A26] mb-3">扫描菜单</h1>
          <p className="text-[#6B6B6B] leading-relaxed max-w-sm">
            拍照或选择菜单图片，AI将为您分析菜品信息
          </p>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-2xl p-4 mb-6 w-full max-w-sm shadow-sm border border-[#E8E6E3]">
          <h3 className="font-semibold text-[#2D2A26] mb-2 text-sm">
            📸 拍摄技巧
          </h3>
          <ul className="text-xs text-[#6B6B6B] space-y-1">
            <li>• 确保光线充足，避免阴影</li>
            <li>• 保持手机稳定，避免模糊</li>
            <li>• 尽量包含完整的菜单内容</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section - Action Buttons */}
      <div className="px-6 pb-safe-bottom pb-6">
        <div className="space-y-4">
          {/* Camera Button */}
          <label
            htmlFor="native-camera-input"
            className={`block w-full py-4 px-6 bg-gradient-to-r from-[#8B7355] to-[#7a654c] text-white rounded-2xl font-semibold text-lg text-center shadow-lg transition-all duration-200 ease-in-out cursor-pointer touch-manipulation ${
              isProcessing
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-[#7a654c] hover:to-[#6b5742] active:scale-95'
            }`}
            title="拍照">
            <div className="flex items-center justify-center">
              <Camera className="w-6 h-6 mr-3" />
              拍照扫描
            </div>
          </label>

          <input
            id="native-camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />

          {/* Gallery Button */}
          <label
            htmlFor="gallery-input"
            className={`block w-full py-4 px-6 bg-white text-[#2D2A26] rounded-2xl font-semibold text-lg text-center border-2 border-[#E8E6E3] transition-all duration-200 ease-in-out cursor-pointer touch-manipulation ${
              isProcessing
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50 active:scale-95'
            }`}
            title="从相册选择">
            <div className="flex items-center justify-center">
              <ImageIcon className="w-6 h-6 mr-3" />
              从相册选择
            </div>
          </label>

          <input
            id="gallery-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center py-4">
              <div className="inline-flex items-center text-[#8B7355]">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8B7355] mr-3"></div>
                正在处理中...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
