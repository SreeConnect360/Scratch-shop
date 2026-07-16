"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers } from "lucide-react";

// Context to share map instance with child markers/popups
const MapContext = createContext<{
  map: any | null;
} | null>(null);

export interface MapViewport {
  center: [number, number]; // [longitude, latitude]
  zoom: number;
}

export interface MapRef {
  easeTo: (options: any) => void;
  flyTo: (options: any) => void;
  getMap: () => any | null;
}

interface MapProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  viewport?: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
  blank?: boolean;
  styles?: { light: string; dark: string };
  children?: React.ReactNode;
}

export const Map = React.forwardRef<MapRef, MapProps>(
  (
    {
      center = [77.5946, 12.9716], // [longitude, latitude]
      zoom = 12,
      viewport,
      onViewportChange,
      blank = false,
      children,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any | null>(null);
    const tileLayerRef = useRef<any | null>(null);
    const labelLayerRef = useRef<any | null>(null);
    const [mapInstance, setMapInstance] = useState<any | null>(null);
    const [LInstance, setLInstance] = useState<any>(null);
    const [mapStyle, setMapStyle] = useState<'bright' | 'satellite'>('bright');
    const [showStyles, setShowStyles] = useState(false);

    // Dynamic import Leaflet on client-side only
    useEffect(() => {
      if (typeof window === "undefined") return;
      import("leaflet").then((module) => {
        setLInstance(module.default || module);
      });
    }, []);

    // Expose map methods to parent via ref
    useImperativeHandle(ref, () => ({
      easeTo: (options) => {
        if (options.center) {
          mapRef.current?.panTo([options.center[1], options.center[0]], {
            animate: true,
            duration: (options.duration ?? 500) / 1000,
          });
        }
      },
      flyTo: (options) => {
        if (options.center) {
          mapRef.current?.flyTo([options.center[1], options.center[0]], options.zoom ?? mapRef.current?.getZoom(), {
            animate: true,
            duration: (options.duration ?? 1000) / 1000,
          });
        }
      },
      getMap: () => mapRef.current,
    }));

    // Initialize Map once Leaflet is loaded
    useEffect(() => {
      if (!LInstance || !containerRef.current) return;

      const initialCenter = viewport ? viewport.center : center;
      const initialZoom = viewport ? viewport.zoom : zoom;

      const map = LInstance.map(containerRef.current, {
        center: [initialCenter[1], initialCenter[0]],
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
      });

      mapRef.current = map;
      setMapInstance(map);

      map.on("move", () => {
        if (onViewportChange) {
          const mapCenter = map.getCenter();
          onViewportChange({
            center: [mapCenter.lng, mapCenter.lat],
            zoom: map.getZoom(),
          });
        }
      });

      // Cleanup
      return () => {
        map.remove();
        mapRef.current = null;
        setMapInstance(null);
      };
    }, [LInstance]);

    // Handle tile layers reactively based on selected style
    useEffect(() => {
      if (!mapInstance || !LInstance) return;

      if (tileLayerRef.current) {
        mapInstance.removeLayer(tileLayerRef.current);
      }
      if (labelLayerRef.current) {
        mapInstance.removeLayer(labelLayerRef.current);
      }

      if (!blank) {
        if (mapStyle === 'satellite') {
          tileLayerRef.current = LInstance.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              maxZoom: 19,
              attribution: "Tiles &copy; Esri &mdash; Source: Esri",
            }
          ).addTo(mapInstance);

          // Add voyager transparent labels overlay for streets/city names
          labelLayerRef.current = LInstance.tileLayer(
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png",
            {
              maxZoom: 19,
              attribution: "&copy; CARTO",
            }
          ).addTo(mapInstance);
        } else {
          tileLayerRef.current = LInstance.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 19,
              attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            }
          ).addTo(mapInstance);
        }
      }
    }, [mapInstance, LInstance, mapStyle, blank]);

    // Update center and zoom if they change externally
    useEffect(() => {
      if (!mapRef.current || viewport) return;
      const currentCenter = mapRef.current.getCenter();
      if (
        Math.abs(currentCenter.lng - center[0]) > 0.0001 ||
        Math.abs(currentCenter.lat - center[1]) > 0.0001
      ) {
        mapRef.current.setView([center[1], center[0]], mapRef.current.getZoom());
      }
    }, [center]);

    useEffect(() => {
      if (!mapRef.current || viewport) return;
      if (Math.abs(mapRef.current.getZoom() - zoom) > 0.1) {
        mapRef.current.setZoom(zoom);
      }
    }, [zoom]);

    // Update viewport if it changes externally
    useEffect(() => {
      if (!mapRef.current || !viewport) return;
      const currentCenter = mapRef.current.getCenter();
      const currentZoom = mapRef.current.getZoom();
      const centerChanged =
        Math.abs(currentCenter.lng - viewport.center[0]) > 0.0001 ||
        Math.abs(currentCenter.lat - viewport.center[1]) > 0.0001;
      const zoomChanged = Math.abs(currentZoom - viewport.zoom) > 0.1;

      if (centerChanged || zoomChanged) {
        mapRef.current.setView([viewport.center[1], viewport.center[0]], viewport.zoom);
      }
    }, [viewport]);

    return (
      <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden relative border border-white/10 shadow-lg font-sans">
        {/* Style Preset Selector Overlay */}
        {!blank && (
          <div className="absolute top-3 left-3 z-[1000]">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStyles(!showStyles)}
                className="flex items-center gap-1.5 bg-black/80 hover:bg-black/95 text-white border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all shadow-md cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Style</span>
              </button>
              
              {showStyles && (
                <div className="absolute top-full left-0 mt-1.5 w-28 bg-black/90 border border-white/15 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg flex flex-col z-[1001]">
                  {(['bright', 'satellite'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => {
                        setMapStyle(style);
                        setShowStyles(false);
                      }}
                      className={`px-3 py-2 text-left text-xs capitalize transition-colors hover:bg-white/10 cursor-pointer ${
                        mapStyle === style ? 'text-[#d4af37] font-bold bg-white/5' : 'text-white/80'
                      }`}
                    >
                      {style === 'bright' ? 'Standard' : 'Satellite'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {mapInstance && (
          <MapContext.Provider value={{ map: mapInstance }}>
            {children}
          </MapContext.Provider>
        )}
      </div>
    );
  }
);

Map.displayName = "Map";

// Marker Component
interface MapMarkerProps {
  longitude: number;
  latitude: number;
  draggable?: boolean;
  onDrag?: (lngLat: { lng: number; lat: number }) => void;
  children?: React.ReactNode;
}

export function MapMarker({
  longitude,
  latitude,
  draggable = false,
  onDrag,
  children,
}: MapMarkerProps) {
  const { map } = useContext(MapContext) || {};
  const markerRef = useRef<any | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [LInstance, setLInstance] = useState<any>(null);

  // Dynamic import Leaflet on client-side only
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then((module) => {
      setLInstance(module.default || module);
    });
  }, []);

  useEffect(() => {
    if (!map || !LInstance) return;

    const el = document.createElement("div");
    el.style.display = "inline-block";

    const marker = LInstance.marker([latitude, longitude], {
      icon: LInstance.divIcon({
        html: el,
        className: "custom-leaflet-marker-wrapper",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      }),
      draggable,
    }).addTo(map);

    markerRef.current = marker;

    if (onDrag) {
      marker.on("dragend", () => {
        const latLng = marker.getLatLng();
        onDrag({ lng: latLng.lng, lat: latLng.lat });
      });
    }

    return () => {
      marker.remove();
      markerRef.current = null;
    };
  }, [map, LInstance]);

  // Sync marker position
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    }
  }, [longitude, latitude]);

  // Sync draggable property
  useEffect(() => {
    if (markerRef.current) {
      if (draggable) {
        markerRef.current.dragging?.enable();
      } else {
        markerRef.current.dragging?.disable();
      }
    }
  }, [draggable]);

  return (
    <div style={{ display: "none" }}>
      <div ref={elementRef}>{children}</div>
      {markerRef.current && elementRef.current && (
        <MarkerPortal element={elementRef.current} target={markerRef.current.getElement() as HTMLElement} />
      )}
    </div>
  );
}

// Helper component to teleport elements
function MarkerPortal({ element, target }: { element: HTMLDivElement; target: HTMLElement }) {
  useEffect(() => {
    if (!target) return;
    target.appendChild(element);
    return () => {
      if (target.contains(element)) {
        target.removeChild(element);
      }
    };
  }, [element, target]);

  return null;
}

// Marker Content Wrapper
export function MarkerContent({ children }: { children: React.ReactNode }) {
  return <div className="relative transform -translate-y-1/2">{children}</div>;
}

// Marker Label Wrapper
export function MarkerLabel({
  children,
  position = "bottom",
}: {
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1",
    left: "right-full top-1/2 -translate-y-1/2 mr-1",
    right: "left-full top-1/2 -translate-y-1/2 ml-1",
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} bg-black/85 text-white px-2 py-0.5 rounded text-[10px] whitespace-nowrap border border-white/10 font-sans pointer-events-none shadow`}
    >
      {children}
    </div>
  );
}

// Marker Popup Component
interface MapPopupProps {
  longitude: number;
  latitude: number;
  onClose?: () => void;
  closeButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function MapPopup({
  longitude,
  latitude,
  onClose,
  closeButton = true,
  className = "",
  children,
}: MapPopupProps) {
  const { map } = useContext(MapContext) || {};
  const popupRef = useRef<any | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [LInstance, setLInstance] = useState<any>(null);

  // Dynamic import Leaflet on client-side only
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then((module) => {
      setLInstance(module.default || module);
    });
  }, []);

  useEffect(() => {
    if (!map || !LInstance) return;

    const el = document.createElement("div");
    const popup = LInstance.popup({
      closeButton,
      closeOnClick: false,
      className: `custom-liquid-popup ${className}`,
    })
      .setLatLng([latitude, longitude])
      .setContent(el)
      .openOn(map);

    popupRef.current = popup;

    if (onClose) {
      map.on("popupclose", (e: any) => {
        if (e.popup === popup) onClose();
      });
    }

    return () => {
      popup.remove();
      popupRef.current = null;
    };
  }, [map, LInstance]);

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.setLatLng([latitude, longitude]);
    }
  }, [longitude, latitude]);

  return (
    <div style={{ display: "none" }}>
      <div ref={contentRef} className="p-3 bg-black/90 text-white rounded-xl border border-white/10 backdrop-blur-md">
        {children}
      </div>
      {popupRef.current && contentRef.current && (
        <MarkerPortal element={contentRef.current} target={popupRef.current.getElement()?.querySelector(".leaflet-popup-content") as HTMLElement} />
      )}
    </div>
  );
}

// Dummy export components
export function MarkerPopup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-1 ${className}`}>{children}</div>;
}

export function MarkerTooltip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black/80 text-white text-[10px] rounded px-1.5 py-0.5 border border-white/10 pointer-events-none">
      {children}
    </div>
  );
}

export function MapControls({
  position = "top-right",
  showZoom = true,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showCompass?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
}) {
  const { map } = useContext(MapContext) || {};
  const [LInstance, setLInstance] = useState<any>(null);

  // Dynamic import Leaflet on client-side only
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then((module) => {
      setLInstance(module.default || module);
    });
  }, []);

  useEffect(() => {
    if (!map || !LInstance) return;

    // Map control positions in Leaflet
    const leafletPosition: any =
      position === "top-right"
        ? "topright"
        : position === "top-left"
        ? "topleft"
        : position === "bottom-left"
        ? "bottomleft"
        : "bottomright";

    let zoomControl: any = null;
    if (showZoom) {
      zoomControl = LInstance.control.zoom({ position: leafletPosition });
      zoomControl.addTo(map);
    }

    return () => {
      if (zoomControl) {
        map.removeControl(zoomControl);
      }
    };
  }, [map, LInstance, position, showZoom]);

  return null;
}
