import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import OSM from "ol/source/OSM"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import Overlay from "ol/Overlay"

import { Stroke, Style, Fill } from "ol/style"
import CircleStyle from "ol/style/Circle"
import { fromLonLat } from "ol/proj"

import { useDashboardProblemGis } from "@/api/queries/dashboardProblemQueries"

const TestMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapObj = useRef<Map | null>(null)

  const routeLayerRef = useRef<VectorLayer | null>(null)
  const stationLayerRef = useRef<VectorLayer | null>(null)
  const defectLayerRef = useRef<VectorLayer | null>(null)
  const overlayRef = useRef<Overlay | null>(null)

  const [showRoute, setShowRoute] = useState(true)
  const [showStation, setShowStation] = useState(true)
  const [showDefect, setShowDefect] = useState(true)

  const navigate = useNavigate()

  // 🔥 결함 GIS API
  const { data: defectList } = useDashboardProblemGis()

  const koreaExtent = fromLonLat([123, 32.0]).concat(
    fromLonLat([132.5, 38.5])
  )

  /** =====================
   * 지도 생성
   * ===================== */
  useEffect(() => {
    if (!mapRef.current) return

    const routeLayer = new VectorLayer({
      source: new VectorSource({
        url: "/data/Rail_route_2023.geojson",
        format: new GeoJSON(),
      }),
      style: new Style({
        stroke: new Stroke({ color: "#555", width: 2 }),
      }),
      visible: showRoute,
    })
    routeLayerRef.current = routeLayer

    const stationLayer = new VectorLayer({
      source: new VectorSource({
        url: "/data/Rail_route_station_2023.geojson",
        format: new GeoJSON(),
      }),
      style: new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: "#0081cc" }),
          stroke: new Stroke({ color: "#ffffff", width: 1 }),
        }),
      }),
      visible: showStation,
    })
    stationLayerRef.current = stationLayer

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        routeLayer,
        stationLayer,
      ],
      view: new View({
        center: fromLonLat([127, 36]),
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        extent: koreaExtent,
      }),
    })

    mapObj.current = map

    return () => {
      map.setTarget(undefined)
    }
  }, [])

  /** =====================
   * 결함 레이어
   * ===================== */
  useEffect(() => {
    if (!mapObj.current || !defectList) return

    if (defectLayerRef.current) {
      mapObj.current.removeLayer(defectLayerRef.current)
    }

    const features = defectList.map(
      (item) =>
        new Feature({
          geometry: new Point(
            fromLonLat([item.longitude, item.latitude])
          ),
          ...item,
        })
    )

    const defectLayer = new VectorLayer({
      source: new VectorSource({ features }),
      style: new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: "#ff4d4f" }),
          stroke: new Stroke({ color: "#ffffff", width: 1 }),
        }),
      }),
      visible: showDefect,
    })

    defectLayerRef.current = defectLayer
    mapObj.current.addLayer(defectLayer)
  }, [defectList, showDefect])

  /** =====================
   * 클릭 Overlay
   * ===================== */
  useEffect(() => {
    if (!mapObj.current) return

    const tooltipEl = document.createElement("div")
    tooltipEl.style.cssText = `
      background: white;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ddd;
      font-size: 13px;
      min-width: 220px;
    `

    const overlay = new Overlay({
      element: tooltipEl,
      offset: [0, -10],
      positioning: "bottom-center",
    })

    overlayRef.current = overlay
    mapObj.current.addOverlay(overlay)

    const map = mapObj.current

    map.on("singleclick", (evt) => {
      const feature = map.forEachFeatureAtPixel(
        evt.pixel,
        (f) => f
      )

      if (feature && feature.get("problemNum")) {
        const props = feature.getProperties()

        tooltipEl.innerHTML = `
          <b>${props.problemNum}</b><br/>
          유형: ${props.problemType}<br/>
          등급: ${props.severity}<br/>
          노선: ${props.railType}<br/>
          상태: ${props.status}<br/>
          <button id="detail-btn"
            style="
              margin-top:8px;
              padding:6px 10px;
              background:#1677ff;
              color:white;
              border:none;
              border-radius:4px;
              cursor:pointer;
            ">
            자세히 보기
          </button>
        `

        overlay.setPosition(
          (feature.getGeometry() as Point).getCoordinates()
        )

        setTimeout(() => {
          const btn = document.getElementById("detail-btn")
          if (btn) {
            btn.onclick = () =>
              navigate(`/problems/${props.id}`)
          }
        })
      } else {
        // 빈 곳 클릭 → 오버레이 닫기
        overlay.setPosition(undefined)
      }
    })

    return () => {
      map.removeOverlay(overlay)
    }
  }, [navigate])

  /** =====================
   * 레이어 토글
   * ===================== */
  useEffect(() => {
    routeLayerRef.current?.setVisible(showRoute)
  }, [showRoute])

  useEffect(() => {
    stationLayerRef.current?.setVisible(showStation)
  }, [showStation])

  useEffect(() => {
    defectLayerRef.current?.setVisible(showDefect)
  }, [showDefect])

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
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
        <label>
          <input
            type="checkbox"
            checked={showRoute}
            onChange={() => setShowRoute(!showRoute)}
          />{" "}
          노선
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showStation}
            onChange={() => setShowStation(!showStation)}
          />{" "}
          역
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showDefect}
            onChange={() => setShowDefect(!showDefect)}
          />{" "}
          결함
        </label>
      </div>

      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}

export default TestMap
