"use client";

import { useEffect } from "react";

export function useMapResize(mapRef: React.RefObject<any>) {
  useEffect(() => {
    if (!mapRef.current) return;

    const observer = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize?.();
      }
    });

    const el = mapRef.current.getContainer?.() || mapRef.current._container;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [mapRef]);
}
