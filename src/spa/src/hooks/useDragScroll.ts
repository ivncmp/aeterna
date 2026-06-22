import { useRef, useCallback } from "react";

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; scrollTop: number } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, [role='button'], [role='tab']")) return;
    if (!ref.current) return;
    drag.current = { startY: e.clientY, scrollTop: ref.current.scrollTop };
    ref.current.style.cursor = "grabbing";
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drag.current || !ref.current) return;
    const dy = e.clientY - drag.current.startY;
    ref.current.scrollTop = drag.current.scrollTop - dy;
  }, []);

  const onMouseUp = useCallback(() => {
    drag.current = null;
    if (ref.current) ref.current.style.cursor = "";
  }, []);

  return { ref, onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp };
}
