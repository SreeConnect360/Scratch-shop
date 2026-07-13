"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Layers } from "lucide-react";

// Context to share map instance with child markers/popups
const MapContext = createContext<{
  map: maplibregl.Map | null;
} | null>(null);

const STYLE_PRESETS = {
  bright: "https://tiles.openfreemap.org/styles/bright",
  liberty: "https://tiles.openfreemap.org/styles/liberty",
  positron: "https://tiles.openfreemap.org/styles/positron",
  satellite: {
    version: 8,
    sources: {
      "esri-satellite": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        attribution: "Tiles &copy; Esri"
      },
      "cartodb-labels": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution: "&copy; OpenStreetMap, &copy; CARTO"
      }
    },
    layers: [
      {
        id: "esri-satellite-layer",
        type: "raster",
        source: "esri-satellite",
        minzoom: 0,
        maxzoom: 20
      },
      {
        id: "cartodb-labels-layer",
        type: "raster",
        source: "cartodb-labels",
        minzoom: 0,
        maxzoom: 20
      }
    ]
  }
};

export interface MapViewport {
  center: [number, number]; // [longitude, latitude]
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface MapRef {
  easeTo: (options: maplibregl.EaseToOptions) => void;
  flyTo: (options: maplibregl.FlyToOptions) => void;
  getMap: () => maplibregl.Map | null;
}

interface MapProps {
  center?: [number, number];
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
      center = [77.5946, 12.9716], // Default to Bangalore, India
      zoom = 12,
      viewport,
      onViewportChange,
      blank = false,
      styles,
      children,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
    const [mapStyle, setMapStyle] = useState<'bright' | 'liberty' | 'positron' | 'satellite'>('bright');
    const [showStyles, setShowStyles] = useState(false);

    // Enforce light mode / selected style only. Theme is ignored.
    const getStyleUrl = (currentStyle: 'bright' | 'liberty' | 'positron' | 'satellite') => {
      if (blank) return { version: 8, sources: {}, layers: [] };
      if (styles) {
        // Fallback to custom light style if provided
        return styles.light;
      }
      return STYLE_PRESETS[currentStyle];
    };

    // Expose map methods to parent via ref
    useImperativeHandle(ref, () => ({
      easeTo: (options) => {
        mapRef.current?.easeTo(options);
      },
      flyTo: (options) => {
        mapRef.current?.flyTo(options);
      },
      getMap: () => mapRef.current,
    }));

    // Initialize Map
    useEffect(() => {
      if (!containerRef.current) return;

      const initialCenter = viewport ? viewport.center : center;
      const initialZoom = viewport ? viewport.zoom : zoom;
      const initialBearing = viewport?.bearing ?? 0;
      const initialPitch = viewport?.pitch ?? 0;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: getStyleUrl(mapStyle) as any,
        center: initialCenter,
        zoom: initialZoom,
        bearing: initialBearing,
        pitch: initialPitch,
        attributionControl: false,
      });

      mapRef.current = map;

      map.on("load", () => {
        setMapInstance(map);
      });

      map.on("move", () => {
        if (onViewportChange) {
          const centerLngLat = map.getCenter();
          onViewportChange({
            center: [centerLngLat.lng, centerLngLat.lat],
            zoom: map.getZoom(),
            bearing: map.getBearing(),
            pitch: map.getPitch(),
          });
        }
      });

      // Cleanup
      return () => {
        map.remove();
        mapRef.current = null;
        setMapInstance(null);
      };
    }, []);

    // Update style dynamically when selected
    useEffect(() => {
      if (!mapRef.current || blank) return;
      mapRef.current.setStyle(getStyleUrl(mapStyle) as any);
    }, [mapStyle, blank]);

    // Update center and zoom if they change externally
    useEffect(() => {
      if (!mapRef.current || viewport) return;
      const currentCenter = mapRef.current.getCenter();
      if (
        Math.abs(currentCenter.lng - center[0]) > 0.0001 ||
        Math.abs(currentCenter.lat - center[1]) > 0.0001
      ) {
        mapRef.current.setCenter(center);
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
        mapRef.current.jumpTo({
          center: viewport.center,
          zoom: viewport.zoom,
          bearing: viewport.bearing,
          pitch: viewport.pitch,
        });
      }
    }, [viewport]);

    return (
      <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden relative border border-white/10 shadow-lg font-sans">
        {/* Style Preset Selector Overlay */}
        {!blank && (
          <div className="absolute top-3 left-3 z-20">
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
                <div className="absolute top-full left-0 mt-1.5 w-28 bg-black/90 border border-white/15 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg flex flex-col z-30">
                  {(['bright', 'liberty', 'positron', 'satellite'] as const).map((style) => (
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
                      {style}
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
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map) return;

    const el = document.createElement("div");
    el.style.display = "inline-block";

    const marker = new maplibregl.Marker({
      element: el,
      draggable,
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    if (onDrag) {
      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        onDrag({ lng: lngLat.lng, lat: lngLat.lat });
      });
    }

    return () => {
      marker.remove();
      markerRef.current = null;
    };
  }, [map]);

  // Sync marker position
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude]);
    }
  }, [longitude, latitude]);

  // Sync draggable property
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setDraggable(draggable);
    }
  }, [draggable]);

  // Render children into the portal element
  return (
    <div style={{ display: "none" }}>
      <div ref={elementRef}>{children}</div>
      {markerRef.current && elementRef.current && (
        <MarkerPortal element={elementRef.current} target={markerRef.current.getElement()} />
      )}
    </div>
  );
}

// Helper component to teleport elements
function MarkerPortal({ element, target }: { element: HTMLDivElement; target: HTMLElement }) {
  useEffect(() => {
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
  focusAfterOpen?: boolean;
  closeOnClick?: boolean;
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
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map) return;

    const el = document.createElement("div");
    const popup = new maplibregl.Popup({
      closeButton,
      closeOnClick: false,
      className: `custom-liquid-popup ${className}`,
    })
      .setLngLat([longitude, latitude])
      .setDOMContent(el)
      .addTo(map);

    popupRef.current = popup;

    if (onClose) {
      popup.on("close", onClose);
    }

    return () => {
      popup.remove();
      popupRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.setLngLat([longitude, latitude]);
    }
  }, [longitude, latitude]);

  return (
    <div style={{ display: "none" }}>
      <div ref={contentRef} className="p-3 bg-black/90 text-white rounded-xl border border-white/10 backdrop-blur-md">
        {children}
      </div>
      {popupRef.current && contentRef.current && (
        <MarkerPortal element={contentRef.current} target={popupRef.current.getElement().querySelector(".maplibregl-popup-content") as HTMLElement} />
      )}
    </div>
  );
}

// Dummy export components to avoid breakages in case they are imported in general examples
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
  showCompass = true,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showCompass?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
}) {
  const { map } = useContext(MapContext) || {};

  useEffect(() => {
    if (!map) return;
    const nav = new maplibregl.NavigationControl({
      showZoom,
      showCompass,
    });
    map.addControl(nav, position);
    return () => {
      map.removeControl(nav);
    };
  }, [map, position]);

  return null;
}
