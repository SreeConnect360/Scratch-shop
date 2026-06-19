import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function Lightbox({
  images, index, onClose, onPrev, onNext, caption,
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  caption?: (i: number) => string;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white p-2"><X className="w-6 h-6" /></button>
          <button onClick={onPrev} className="absolute left-4 lg:left-10 text-white/60 hover:text-white p-3"><ChevronLeft className="w-7 h-7" /></button>
          <button onClick={onNext} className="absolute right-4 lg:right-10 text-white/60 hover:text-white p-3"><ChevronRight className="w-7 h-7" /></button>
          <motion.img
            key={images[index]}
            src={images[index]}
            alt=""
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-h-[88vh] max-w-[88vw] object-contain"
          />
          {caption && (
            <div className="absolute bottom-6 left-0 right-0 text-center editorial-label text-white/70">{caption(index)}</div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
