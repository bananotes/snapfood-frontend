import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { X } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
}

interface RestaurantSelectionProps {
  ocrText: string;
  difyResponse: any;
  onSelect: (restaurant: Restaurant) => void;
}

// 解析 Dify.ai 餐厅数据的函数
function parseRestaurantsFromDify(difyResponse: any): Restaurant[] {
  try {
    console.log('Parsing Dify response:', difyResponse);

    // 从 Dify.ai 响应中提取餐厅数据
    const restaurants = difyResponse?.data?.outputs?.restaurants || [];
    console.log('Raw restaurants from Dify:', restaurants);

    if (!Array.isArray(restaurants)) {
      console.warn('Restaurants is not an array:', restaurants);
      return [];
    }

    const mappedRestaurants = restaurants.map(
      (restaurant: any, index: number) => ({
        id: restaurant.id || `restaurant-${index}`,
        name: restaurant.displayName?.text || restaurant.name || '未知餐厅',
      }),
    );

    const uniqueRestaurants = mappedRestaurants.filter(
      (value, index, self) => index === self.findIndex(t => t.id === value.id),
    );

    return uniqueRestaurants;
  } catch (error) {
    console.error('Failed to parse restaurants from Dify:', error);
    return [];
  }
}

// 手动输入餐厅名称的模态框组件
function ManualInputModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (restaurantName: string) => void;
}) {
  const [restaurantName, setRestaurantName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantName.trim()) {
      onConfirm(restaurantName.trim());
      setRestaurantName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">手动输入餐厅名称</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={restaurantName}
            onChange={e => setRestaurantName(e.target.value)}
            placeholder="请输入餐厅名称"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />

          <div className="flex space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              取消
            </button>
            <button
              type="submit"
              disabled={!restaurantName.trim()}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RestaurantSelection({
  ocrText,
  difyResponse,
  onSelect,
}: RestaurantSelectionProps) {
  const { setState } = useAppContext();
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isManualInputOpen, setIsManualInputOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    console.log('RestaurantSelection: OCR Text:', ocrText);
    console.log('RestaurantSelection: Dify Response:', difyResponse);

    try {
      // 解析真实的 Dify.ai 餐厅数据
      const parsedRestaurants = parseRestaurantsFromDify(difyResponse);
      console.log('Parsed restaurants:', parsedRestaurants);

      if (parsedRestaurants.length === 0) {
        setError('未找到餐厅数据，请检查 Dify.ai 响应格式');
      } else {
        setRestaurants(parsedRestaurants);
      }
    } catch (error) {
      console.error('Error parsing restaurants:', error);
      setError('解析餐厅数据时出错');
    } finally {
      setLoading(false);
    }
  }, [ocrText, difyResponse]);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    console.log('Selected restaurant:', restaurant);
    onSelect(restaurant);
  };

  const handleManualInput = () => {
    setIsManualInputOpen(true);
  };

  const handleManualConfirm = (restaurantName: string) => {
    const manualRestaurant: Restaurant = {
      id: `manual-${Date.now()}`,
      name: restaurantName,
    };
    onSelect(manualRestaurant);
  };

  // 过滤餐厅列表
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg font-medium mb-4">正在分析餐厅信息...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <div className="text-sm text-gray-500 mb-4">
          Dify.ai 响应数据: {JSON.stringify(difyResponse, null, 2)}
        </div>
        <button
          onClick={() => setState('idle')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          重新开始
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">选择餐厅</h2>

      {/* 搜索框 */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索餐厅..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {restaurants.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(restaurant => (
              <button
                key={restaurant.id}
                onClick={() => handleRestaurantSelect(restaurant)}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <div className="font-medium">{restaurant.name}</div>
              </button>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchQuery ? '未找到匹配的餐厅' : '未找到餐厅'}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">未找到匹配的餐厅</div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleManualInput}
          className="w-full py-2 text-blue-600 hover:text-blue-800 font-medium">
          手动输入餐厅名称
        </button>
      </div>

      {/* 手动输入模态框 */}
      <ManualInputModal
        isOpen={isManualInputOpen}
        onClose={() => setIsManualInputOpen(false)}
        onConfirm={handleManualConfirm}
      />
    </div>
  );
}
