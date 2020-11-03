import React, { useEffect } from "react";
import "./ChBuild.less";
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
window.CESIUM_BASE_URL = './cesium/';

function ChBuild(): JSX.Element {

    useEffect(() => {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTIxYjQ0Yi1kODkwLTQwYTctYTdjNi1hOTkwYTRhYTI2NDEiLCJpZCI6MzY4OTQsImlhdCI6MTYwNDMwMzkzM30.btKZ2YlmB0wCTBvk3ewmGk5MAjS5rwl_Izra03VcrnY';
        const viewer=new Cesium.Viewer("cesiumContainer",{
            terrainProvider: Cesium.createWorldTerrain()
        })
        const buildingsTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
        // 隐藏建筑物
        buildingsTileset.style=new Cesium.Cesium3DTileStyle({
            show:{
                conditions:[
                    ['${elementId} === 332469316', false],
                    ['${elementId} === 332469317', false],
                    ['${elementId} === 235368665', false],
                    ['${elementId} === 530288179', false],
                    ['${elementId} === 530288180', false],
                    ['${elementId} === 532245203', false],
                    [true, true]
                ]
            },
            color: "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')"
        })

        // STEP 6 CODE
        // Add the 3D Tileset you created from your Cesium ion account.
        const dataPoint = { longitude: -104.9909, latitude: 39.73579, height: 1577 };
        // const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
        const newBuildingTileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: Cesium.IonResource.fromAssetId(178429),
                modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
                    Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height)
                ),
            }),            
        );
        // Move the camera to the new building.
        viewer.flyTo(newBuildingTileset);

        // viewer.camera.flyTo({
        //     destination: Cesium.Cartesian3.fromDegrees(-104.9963, 39.74248, 4000)
        // })

        const addBuildingGeoJSON = async () => {
            const geoJSONURL = await Cesium.IonResource.fromAssetId(178412);
            // Create the geometry from the GeoJSON, and clamp it to the ground.
            const geoJSON = await Cesium.GeoJsonDataSource.load(geoJSONURL, { clampToGround: true });
            // Add it to the scene.
            const dataSource = await viewer.dataSources.add(geoJSON);
            // By default, polygons in CesiumJS will be draped over all 3D content in the scene.
            // Modify the polygons so that this draping only applies to the terrain, not 3D buildings.
            for (const entity of dataSource.entities.values) {
                const t: any = entity.polygon;
                t.classificationType = Cesium.ClassificationType.TERRAIN;
            }
            // Move the camera so that the polygon is in view.
            viewer.flyTo(dataSource);
        }

        addBuildingGeoJSON();

        const tmpButton=document.getElementById("toggle-building");
        if(tmpButton){
            tmpButton.addEventListener("click",()=>{
                newBuildingTileset.show = !newBuildingTileset.show;
            })
        }

    },[])

    return (
        <div className="main-map-container">
            {/* 初始化一个框来放置场景 */}
            <div id='cesiumContainer' />
            <button id="toggle-building" style={{ position: "fixed", zIndex: 1, top: 5, left: 5 }}>TOGGLE NEW BUILDINGS</button>
        </div>
    )
}

export default ChBuild;