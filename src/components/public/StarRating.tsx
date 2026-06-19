import { Star } from "lucide-react";
import { useState } from "react";

export function StarRating({
  value, onChange, size = 18, readonly = false,
}: { value: number; onChange?: (v: number) => void; size?: number; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="inline-flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHover(n)}
          onClick={() => !readonly && onChange?.(n)}
          className={`transition-transform ${readonly ? "cursor-default" : "hover:scale-110"}`}
          aria-label={`Rate ${n} stars`}
        >
          <Star
            style={{ width: size, height: size }}
            className={n <= shown ? "fill-accent text-accent" : "text-foreground/30"}
          />
        </button>
      ))}
    </div>
  );
}
