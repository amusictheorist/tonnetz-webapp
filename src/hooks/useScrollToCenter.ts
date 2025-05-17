import { useEffect } from "react";

export const useScrollToCenter = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.scrollTop = (node.scrollHeight - node.clientHeight) / 2;
    }
  }, []);
};