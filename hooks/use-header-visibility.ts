"use client";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 10; // px minimal scroll
const TOP_THRESHOLD = 10;    // di sini header selalu tampil

export function useHeaderVisibility() {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= TOP_THRESHOLD) {
        setVisible(true);
      } else if (y > lastY) {
        setVisible(false); // scroll down
      } else {
        setVisible(true);  // scroll up
      }
      setLastY(y);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return visible;
}