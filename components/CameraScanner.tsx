'use client';

import type React from 'react';
import { useCallback } from 'react';
import { Camera, UploadCloud } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { processImage } from '@/utils/ocr';

export default function CameraScanner() {
  const { setState, setProgress, setError, setDishes, setCategories } =
    useAppContext();

  const handlePhotoSelected = useCallback(
    async (file: File) => {
      try {
        setState('ocr_processing');
        setProgress(10); // Initial progress

        // Step 1: OCR Processing
        const ocrResult = await processImage(file, ocrProgress => {
          setProgress(10 + ocrProgress * 0.4 * 100); // OCR takes 40% of progress
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
        // Note: This is a temporary solution. In a real app, you'd store this in context
        (window as any).ocrData = {
          text: ocrResult.text,
          difyResponse: difyResponse,
        };
      } catch (error) {
        console.error('Processing failed:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Image processing failed, please try again.',
        );
        setState('error');
      }
    },
    [setState, setProgress, setError, setDishes, setCategories],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePhotoSelected(file);
    }
    event.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#FAFAF9] p-6 text-center">
      <div className="w-full max-w-md flex flex-col items-center">
        <UploadCloud size={64} className="text-[#8B7355] mx-auto mb-6" />

        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          Scan a Menu
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed px-4 sm:px-0">
          Tap the camera button to take a photo of the menu. Ensure the image is
          clear and well-lit for the best results.
        </p>

        <label
          htmlFor="native-camera-input"
          className="flex items-center justify-center w-20 h-20 bg-[#8B7355] text-white rounded-full hover:bg-[#7a654c] active:bg-[#6b5742] transition-all duration-150 ease-in-out cursor-pointer shadow-xl focus-within:ring-4 focus-within:ring-[#8B7355]/50 focus-within:ring-offset-2 transform active:scale-95"
          title="Take Photo">
          <Camera size={32} />
        </label>
        <input
          id="native-camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
