import React, { useEffect } from "react";
import "./GetStart.less";
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
window.CESIUM_BASE_URL = './cesium/';


function GetStart(): JSX.Element {

    useEffect(() => {

        // Your access token can be found at: https://cesium.com/ion/tokens.
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTIxYjQ0Yi1kODkwLTQwYTctYTdjNi1hOTkwYTRhYTI2NDEiLCJpZCI6MzY4OTQsImlhdCI6MTYwNDMwMzkzM30.btKZ2YlmB0wCTBvk3ewmGk5MAjS5rwl_Izra03VcrnY';
        // Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
        const viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: Cesium.createWorldTerrain()
        });
        // Add Cesium OSM Buildings, a global 3D buildings layer.
        const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
        // Fly the camera to San Francisco at the given longitude, latitude, and height.
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-15.0),
            }
        });

    }, [])



    return (
        <div className="main-map-container">
            <div id='cesiumContainer' />
        </div>
    )
}

export default GetStart;
