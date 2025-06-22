'use client';

import { useRouter } from 'next/navigation';
import MobileDishListItem from './mobile/MobileDishListItem';
import { type Dish, type Category } from '@/contexts/AppContext';

// Note: Removed DishModalAlternative as it's no longer used here.
// The new behavior is to navigate to a detail page.

interface ScrollableDishListProps {
  dishes: Dish[];
  categories: Category[];
}

export default function ScrollableDishList({
  dishes,
  categories,
}: ScrollableDishListProps) {
  const router = useRouter();

  const handleDishClick = (dish: Dish) => {
    // 导航到独立的菜品详情页
    router.push(`/dish/${dish.id}`);
  };

  const groupDishesByCategory = () => {
    const categoryMap = new Map<string, Dish[]>();
    categories.forEach(c => categoryMap.set(c.name, []));

    dishes.forEach(dish => {
      const categoryName = dish.category || '其他';
      if (categoryMap.has(categoryName)) {
        categoryMap.get(categoryName)?.push(dish);
      } else {
        // Handle dishes with categories not in the main list
        if (!categoryMap.has('其他')) {
          categoryMap.set('其他', []);
        }
        categoryMap.get('其他')?.push(dish);
      }
    });
    return Array.from(categoryMap.entries());
  };

  const categorizedDishes = groupDishesByCategory();

  return (
    <div className="bg-white">
      {categorizedDishes.map(([categoryName, dishList]) => {
        if (dishList.length === 0) return null;
        return (
          <div key={categoryName}>
            <div
              id={categoryName}
              className="px-4 py-3 bg-[#F5F4F2] sticky top-[64px] z-10 border-b border-[#E8E6E3]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#2D2A26]">
                  {categoryName}
                </h2>
                <span className="text-sm text-[#6B6B6B] bg-white px-2 py-1 rounded-full">
                  {dishList.length} 道菜
                </span>
              </div>
            </div>
            <div className="divide-y divide-[#F5F4F2]">
              {dishList.map(dish => (
                <MobileDishListItem
                  key={dish.id || dish.name}
                  dish={dish}
                  onClick={() => handleDishClick(dish)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
