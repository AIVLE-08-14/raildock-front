import { useEffect, useRef, useState } from "react";
import { KOREA_POINTS } from "./points";

/* =========================
  Kakao Map Script Loader
========================= */

declare global {
  interface Window {
    kakao: any;
  }
}

let kakaoMapLoadingPromise: Promise<void> | null = null;

function loadKakaoMap(appKey: string): Promise<void> {
  if (window.kakao && window.kakao.maps) return Promise.resolve();
  if (kakaoMapLoadingPromise) return kakaoMapLoadingPromise;

  kakaoMapLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js` +
      `?appkey=${appKey}&autoload=false&libraries=clusterer`;
    script.async = true;

    script.onload = () => {
      try {
        window.kakao.maps.load(() => resolve());
      } catch {
        reject(new Error("Kakao Maps 초기화 실패"));
      }
    };

    script.onerror = () =>
      reject(new Error("Kakao Maps SDK 로드 실패"));

    document.head.appendChild(script);
  });

  return kakaoMapLoadingPromise;
}

/* =========================
   Dot Marker Factory
========================= */

function createDotMarker(lat: number, lng: number, color = "red") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
      <circle cx="6" cy="6" r="5"
        fill="${color}"
        stroke="white"
        stroke-width="2"
      />
    </svg>
  `;

  return new window.kakao.maps.Marker({
    position: new window.kakao.maps.LatLng(lat, lng),
    image: new window.kakao.maps.MarkerImage(
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg),
      new window.kakao.maps.Size(12, 12),
      { offset: new window.kakao.maps.Point(6, 6) }
    ),
  });
}

/* =========================
  Hover Info
========================= */

function attachHoverInfo(marker: any, defect: any) {
  const infoWindow = new window.kakao.maps.InfoWindow({
    content: `
      <div style="
        padding:6px 8px;
        font-size:12px;
        line-height:1.4;
      ">
        <strong>결함 ID:</strong> ${defect.id}<br/>
        <strong>유형:</strong> ${defect.type}<br/>
        <strong>등급:</strong> ${defect.level}
      </div>
    `,
  });

  window.kakao.maps.event.addListener(marker, "mouseover", () => {
    infoWindow.open(marker.getMap(), marker);
  });

  window.kakao.maps.event.addListener(marker, "mouseout", () => {
    infoWindow.close();
  });
}

/* =========================
   Props
========================= */

interface KakaoMapProps {
  lat?: number;
  lng?: number;
  level?: number;
}

/* =========================
  Component
========================= */

export default function KakaoMap({
  lat = 37.5665,
  lng = 126.978,
  level = 7,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const clustererInstance = useRef<any>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================
    Script Load
  ========================= */

  useEffect(() => {
    const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;

    if (!appKey) {
      setError("VITE_KAKAO_MAP_APP_KEY가 설정되지 않았습니다.");
      return;
    }

    loadKakaoMap(appKey)
      .then(() => setReady(true))
      .catch((err) => setError(err.message));
  }, []);

  /* =========================
    Map Init + Clusterer
  ========================= */

  useEffect(() => {
    if (!ready || !mapRef.current || mapInstance.current) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(lat, lng),
      level,
    });

    const clusterer = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 6,
    });

    const markers = KOREA_POINTS.map(p => {
      const marker = createDotMarker(p.lat, p.lng, p.color ?? "red");

      attachHoverInfo(marker, {
        id: p.id,
        type: p.type ?? "균열",
        level: p.level ?? "중",
      });

      return marker;
    });

    clusterer.addMarkers(markers);

    mapInstance.current = map;
    clustererInstance.current = clusterer;
  }, [ready]);

  /* =========================
    Update Center / Level
  ========================= */

  useEffect(() => {
    if (!mapInstance.current) return;

    mapInstance.current.setCenter(
      new window.kakao.maps.LatLng(lat, lng)
    );
    mapInstance.current.setLevel(level);
  }, [lat, lng, level]);

  /* =========================
    Cleanup
  ========================= */

  useEffect(() => {
    return () => {
      clustererInstance.current?.clear();
      clustererInstance.current = null;
      mapInstance.current = null;
    };
  }, []);

  /* =========================
    Render
  ========================= */

  if (error) {
    return (
      <div className="flex items-center justify-center w-full min-h-[400px] bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center w-full min-h-[400px] bg-gray-100 rounded-lg">
        <p className="text-gray-600">지도 로딩 중...</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        borderRadius: "8px",
      }}
    />
  );
}
