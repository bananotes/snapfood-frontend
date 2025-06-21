import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { dishes } = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock response - in real app, this would call actual AI service
    const mockCards = dishes.map((dishName: string, index: number) => ({
      name: dishName,
      rating: 4.0 + Math.random() * 1.0,
      photoUrl: `/placeholder.svg?height=300&width=300`,
      summary: `${dishName}是一道经典菜品，口感丰富，营养价值高，深受食客喜爱。`,
    }))

    return NextResponse.json({ cards: mockCards })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
