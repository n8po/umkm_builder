"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";
import { Map, MapControls, MapMarker } from "@/components/ui/map";
import { X } from "lucide-react";

export function ExpandableMapSection() {
  const [active, setActive] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(false));

  return (
    <section className="py-20 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 mb-8 text-center">
          Global Reach
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto h-[500px]">
           {/* Other Bento Items (Placeholders) */}
          <div className="row-span-1 md:row-span-2 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-3xl p-6 flex flex-col justify-between">
             <div className="h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-300">Analytics</h3>
                <p className="text-neutral-500 text-sm mt-2">Real-time data processing for your business logic.</p>
             </div>
          </div>

          <div className="row-span-1 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-3xl p-6 flex items-center justify-center">
             <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">99.9% Uptime</h3>
          </div>

          {/* Expandable Map Card */}
          <motion.div
            layoutId={`card-${id}`}
            onClick={() => setActive(true)}
            className="col-span-1 md:col-span-2 md:row-span-2 relative cursor-pointer overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 h-full min-h-[300px]"
          >
             {/* Preview Content (Small Map) */}
             <div className="absolute inset-0 pointer-events-none">
                <Map 
                   center={[115.0, -1.0]}
                   zoom={3.5}
                   styles={{
                      light: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                      dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                   }}
                 >
                   {/* Simplified markers for preview */}
                </Map>
             </div>
             
             <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 px-4 py-2 rounded-full z-10 backdrop-blur-sm">
                <h3 className="text-sm font-bold">Interactive Coverage</h3>
                <p className="text-xs text-neutral-500">Click to expand</p>
             </div>
          </motion.div>
        </div>

        {/* Expanded State Overlay */}
        <AnimatePresence>
          {active && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 h-full w-full z-40 backdrop-blur-sm"
              />
              <div className="fixed inset-0 grid place-items-center z-[100] p-4">
                <motion.div
                  layoutId={`card-${id}`}
                  ref={ref}
                  className="w-full max-w-5xl h-[80vh] bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden relative border border-neutral-200 dark:border-neutral-800 flex flex-col shadow-2xl"
                >
                  <button
                    className="absolute top-4 right-4 p-2 bg-white dark:bg-neutral-800 rounded-full z-50 shadow-lg hover:scale-110 transition-transform"
                    onClick={() => setActive(false)}
                  >
                    <X className="w-5 h-5 text-neutral-800 dark:text-white" />
                  </button>
                  
                  <div className="flex-1 w-full h-full relative">
                      <Map 
                        center={[115.0, -1.0]}
                        zoom={5}
                        styles={{
                          light: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
                          dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                        }}
                      >
                         <MapControls position="bottom-right" />
                         <MapMarker longitude={106.8456} latitude={-6.2088}>
                            <div className="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse" />
                            {/* Jakarta */}
                         </MapMarker>
                         <MapMarker longitude={112.7907} latitude={-7.2794}> 
                            <div className="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg" />
                         </MapMarker>
                          <MapMarker longitude={110.3695} latitude={-7.7956}> 
                            <div className="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg" />
                         </MapMarker>
                      </Map>
                  </div>
                  
                  <div className="p-6 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                       Our Global Presence
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                       We are operating in major cities across Indonesia and expanding globally. Use the map to explore our data centers and office locations.
                    </p>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
