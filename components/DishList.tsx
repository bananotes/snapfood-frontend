'use client';

import { useState } from 'react';
import type { Dish } from '@/contexts/AppContext';
import DishListItem from './DishListItem';
import DishDetailModal from './DishDetailModal';

interface DishListProps {
  dishes: Dish[];
}

export default function DishList({ dishes }: DishListProps) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDishClick = (dish: Dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedDish(null);
    }, 300);
  };

  return (
    <>
      <div className="bg-white">
        <div className="divide-y divide-gray-100">
          {dishes.map((dish, index) => (
            <DishListItem
              key={dish.id || index}
              dish={dish}
              onClick={() => handleDishClick(dish)}
            />
          ))}
        </div>
      </div>

      <DishDetailModal
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
