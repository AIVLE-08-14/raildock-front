import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import GeoJSON from "ol/format/GeoJSON";
import { Stroke, Style, Fill, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { fromLonLat } from "ol/proj";

const TestMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<Map | null>(null);

  // 레이어 ref (중요)
  const routeLayerRef = useRef<VectorLayer | null>(null);
  const stationLayerRef = useRef<VectorLayer | null>(null);
  const majorStationLayerRef = useRef<VectorLayer | null>(null);

  // 체크박스 상태
  const [showRoute, setShowRoute] = useState(true);
  const [showStation, setShowStation] = useState(true);
  const [showMajorStation, setShowMajorStation] = useState(true);
  const [showDefect] = useState(false); // 아직 없음

  //한국 범위
  const koreaExtent = fromLonLat([123, 32.0]).concat(fromLonLat([132.5, 38.5]));

  useEffect(() => {
    if (!mapRef.current) return;

    /** =====================
     *  노선 (Line)
     *  ===================== */
    const routeLayer = new VectorLayer({
      source: new VectorSource({
        url: "/data/Rail_route_2023.geojson",
        format: new GeoJSON(),
      }),
      style: new Style({
        stroke: new Stroke({ color: "#555", width: 2 }),
      }),
      visible: showRoute,
    });

    routeLayerRef.current = routeLayer;

    /** =====================
     *  역 (Point) - Cluster
     *  ===================== */
    const stationSource = new VectorSource({
      url: "/data/Rail_route_station_2023.geojson",
      format: new GeoJSON(),
    });

    const clusterSource = new Cluster({
      distance: 40,
      source: stationSource,
    });

    const clusterStyle = (feature: any) => {
      const size = feature.get("features").length;

      if (size === 1) {
        return new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: "#0077cc" }),
            stroke: new Stroke({ color: "#ffffff", width: 1 }),
          }),
        });
      }

      return new Style({
        image: new CircleStyle({
          radius: 12,
          fill: new Fill({ color: "#ff6600" }),
        }),
        text: new Text({
          text: String(size),
          fill: new Fill({ color: "#ffffff" }),
        }),
      });
    };

    const stationClusterLayer = new VectorLayer({
      source: clusterSource,
      style: clusterStyle,
      visible: showStation,
    });

    stationLayerRef.current = stationClusterLayer;

    /** =====================
     *  주요역 (Point)
     *  ===================== */
    const majorStationLayer = new VectorLayer({
      source: new VectorSource({
        url: "/data/Rail_time_table_2023.geojson",
        format: new GeoJSON(),
      }),
      style: new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: "#cc0000" }),
          stroke: new Stroke({ color: "#ffffff", width: 1 }),
        }),
      }),
      visible: showMajorStation,
    });

    majorStationLayerRef.current = majorStationLayer;

    /** =====================
     *  지도 생성
     *  ===================== */
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        routeLayer,
        stationClusterLayer,
        majorStationLayer,
      ],
      view: new View({
        center: fromLonLat([127, 36]),
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        extent: koreaExtent,
      }),
    });

    mapObj.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  /** =====================
   *  체크박스 → 레이어 visible 제어
   *  ===================== */
  useEffect(() => {
    routeLayerRef.current?.setVisible(showRoute);
  }, [showRoute]);

  useEffect(() => {
    stationLayerRef.current?.setVisible(showStation);
  }, [showStation]);

  useEffect(() => {
    majorStationLayerRef.current?.setVisible(showMajorStation);
  }, [showMajorStation]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* 체크박스 UI */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "white",
          padding: 10,
          zIndex: 1000,
          fontSize: 14,
        }}
      >
        <div>
          <label>
            <input
              type="checkbox"
              checked={showRoute}
              onChange={() => setShowRoute(!showRoute)}
            />{" "}
            노선
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showStation}
              onChange={() => setShowStation(!showStation)}
            />{" "}
            역
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showMajorStation}
              onChange={() => setShowMajorStation(!showMajorStation)}
            />{" "}
            주요역
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={showDefect} disabled /> 결함(준비중)
          </label>
        </div>
      </div>

      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default TestMap;