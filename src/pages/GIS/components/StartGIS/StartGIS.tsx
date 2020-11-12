import React, { useEffect, useRef, useState } from "react";
import "./StartGIS.less";
import { loadCss, loadModules } from "esri-loader";

export default function StartGIS(): JSX.Element {

    const mapRef: any = useRef();
    const [clickIndex, setClickIndex] = useState(0);


    useEffect(() => {
        loadCss();
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        loadModules([
            'esri/Map',
            'esri/views/MapView',
            "esri/layers/GraphicsLayer",
            "esri/widgets/Sketch",
            "esri/Graphic",
            "esri/geometry/geometryEngine",
        ]).then(([
            ArcGISMap,
            MapView,
            GraphicsLayer,
            Sketch,
            Graphic,
            geometryEngine
        ]) => {
            const graphicLayer = new GraphicsLayer();
            // const disGraphicLayer = new GraphicsLayer();
            const map = new ArcGISMap({
                basemap: 'topo-vector',
                layers: [graphicLayer]
            });
            const view = new MapView({
                container: mapRef.current,
                map: map,
                center: [-118, 34],
                zoom: 8
            });

            const sketch = new Sketch({
                view: view,
                layer: graphicLayer
            });
            view.ui.add(sketch, "top-right");
            // 2020-09-16 粉刷匠 去掉底部esri标志
            view.ui._removeComponents(["attribution"]);

            let lineGraphic: any = null;
            let textGraphic: any = null;
            const drawLine = (point: any, point2: any) => {
                view.graphics.remove(lineGraphic);
                view.graphics.remove(textGraphic);
                lineGraphic = new Graphic({
                    geometry: {
                        type: "polyline",
                        paths: [
                            [point.longitude, point.latitude],
                            [point2.longitude, point2.latitude]
                        ]
                    },
                    symbol: {
                        type: "simple-line",
                        color: "#333",
                        width: 1
                    }
                })
                const distance = geometryEngine.geodesicLength(lineGraphic.geometry, "miles");
                textGraphic = new Graphic({
                    geometry: point2,
                    symbol: {
                        type: "text",
                        text: distance.toFixed(2) + " miles",
                        color: "black",
                        font: {
                            size: 12
                        },
                        haloColor: "white",
                        haloSize: 1
                    }
                });

                view.graphics.add(lineGraphic);
                view.graphics.add(textGraphic);
            }

            let startPoint: any = null;
            let endPoint: any = null;
            let inputPoint: any = [];
            view.on("click", (e: any) => {
                if (clickIndex === 0) {
                    if (inputPoint.length === 2) {
                        inputPoint = [];
                        view.graphics.remove(lineGraphic);
                        view.graphics.remove(startPoint);
                        view.graphics.remove(endPoint);
                    }
                    inputPoint.push(e.mapPoint);

                    if (inputPoint.length === 1) {
                        startPoint = new Graphic({
                            geometry: e.mapPoint,
                            symbol: {
                                type: "simple-marker",
                                color: [226, 119, 40], // orange
                                outline: {
                                    color: [255, 255, 255], // white
                                    width: 1
                                }
                            }
                        });
                        view.graphics.add(startPoint);
                    }

                    if (inputPoint.length === 2) {
                        endPoint = new Graphic({
                            geometry: e.mapPoint,
                            symbol: {
                                type: "simple-marker",
                                color: [226, 119, 40], // orange
                                outline: {
                                    color: [255, 255, 255], // white
                                    width: 1
                                }
                            }
                        });
                        view.graphics.add(endPoint);

                        const p1 = inputPoint[inputPoint.length - 2];
                        const p2 = inputPoint[inputPoint.length - 1];
                        drawLine(p1, p2);
                    }
                }
            })

            view.on("pointer-move", (e: any) => {
                if (clickIndex === 0) {
                    if (inputPoint.length === 1) {
                        const p1 = inputPoint[0];
                        const p2 = view.toMap(e);
                        drawLine(p1, p2);
                    }
                }
            })

            return () => {
                if (view) {
                    view.container = null;
                }
            }
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className="startgis-container">
            <div className="test">
                测试数据
            </div>
            <div className="webmap" ref={mapRef} />
            <div className="btn-group">
                <div className={`sig-btn ${clickIndex === 0 ? "sig-btn-sel" : ""}`} onClick={() => { setClickIndex(0) }} >距离</div>
                <div className={`sig-btn ${clickIndex === 1 ? "sig-btn-sel" : ""}`} onClick={() => { setClickIndex(1) }}  >面积</div>
            </div>
        </div>
    )
}