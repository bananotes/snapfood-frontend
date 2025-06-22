'use client';

import { useState } from 'react';

interface Dish {
  name?: string;
  desc?: string;
  en_name?: string;
  en_desc?: string;
  gen_desc?: string;
  category?: string;
  price?: number;
  spice_level?: number;
  aller_desc?: string;
  vegen_desc?: string;
  reli_desc?: string;
}

interface Restaurant {
  id?: string;
  displayName?: {
    text?: string;
    languageCode?: string;
  };
}

interface MenuDisplayProps {
  dishes?: Dish[];
  restaurants?: Restaurant[];
}

const SpiceLevel = ({ level }: { level?: number }) => {
  const spiceLevel = level || 0;
  const spiceIcons = Array.from({ length: 3 }, (_, i) => (
    <span
      key={i}
      className={`text-lg ${i < spiceLevel ? 'text-red-500' : 'text-gray-300'}`}>
      🌶️
    </span>
  ));
  return <div className="flex">{spiceIcons}</div>;
};

const DishCard = ({ dish }: { dish: Dish }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Safe field accessors with defaults
  const dishName = dish.name || 'Unnamed Dish';
  const dishDesc = dish.desc || dish.gen_desc || 'No description available';
  const dishPrice = dish.price || 0;
  const dishCategory = dish.category || 'Uncategorized';
  const dishSpiceLevel = dish.spice_level || 0;
  const dishEnName = dish.en_name || 'No English name available';
  const dishEnDesc = dish.en_desc || 'No English description available';
  const dishGenDesc = dish.gen_desc || 'No general description available';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {dishName}
          </h3>
          <div className="text-right">
            <span className="text-xl font-bold text-green-600">
              ${dishPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dishDesc}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {dishCategory}
          </span>
          {dishSpiceLevel > 0 && <SpiceLevel level={dishSpiceLevel} />}
        </div>

        {(dish.vegen_desc || dish.aller_desc || dish.reli_desc) && (
          <div className="flex flex-wrap gap-1 mb-3">
            {dish.vegen_desc && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                🌱 {dish.vegen_desc}
              </span>
            )}
            {dish.aller_desc && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                ⚠️ {dish.aller_desc}
              </span>
            )}
            {dish.reli_desc && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                🕊️ {dish.reli_desc}
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">English Name:</span>
                <span className="ml-2 text-gray-600">{dishEnName}</span>
              </div>
              {dish.en_desc && (
                <div>
                  <span className="font-medium text-gray-700">
                    English Description:
                  </span>
                  <p className="text-gray-600 mt-1">{dishEnDesc}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Summary:</span>
                <p className="text-gray-600 mt-1">{dishGenDesc}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MenuDisplay({
  dishes = [],
  restaurants = [],
}: MenuDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>(
    'category',
  );

  // Ensure dishes and restaurants are arrays
  const safeDishes = Array.isArray(dishes) ? dishes : [];
  const safeRestaurants = Array.isArray(restaurants) ? restaurants : [];

  // Group dishes by category with safe category access
  const categories = [
    'ALL',
    ...Array.from(
      new Set(safeDishes.map(dish => dish.category || 'Uncategorized')),
    ),
  ];

  // Filter and sort dishes
  const filteredDishes = safeDishes.filter(
    dish =>
      selectedCategory === 'ALL' ||
      (dish.category || 'Uncategorized') === selectedCategory,
  );

  const sortedDishes = [...filteredDishes].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'price':
        return (a.price || 0) - (b.price || 0);
      case 'category':
        return (a.category || 'Uncategorized').localeCompare(
          b.category || 'Uncategorized',
        );
      default:
        return 0;
    }
  });

  // Get unique restaurants with safe ID access
  const uniqueRestaurants = safeRestaurants.filter(
    (restaurant, index, self) => {
      const currentId = restaurant.id || `unknown-${index}`;
      return (
        index ===
        self.findIndex(r => (r.id || `unknown-${index}`) === currentId)
      );
    },
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Menu Analysis Results
        </h1>
        <p className="text-lg text-gray-600">
          Found {safeDishes.length} dishes from {uniqueRestaurants.length}{' '}
          nearby restaurants
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={e =>
                  setSortBy(e.target.value as 'name' | 'price' | 'category')
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="category">Category</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Showing {sortedDishes.length} of {safeDishes.length} dishes
          </div>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sortedDishes.map((dish, index) => (
          <DishCard key={`${dish.name || 'dish'}-${index}`} dish={dish} />
        ))}
      </div>

      {/* Nearby Restaurants */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Nearby Restaurants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueRestaurants.map((restaurant, index) => {
            const restaurantId = restaurant.id || `unknown-${index}`;
            const restaurantName =
              restaurant.displayName?.text || 'Unknown Restaurant';
            const languageCode =
              restaurant.displayName?.languageCode?.toUpperCase() || 'Unknown';

            return (
              <div
                key={restaurantId}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">{restaurantName}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Language: {languageCode}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
