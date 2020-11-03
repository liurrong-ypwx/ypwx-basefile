import React, { useEffect, useRef } from "react";
import "./StartGIS.less";
import { loadCss, loadModules } from "esri-loader";

export default function StartGIS(): JSX.Element {

    const mapRef: any = useRef();

    useEffect(() => {
        loadCss();
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        loadModules([
            'esri/Map',
            'esri/views/MapView',
            "esri/layers/GraphicsLayer",
            "esri/widgets/Sketch",
        ]).then(([
            ArcGISMap,
            MapView,
            GraphicsLayer,
            Sketch
        ]) => {
            const graphicLayer = new GraphicsLayer();
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

            const sketch=new Sketch({
                view:view,
                layer:graphicLayer
            });
            view.ui.add(sketch, "top-right");

            // 2020-09-16 粉刷匠 去掉底部esri标志
            view.ui._removeComponents(["attribution"]);

            return () => {
                if (view) {
                    view.container = null;
                }
            }
        })
    }, [])

    return (
        <div className="startgis-container">
            <div className="test">
                测试数据
            </div>
            <div className="webmap" ref={mapRef} />
        </div>
    )
}