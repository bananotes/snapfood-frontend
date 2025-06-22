'use client';

import React, { useRef, useEffect, useState, ReactNode } from 'react';

interface TouchGestureHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  disabled?: boolean;
  threshold?: number; // Minimum distance for swipe
  longPressDelay?: number; // Delay for long press in ms
}

export default function TouchGestureHandler({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
  className = '',
  disabled = false,
  threshold = 50,
  longPressDelay = 500,
}: TouchGestureHandlerProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    if (disabled) return;

    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      const rect = element.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      setStartPos({ x, y });
      setCurrentPos({ x, y });
      setIsPressed(true);

      // Start long press timer
      if (onLongPress) {
        const timer = setTimeout(() => {
          onLongPress();
        }, longPressDelay);
        setLongPressTimer(timer);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !isPressed) return;

      const touch = e.touches[0];
      const rect = element.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      setCurrentPos({ x, y });

      // Cancel long press if moved too much
      if (longPressTimer) {
        const distance = Math.sqrt(
          Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2),
        );
        if (distance > 10) {
          clearTimeout(longPressTimer);
          setLongPressTimer(null);
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isPressed) return;

      // Clear long press timer
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }

      const deltaX = currentPos.x - startPos.x;
      const deltaY = currentPos.y - startPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Determine if it's a swipe or tap
      if (distance > threshold) {
        // It's a swipe
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      } else if (distance < 10 && onTap) {
        // It's a tap
        onTap();
      }

      setIsPressed(false);
    };

    const handleTouchCancel = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
      setIsPressed(false);
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchCancel, {
      passive: false,
    });

    return () => {
      // Cleanup event listeners
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);

      // Clear timer
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [
    disabled,
    isPressed,
    startPos,
    currentPos,
    longPressTimer,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onLongPress,
    threshold,
    longPressDelay,
  ]);

  return (
    <div
      ref={elementRef}
      className={`touch-manipulation ${className}`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}>
      {children}
    </div>
  );
}
