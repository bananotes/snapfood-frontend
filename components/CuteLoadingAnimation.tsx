"use client"

export default function CuteLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Hot dog illustration */}
      <div className="relative mb-8">
        {/* Hot dog bun (top) */}
        <div className="relative">
          <div className="w-32 h-12 bg-[#D4A574] rounded-t-full border-2 border-[#B8935F] relative overflow-hidden">
            {/* Sesame seeds */}
            <div className="absolute top-2 left-6 w-1.5 h-1.5 bg-[#8B7355] rounded-full"></div>
            <div className="absolute top-3 left-12 w-1 h-1 bg-[#8B7355] rounded-full"></div>
            <div className="absolute top-2 right-8 w-1.5 h-1.5 bg-[#8B7355] rounded-full"></div>
            <div className="absolute top-4 right-14 w-1 h-1 bg-[#8B7355] rounded-full"></div>
            <div className="absolute top-2 left-20 w-1 h-1 bg-[#8B7355] rounded-full"></div>
          </div>

          {/* Sausage */}
          <div className="w-28 h-6 bg-[#C4704A] rounded-full mx-auto -mt-1 border-2 border-[#A85D3F] relative">
            {/* Sausage texture lines */}
            <div className="absolute top-1 left-2 right-2 h-0.5 bg-[#A85D3F] rounded-full opacity-50"></div>
            <div className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#A85D3F] rounded-full opacity-50"></div>

            {/* Bouncing animation */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            </div>
            <div className="absolute -top-1 left-1/3 transform -translate-x-1/2">
              <div
                className="w-1.5 h-1.5 bg-[#4ECDC4] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <div className="absolute -top-1 right-1/3 transform translate-x-1/2">
              <div
                className="w-1.5 h-1.5 bg-[#45B7D1] rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>

          {/* Hot dog bun (bottom) */}
          <div className="w-32 h-8 bg-[#D4A574] rounded-b-full border-2 border-[#B8935F] border-t-0 mx-auto -mt-1"></div>
        </div>

        {/* Floating condiment drops */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-4 left-8 w-2 h-2 bg-[#FF6B6B] rounded-full animate-pulse opacity-70"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-6 right-10 w-1.5 h-1.5 bg-[#FFD93D] rounded-full animate-pulse opacity-70"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-8 left-12 w-1.5 h-1.5 bg-[#4ECDC4] rounded-full animate-pulse opacity-70"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
      </div>

      {/* Loading text with dots */}
      <div className="text-center">
        <h3 className="text-lg font-medium text-[#2D2A26] mb-3">Analyzing your menu</h3>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>

      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-[#8B7355] rounded-full opacity-10 animate-spin"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-6 h-6 border-2 border-[#A0956B] rounded-full opacity-10 animate-spin"
          style={{ animationDuration: "6s", animationDirection: "reverse" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/6 w-4 h-4 bg-[#8B7355] rounded-full opacity-5 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/6 w-4 h-4 bg-[#A0956B] rounded-full opacity-5 animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>
    </div>
  )
}
