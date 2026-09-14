import { useState, useRef, useCallback, useEffect } from "react";
import { Move, ZoomIn, RotateCcw, Eye } from "lucide-react";

interface ImageFocalAdjusterProps {
  imageUrl: string;
  focalX?: number; // 0 to 100, default 50
  focalY?: number; // 0 to 100, default 50
  scale?: number;  // 1 to 2.5, default 1.0
  aspectRatioClass?: string; // e.g. "aspect-[3/4]", "aspect-[16/10] lg:aspect-[21/9]"
  label?: string;
  onChange: (values: { focalX: number; focalY: number; scale: number }) => void;
}

export function ImageFocalAdjuster({
  imageUrl,
  focalX = 50,
  focalY = 50,
  scale = 1.0,
  aspectRatioClass = "aspect-[16/10] lg:aspect-[21/9]",
  label,
  onChange,
}: ImageFocalAdjusterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentX = Math.min(100, Math.max(0, Math.round(focalX ?? 50)));
  const currentY = Math.min(100, Math.max(0, Math.round(focalY ?? 50)));
  const currentScale = Math.min(2.5, Math.max(1, Number((scale ?? 1.0).toFixed(2))));

  const updateCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = Math.round(((clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((clientY - rect.top) / rect.height) * 100);

      const clampedX = Math.min(100, Math.max(0, x));
      const clampedY = Math.min(100, Math.max(0, y));

      onChange({
        focalX: clampedX,
        focalY: clampedY,
        scale: currentScale,
      });
    },
    [currentScale, onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateCoordinates(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateCoordinates(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, updateCoordinates]);

  if (!imageUrl || !imageUrl.trim()) {
    return (
      <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center text-xs text-muted-foreground">
        Enter an image URL to enable live preview & focal adjustment.
      </div>
    );
  }

  return (
    <div className="space-y-3 bg-zinc-950/50 border border-white/10 p-3 rounded-xl">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-accent">
          <Move className="w-3.5 h-3.5" />
          <span>{label || "Interactive Image Position & Adjustment"}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
          <span>X: {currentX}%</span>
          <span>·</span>
          <span>Y: {currentY}%</span>
          <span>·</span>
          <span>{currentScale}x</span>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Click and drag on the image preview below to move and adjust its focal center point in real-time.
      </p>

      {/* Interactive Drag Canvas with Exact Ratio */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`relative w-full ${aspectRatioClass} max-h-[260px] bg-zinc-900 border border-white/15 rounded-xl overflow-hidden cursor-crosshair select-none group shadow-inner`}
      >
        <img
          src={imageUrl}
          alt="Preview adjustment"
          className="w-full h-full object-cover transition-[object-position] duration-75 pointer-events-none"
          style={{
            objectPosition: `${currentX}% ${currentY}%`,
            transform: currentScale > 1 ? `scale(${currentScale})` : undefined,
            transformOrigin: `${currentX}% ${currentY}%`,
          }}
        />

        {/* Crosshair indicator at the active focal point */}
        <div
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-all duration-75"
          style={{ left: `${currentX}%`, top: `${currentY}%` }}
        >
          <div className="w-6 h-6 rounded-full border-2 border-white bg-accent/40 shadow-lg flex items-center justify-center backdrop-blur-xs animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>

        {/* Hover hint */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm border border-white/10 px-2 py-1 rounded-full text-[9px] text-white/80 flex items-center gap-1 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <Eye className="w-2.5 h-2.5" /> Drag to adjust
        </div>
      </div>

      {/* Adjustment Controls: Zoom and Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Zoom Slider */}
        <div className="space-y-1 bg-white/5 p-2 rounded-lg border border-white/5">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-muted-foreground flex items-center gap-1 font-semibold">
              <ZoomIn className="w-3 h-3 text-accent" /> Zoom / Scale
            </span>
            <span className="font-mono text-white">{currentScale.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.05"
            value={currentScale}
            onChange={(e) => {
              onChange({
                focalX: currentX,
                focalY: currentY,
                scale: parseFloat(e.target.value),
              });
            }}
            className="w-full accent-accent h-1.5 bg-white/10 rounded cursor-pointer"
          />
        </div>

        {/* Alignment Presets & Reset */}
        <div className="space-y-1 bg-white/5 p-2 rounded-lg border border-white/5 flex flex-col justify-between">
          <span className="text-[10px] text-muted-foreground font-semibold">Quick Align Presets</span>
          <div className="flex flex-wrap gap-1">
            {[
              { label: "Center", x: 50, y: 50 },
              { label: "Top", x: 50, y: 15 },
              { label: "Bottom", x: 50, y: 85 },
              { label: "Left", x: 15, y: 50 },
              { label: "Right", x: 85, y: 50 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  onChange({
                    focalX: preset.x,
                    focalY: preset.y,
                    scale: currentScale,
                  });
                }}
                className={`px-2 py-1 rounded text-[9px] font-mono cursor-pointer transition-colors ${
                  currentX === preset.x && currentY === preset.y
                    ? "bg-accent text-white font-bold"
                    : "bg-white/10 hover:bg-white/20 text-foreground"
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                onChange({
                  focalX: 50,
                  focalY: 50,
                  scale: 1.0,
                });
              }}
              title="Reset to Center & 1.0x scale"
              className="px-2 py-1 rounded text-[9px] font-mono bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer flex items-center gap-1 ml-auto"
            >
              <RotateCcw className="w-2.5 h-2.5" /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
