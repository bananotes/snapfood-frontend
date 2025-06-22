import { useState, useEffect, useCallback, useRef } from 'react';

// 输入参数接口
export interface UseDishImageParams {
  name: string;
  desc?: string;
  gen_desc?: string;
  category?: string;
  count?: number;
  place_id?: string;
}

// 返回数据接口
export interface UseDishImageReturn {
  imageUrls: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// 缩略图专用接口
export interface UseDishThumbnailReturn {
  thumbnailUrl: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// 错误类型定义
export type ImageError =
  | 'RATE_LIMIT' // API限流
  | 'NETWORK_ERROR' // 网络错误
  | 'INVALID_PARAMS' // 参数错误
  | 'NO_IMAGES' // 无图片返回
  | 'UNKNOWN_ERROR'; // 未知错误

// 重试配置
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
};

// 缓存配置
const cacheConfig = {
  ttl: 24 * 60 * 60 * 1000, // 24小时
  maxSize: 100, // 最大缓存100个菜品
  cleanupInterval: 60 * 60 * 1000, // 1小时清理一次
};

// 缓存项接口
interface CacheItem {
  imageUrls: string[];
  timestamp: number;
}

// 缩略图缓存项接口
interface ThumbnailCacheItem {
  thumbnailUrl: string;
  timestamp: number;
}

// 内存缓存 (L1 Cache)
const imageCache = new Map<string, CacheItem>();
const thumbnailCache = new Map<string, ThumbnailCacheItem>();

// 持久化缓存 (L2 Cache) 帮助函数
const getPersistentCache = <T>(key: string, ttl: number): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch (error) {
    console.error('Error getting persistent cache:', error);
    return null;
  }
};

const setPersistentCache = <T>(key: string, data: T, ttl: number) => {
  if (typeof window === 'undefined') return;
  try {
    const item = {
      data,
      expiry: new Date().getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error setting persistent cache:', error);
  }
};

// 生成缓存键
const generateCacheKey = (params: UseDishImageParams): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce(
      (acc, key) => {
        const value = params[key as keyof UseDishImageParams];
        // 对字符串值进行标准化处理
        if (typeof value === 'string') {
          acc[key] = value.trim().toLowerCase();
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

  return `dish-image-${JSON.stringify(sortedParams)}`;
};

// 生成缩略图缓存键
const generateThumbnailCacheKey = (name: string, category?: string): string => {
  const normalizedName = name.trim().toLowerCase();
  const normalizedCategory = category
    ? category.trim().toLowerCase()
    : 'default';
  return `dish-thumbnail-${normalizedName}-${normalizedCategory}`;
};

// 清理过期缓存
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, item] of imageCache.entries()) {
    if (now - item.timestamp > cacheConfig.ttl) {
      imageCache.delete(key);
    }
  }

  for (const [key, item] of thumbnailCache.entries()) {
    if (now - item.timestamp > cacheConfig.ttl) {
      thumbnailCache.delete(key);
    }
  }

  // 如果缓存太大，删除最旧的项
  if (imageCache.size > cacheConfig.maxSize) {
    const entries = Array.from(imageCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toDelete = entries.slice(0, entries.length - cacheConfig.maxSize);
    toDelete.forEach(([key]) => imageCache.delete(key));
  }

  if (thumbnailCache.size > cacheConfig.maxSize) {
    const entries = Array.from(thumbnailCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toDelete = entries.slice(0, entries.length - cacheConfig.maxSize);
    toDelete.forEach(([key]) => thumbnailCache.delete(key));
  }
};

// 定期清理缓存
setInterval(cleanupCache, cacheConfig.cleanupInterval);

// 清理和格式化菜品名称
const cleanDishName = (name: string): string => {
  if (!name) return '';
  return (
    name
      .trim()
      // 移除非中文字符、字母、数字和空格之外的特殊字符
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '')
      // 移除多个空格
      .replace(/\s+/g, ' ')
  );
};

// 验证输入参数
const validateParams = (params: UseDishImageParams): string | null => {
  if (!params.name || params.name.trim().length < 2) {
    return '菜品名称至少需要2个字符';
  }

  if (params.desc && params.desc.length > 500) {
    return '菜品描述不能超过500个字符';
  }

  if (params.gen_desc && params.gen_desc.length > 300) {
    return '通用描述不能超过300个字符';
  }

  if (params.category && params.category.length > 100) {
    return '分类不能超过100个字符';
  }

  if (params.count !== undefined && (params.count < 0 || params.count > 100)) {
    return '图片数量必须在0-100之间';
  }

  return null;
};

// 构建API URL
const buildApiUrl = (params: UseDishImageParams): string => {
  const searchParams = new URLSearchParams();

  // 清理并添加必需参数
  const cleanedName = cleanDishName(params.name);
  searchParams.append('name', cleanedName);

  // 添加可选参数
  if (params.desc) searchParams.append('desc', params.desc);
  if (params.gen_desc) searchParams.append('gen_desc', params.gen_desc);
  if (params.category) searchParams.append('category', params.category);
  if (params.count !== undefined)
    searchParams.append('count', params.count.toString());
  if (params.place_id) searchParams.append('place_id', params.place_id);

  return `/api/image-matcher?${searchParams.toString()}`;
};

// 解析错误类型
const parseError = (error: any): ImageError => {
  if (error?.message?.includes('rate limit') || error?.status === 429) {
    return 'RATE_LIMIT';
  }

  if (error?.message?.includes('network') || error?.name === 'TypeError') {
    return 'NETWORK_ERROR';
  }

  if (error?.status === 400) {
    return 'INVALID_PARAMS';
  }

  return 'UNKNOWN_ERROR';
};

// 获取错误消息
const getErrorMessage = (errorType: ImageError): string => {
  switch (errorType) {
    case 'RATE_LIMIT':
      return '请求过于频繁，请稍后再试';
    case 'NETWORK_ERROR':
      return '网络连接失败，请检查网络设置';
    case 'INVALID_PARAMS':
      return '参数错误，请检查输入信息';
    case 'NO_IMAGES':
      return '未找到相关图片';
    case 'UNKNOWN_ERROR':
    default:
      return '获取图片失败，请稍后重试';
  }
};

// 主Hook函数
export const useDishImage = (
  params: UseDishImageParams,
  skip: boolean = false,
): UseDishImageReturn => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef<number>(0);

  // 获取图片的核心函数
  const fetchImages = useCallback(
    async (retryAttempt = 0): Promise<void> => {
      // 验证参数
      const validationError = validateParams(params);
      if (validationError) {
        setError(validationError);
        return;
      }

      // 检查缓存
      const cacheKey = generateCacheKey(params);
      // 1. L1 内存缓存
      const memoryCachedItem = imageCache.get(cacheKey);
      if (
        memoryCachedItem &&
        Date.now() - memoryCachedItem.timestamp < cacheConfig.ttl
      ) {
        setImageUrls(memoryCachedItem.imageUrls);
        setError(null);
        return;
      }

      // 2. L2 持久化缓存
      const persistentCachedItem = getPersistentCache<string[]>(
        cacheKey,
        cacheConfig.ttl,
      );
      if (persistentCachedItem) {
        setImageUrls(persistentCachedItem);
        setError(null);
        // 将L2缓存填充到L1
        imageCache.set(cacheKey, {
          imageUrls: persistentCachedItem,
          timestamp: Date.now(),
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      // 创建新的AbortController
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const url = buildApiUrl(params);
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // 验证返回的图片数据
        if (!data.imageUrls || !Array.isArray(data.imageUrls)) {
          throw new Error('Invalid image data format');
        }

        const urls = data.imageUrls.filter(
          (url: string) => url && url.trim() !== '',
        );

        if (urls.length === 0) {
          throw new Error('NO_IMAGES');
        }

        // 缓存结果
        imageCache.set(cacheKey, {
          imageUrls: urls,
          timestamp: Date.now(),
        });
        setPersistentCache(cacheKey, urls, cacheConfig.ttl);

        setImageUrls(urls);
        setError(null);
        retryCountRef.current = 0;
      } catch (err: any) {
        // 如果是取消请求，不处理错误
        if (err.name === 'AbortError') {
          return;
        }

        const errorType = parseError(err);
        const errorMessage = getErrorMessage(errorType);

        // 重试逻辑
        if (
          retryAttempt < retryConfig.maxRetries &&
          (errorType === 'NETWORK_ERROR' || errorType === 'RATE_LIMIT')
        ) {
          const delay =
            retryConfig.retryDelay *
            Math.pow(retryConfig.backoffMultiplier, retryAttempt);

          setTimeout(() => {
            fetchImages(retryAttempt + 1);
          }, delay);

          return;
        }

        setError(errorMessage);
        setImageUrls([]);
      } finally {
        setIsLoading(false);
      }
    },
    [params],
  );

  // 重新获取函数
  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    fetchImages();
  }, [fetchImages]);

  // 初始加载
  useEffect(() => {
    if (skip) {
      // 如果跳过，则重置状态
      setImageUrls([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (params.name && params.name.trim().length >= 2) {
      fetchImages();
    }
  }, [fetchImages, skip, params.name]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    imageUrls,
    isLoading,
    error,
    refetch,
  };
};

// 缩略图专用Hook
export const useDishThumbnail = (
  name: string,
  category?: string,
  autoFetch: boolean = true,
): UseDishThumbnailReturn => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // 获取缩略图的核心函数
  const fetchThumbnail = useCallback(async (): Promise<void> => {
    if (!name || name.trim().length < 2) {
      return;
    }

    // 检查缓存
    const cacheKey = generateThumbnailCacheKey(name, category);
    // 1. L1 内存缓存
    const memoryCachedItem = thumbnailCache.get(cacheKey);
    if (
      memoryCachedItem &&
      Date.now() - memoryCachedItem.timestamp < cacheConfig.ttl
    ) {
      setThumbnailUrl(memoryCachedItem.thumbnailUrl);
      setError(null);
      return;
    }

    // 2. L2 持久化缓存
    const persistentCachedItem = getPersistentCache<string>(
      cacheKey,
      cacheConfig.ttl,
    );
    if (persistentCachedItem) {
      setThumbnailUrl(persistentCachedItem);
      setError(null);
      // 将L2缓存填充到L1
      thumbnailCache.set(cacheKey, {
        thumbnailUrl: persistentCachedItem,
        timestamp: Date.now(),
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    // 创建新的AbortController
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const params: UseDishImageParams = {
        name: name.trim(),
        category: category || '',
        count: 1, // 只获取一张图片
      };

      const url = buildApiUrl(params);
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (
        !data.imageUrls ||
        !Array.isArray(data.imageUrls) ||
        data.imageUrls.length === 0
      ) {
        throw new Error('NO_IMAGES');
      }

      const thumbnailUrl = data.imageUrls[0];

      // 缓存结果
      thumbnailCache.set(cacheKey, {
        thumbnailUrl: thumbnailUrl,
        timestamp: Date.now(),
      });
      setPersistentCache(cacheKey, thumbnailUrl, cacheConfig.ttl);

      setThumbnailUrl(thumbnailUrl);
      setError(null);
    } catch (err: any) {
      // 如果是取消请求，不处理错误
      if (err.name === 'AbortError') {
        return;
      }

      const errorType = parseError(err);
      const errorMessage = getErrorMessage(errorType);

      setError(errorMessage);
      setThumbnailUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [name, category]);

  // 重新获取函数
  const refetch = useCallback(() => {
    fetchThumbnail();
  }, [fetchThumbnail]);

  // 初始加载 - 根据autoFetch参数决定是否自动获取
  useEffect(() => {
    if (autoFetch) {
      fetchThumbnail();
    }
  }, [fetchThumbnail, autoFetch]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    thumbnailUrl,
    isLoading,
    error,
    refetch,
  };
};
