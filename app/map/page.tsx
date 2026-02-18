"use client";

import { useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Search, ArrowRight } from "lucide-react";
import { Map, MapControls } from "@/components/ui/map";

// --- Mock Data Retailer ---
const retailers = [
  {
    id: 1,
    name: "Post Zürich 32 Neumünster",
    address: "Forchstrasse 8, 8008, Zürich 32",
    region: "Neumünster",
  },
  {
    id: 2,
    name: "k kiosk HB Satellit",
    address: "Bahnhofplatz 15, 8001, Zürich",
    region: "City Center",
  },
  {
    id: 3,
    name: "BK Perronhalle",
    address: "Bahnhofplatz 15, 8001, Zürich",
    region: "Station",
  },
  {
    id: 4,
    name: "Coop Pronto Stauffacher",
    address: "Stauffacherstrasse 10, 8004, Zürich",
    region: "Wiedikon",
  },
  {
    id: 5,
    name: "Migros Express",
    address: "Limmatstrasse 23, 8005, Zürich",
    region: "Industriequartier",
  },
];

export default function MapPage() {
  const mapRef = useRef<any>(null);

  // 🔥 Resize observer → bikin map ikut resize saat Ctrl+ / Ctrl-
  useEffect(() => {
    if (!mapRef.current) return;

    const mapInstance = mapRef.current;

    const resizeObserver = new ResizeObserver(() => {
      mapInstance?.invalidateSize?.();
    });

    const container =
      mapInstance?.getContainer?.() || mapInstance?._container;

    if (container) resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // 🔥 Deteksi browser zoom (optional trigger reflow)
  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.invalidateSize?.();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-14 bg-white flex flex-col lg:flex-row gap-0 lg:gap-4">
        {/* 🔹 LEFT: SEARCH & LIST */}
        <div className="w-full lg:max-w-md flex flex-col bg-white px-6">
          <div className="pt-8 pb-4">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
              Find a retailer.
            </h2>
            <p className="text-base text-neutral-600">
              Get your LOKA gift card at a retailer near you.
            </p>
          </div>

          {/* SEARCH */}
          <div className="pb-4">
            <label className="text-xs font-semibold text-neutral-500 mb-1 block">
              Search by Address, Region or City
            </label>

            <div className="relative flex items-center">
              <div className="absolute left-4 text-neutral-400">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                placeholder="Search"
                className="w-full h-12 pl-12 pr-14 rounded-full bg-neutral-100 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />

              <button className="absolute right-2 h-9 w-9 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors shadow-sm">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SPACER — pushes list to bottom on desktop */}
          <div className="hidden lg:block lg:flex-1" />

          {/* LIST */}
          <div className="overflow-y-auto">
            {retailers.map((store) => (
              <div
                key={store.id}
                className="group border-t border-neutral-200 py-5 transition-colors hover:bg-neutral-50/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-bold text-sm text-neutral-900">
                      {store.name}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {store.address}
                    </p>
                  </div>

                  <button className="flex items-center gap-2 text-sm text-neutral-900 font-semibold group-hover:text-orange-600 transition-colors whitespace-nowrap shrink-0">
                    Get Directions
                    <div className="rounded-full border border-neutral-300 p-1 group-hover:border-orange-600">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 RIGHT: MAP — fills remaining space */}
        <div className="flex-1 bg-white p-4 pt-0 lg:pt-4">
          <div
            className="w-full h-[400px] lg:h-full overflow-hidden shadow-sm"
            style={{ borderRadius: "1.25rem" }}
          >
            <Map
              ref={mapRef}
              center={[2.3522, 48.8566]}
              zoom={11}
              className="w-full h-full"
            >
              <MapControls
                position="bottom-right"
                showZoom
                showCompass
                showLocate
                showFullscreen
              />
            </Map>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
