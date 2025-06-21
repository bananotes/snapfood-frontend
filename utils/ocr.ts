import { createWorker } from "tesseract.js"
import type { Dish, Category } from "@/contexts/AppContext"

export interface OCRResult {
  text: string
  dishes: Dish[]
  categories: Category[]
}

export async function processImage(file: File, onProgress?: (progress: number) => void): Promise<OCRResult> {
  const worker = await createWorker("chi_sim", 1, {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(m.progress * 100)
      }
    },
  })

  try {
    const {
      data: { text },
    } = await worker.recognize(file)

    // Simple dish extraction logic - in real app, this would be more sophisticated
    const lines = text.split("\n").filter((line) => line.trim().length > 0)
    const dishNames = lines
      .filter((line) => {
        // Filter out prices, numbers, and common non-dish words
        return (
          !line.match(/^\d+$/) &&
          !line.match(/^[¥$]\d+/) &&
          !line.match(/^(价格|菜单|menu|price)/i) &&
          line.length > 2 &&
          line.length < 20
        )
      })
      .slice(0, 10) // Limit to 10 dishes

    // Create mock dishes with full data structure
    const mockDishes: Dish[] = dishNames.length > 0 
      ? dishNames.map((name, index) => ({
          name,
          rating: 4.0 + Math.random() * 1.0, // Random rating between 4.0-5.0
          price: `¥${(15 + Math.random() * 25).toFixed(0)}`, // Random price 15-40
          photoUrl: "/placeholder.svg?height=300&width=300",
          summary: `美味的${name}，精心制作，口感丰富`,
          description: `传统制作工艺，选用优质食材，${name}是我们的招牌菜品之一`,
          category: index < 3 ? "推荐" : index < 6 ? "热菜" : "素食",
        }))
      : [
          // Fallback dishes
          {
            name: "宫保鸡丁",
            rating: 4.5,
            price: "¥28",
            photoUrl: "/placeholder.svg?height=300&width=300",
            summary: "经典川菜，鸡肉嫩滑，花生香脆",
            description: "选用优质鸡胸肉，配以花生米和干辣椒，麻辣鲜香",
            category: "推荐",
          },
          {
            name: "麻婆豆腐",
            rating: 4.2,
            price: "¥18",
            photoUrl: "/placeholder.svg?height=300&width=300",
            summary: "嫩滑豆腐配麻辣酱汁，下饭神器",
            description: "传统川菜，豆腐嫩滑，麻辣适中，老少皆宜",
            category: "推荐",
          },
          {
            name: "糖醋里脊",
            rating: 4.7,
            price: "¥32",
            photoUrl: "/placeholder.svg?height=300&width=300",
            summary: "酸甜可口，外酥内嫩，家庭最爱",
            description: "优质里脊肉，酸甜适中，老少皆宜的经典菜品",
            category: "热菜",
          }
        ]

    // Generate categories based on dishes
    const categoryMap = new Map<string, number>()
    mockDishes.forEach(dish => {
      categoryMap.set(dish.category, (categoryMap.get(dish.category) || 0) + 1)
    })

    const categories: Category[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name,
      name,
      count
    }))

    await worker.terminate()

    return {
      text,
      dishes: mockDishes,
      categories
    }
  } catch (error) {
    await worker.terminate()
    throw error
  }
}
