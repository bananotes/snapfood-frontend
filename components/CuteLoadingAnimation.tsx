"use client"

export default function CuteLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Cute cooking animation */}
      <div className="relative mb-8">
        {/* Chef hat */}
        <div className="w-16 h-12 bg-white rounded-t-full border-2 border-[#8B7355] relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#8B7355] rounded-full animate-bounce"></div>
        </div>

        {/* Chef face */}
        <div className="w-12 h-12 bg-[#F5E6D3] rounded-full mx-auto -mt-2 relative">
          {/* Eyes */}
          <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-[#2D2A26] rounded-full animate-pulse"></div>
          <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-[#2D2A26] rounded-full animate-pulse"></div>
          {/* Smile */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-[#8B7355] rounded-full"></div>
        </div>
      </div>

      {/* Cooking pot with steam */}
      <div className="relative mb-6">
        <div className="w-20 h-12 bg-[#8B7355] rounded-b-full relative">
          {/* Steam bubbles */}
          <div
            className="absolute -top-2 left-4 w-2 h-2 bg-[#A0956B] rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute -top-4 left-8 w-1.5 h-1.5 bg-[#A0956B] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="absolute -top-2 right-4 w-2 h-2 bg-[#A0956B] rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
          <div
            className="absolute -top-5 left-10 w-1 h-1 bg-[#A0956B] rounded-full animate-bounce"
            style={{ animationDelay: "0.6s" }}
          ></div>
        </div>
      </div>

      {/* Loading text with dots */}
      <div className="text-center">
        <h3 className="text-lg font-medium text-[#2D2A26] mb-2">Analyzing your menu</h3>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>

      {/* Floating food icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-2xl animate-pulse" style={{ animationDelay: "1s" }}>
          🍜
        </div>
        <div className="absolute top-1/3 right-1/4 text-2xl animate-pulse" style={{ animationDelay: "1.5s" }}>
          🥟
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-2xl animate-pulse" style={{ animationDelay: "2s" }}>
          🍛
        </div>
        <div className="absolute bottom-1/4 right-1/3 text-2xl animate-pulse" style={{ animationDelay: "2.5s" }}>
          🥢
        </div>
      </div>
    </div>
  )
}
