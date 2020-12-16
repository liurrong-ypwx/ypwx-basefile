import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
window.CESIUM_BASE_URL = './cesium/';
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTIxYjQ0Yi1kODkwLTQwYTctYTdjNi1hOTkwYTRhYTI2NDEiLCJpZCI6MzY4OTQsImlhdCI6MTYwNDMwMzkzM30.btKZ2YlmB0wCTBvk3ewmGk5MAjS5rwl_Izra03VcrnY';

const locationSZ = { lng: 114.167, lat: 22.67, height: 130000.0 };
// const locationJDY = { lng: 104.06, lat: 30.78, height: 13000.0 };
const location = locationSZ;

// 初始化地图
export const initMap = (domID: string, isAddBuilding: boolean) => {

    if (!document.getElementById(domID)) return;

    const viewer = new Cesium.Viewer(domID, {
        terrainProvider: Cesium.createWorldTerrain()
    })
    if (isAddBuilding) {
        const tmpTileset = new Cesium.Cesium3DTileset({
            url: "./Models/building/tileset.json"
        })
        tmpTileset.style = new Cesium.Cesium3DTileStyle({
            color : {
                conditions : [
                    ['${Height} >= 200', 'color("purple", 0.5)'],
                    ['${Height} >= 100', 'color("red")'],
                    ['true', 'color("blue")']
                ]
            },
            show : '${Height} > 0',
            meta : {
                description : '"Building id ${id} has height ${Height}."'
            }
         });
        viewer.scene.primitives.add(tmpTileset);
    }

  

    setExtent(viewer);
    return viewer;
}

// 缩放到指定位置
export const setExtent = (viewer: any) => {
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, location.height),
        orientation: {
            heading:Cesium.Math.toRadians(0),
            pitch:Cesium.Math.toRadians(-90),
            roll: 0.0
        }
    });
}

// 添加building
export const addBuilding = (viewer: any, buildingUrl: string) => {
    var entity = viewer.entities.add({
        name: "plane",
        position: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, 1300.0),
        model: {
            uri: "./Models/building.glb",         
        }
    });
    //设置摄像头定位到模型处
    viewer.trackedEntity = entity;
}