"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";
import { Map, MapControls, useMap } from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { RotateCcw, Mountain, X } from "lucide-react";

function MapController() {
  const { map, isLoaded } = useMap();
  const [pitch, setPitch] = useState(0);
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const handleMove = () => {
      setPitch(Math.round(map.getPitch()));
      setBearing(Math.round(map.getBearing()));
    };

    map.on("move", handleMove);
    return () => {
      map.off("move", handleMove);
    };
  }, [map, isLoaded]);

  const handle3DView = () => {
    map?.easeTo({
      pitch: 60,
      bearing: -20,
      duration: 1000,
    });
  };

  const handleReset = () => {
    map?.easeTo({
      pitch: 0,
      bearing: 0,
      duration: 1000,
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={handle3DView}>
          <Mountain className="size-4 mr-1.5" />
          3D View
        </Button>
        <Button size="sm" variant="secondary" onClick={handleReset}>
          <RotateCcw className="size-4 mr-1.5" />
          Reset
        </Button>
      </div>
      <div className="rounded-md bg-background/90 backdrop-blur px-3 py-2 text-xs font-mono border text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800">
        <div>Pitch: {pitch}°</div>
        <div>Bearing: {bearing}°</div>
      </div>
    </div>
  );
}

export function FeatureSection() {
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
    <section className="py-12 px-4 w-full">
      <div className="max-w-7xl mx-auto">
       <div className="w-full">
        <div className="w-full h-[500px]">
          {/* Expandable Map Card */}
          <motion.div
            layoutId={`card-${id}`}
            onClick={() => setActive(true)}
            className="w-full relative cursor-pointer overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 h-full"
          >
             {/* Preview Content (Small Map) */}
             <div className="absolute inset-0 pointer-events-none">
                <Map 
                   center={[115.0, -1.0]}
                   zoom={3.5}
                   styles={{
                      light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                      dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                   }}
                 >
                   {/* Simplified markers for preview */}
                </Map>
             </div>
             
             <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 px-4 py-2 rounded-full z-10 backdrop-blur-sm">
                <h3 className="text-sm font-bold">Partner Map</h3>
                <p className="text-xs text-neutral-500">Click to expand</p>
             </div>
          </motion.div>
        </div>  
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
                          light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                          dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                        }}
                      >
                         <MapController />
                         <MapControls 
                            position="bottom-right" 
                            showZoom
                            showCompass
                            showLocate
                            showFullscreen
                         />
                      </Map>
                  </div>
                  
                  <div className="p-6 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                       Digital MSME Ecosystem
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                       Connecting local businesses to the global stage. This map is tangible evidence of the thousands of MSMEs that have successfully built their digital identities with us. Find them near you.
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
