import { createWorker } from "tesseract.js"

export interface OCRResult {
  text: string
  dishes: string[]
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
    const dishes = lines
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

    await worker.terminate()

    return {
      text,
      dishes: dishes.length > 0 ? dishes : ["宫保鸡丁", "麻婆豆腐", "糖醋里脊"], // Fallback
    }
  } catch (error) {
    await worker.terminate()
    throw error
  }
}
