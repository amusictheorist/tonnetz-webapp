import { useEffect } from "react";

export function useCenterScroll(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollLeft = el.scrollWidth / 2 - el.clientWidth / 2;
        el.scrollTop = el.scrollHeight / 2 - el.clientHeight / 2;
      });
    }
  }, [ref]);
};