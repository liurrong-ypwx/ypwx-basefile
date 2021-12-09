import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

window.CESIUM_BASE_URL = './cesium/';
// Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);// 西南东北，默认显示中国
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTIxYjQ0Yi1kODkwLTQwYTctYTdjNi1hOTkwYTRhYTI2NDEiLCJpZCI6MzY4OTQsImlhdCI6MTYwNDMwMzkzM30.btKZ2YlmB0wCTBvk3ewmGk5MAjS5rwl_Izra03VcrnY';


// 初始化地图
export const initMap = (domID: string) => {

    if (!document.getElementById(domID)) return;

    const viewer = new Cesium.Viewer(domID, {
        geocoder: false,
        homeButton: true,
        sceneModePicker: false,
        baseLayerPicker: true,
        navigationHelpButton: false,
        animation: false,
        fullscreenButton: false,
        vrButton: false,
        selectionIndicator: false,
        infoBox: false,
        // terrainProvider: Cesium.createWorldTerrain(),
    })

    // viewer.scene.globe.imageryLayers.get(0).alpha = 0.0;
    // viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 1); //默认为蓝色，这里改成绿色

    // 额外设置之显示帧速
    viewer.scene.debugShowFramesPerSecond = true;

    return viewer;
}


// 缩放到深圳
export const zoomToShenzhen = (viewer: any) => {
    const locationSZ = { lng: 114.167, lat: 22.67, height: 130000.0 };
    const location = locationSZ;
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, location.height),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
        }
    });
}

// 添加3Dtiles地图服务
export const addShenzhenBuilding3Dtile = (viewer: any) => {
    const tmpTileset = new Cesium.Cesium3DTileset({
        // url: "./Models/szNanshan/tileset.json",
        url:"http://localhost:9000/model/d7d5f9e058cc11ecac096d8016c07366/tileset.json"
    })

    // 给建筑物添加shader
    tmpTileset.readyPromise.then(function (tileset: any) {
        viewer.scene.primitives.add(tmpTileset);

        // tileset.style = new Cesium.Cesium3DTileStyle({
        //     color: {
        //         conditions: [
        //             ['true', 'rgba(0, 127.5, 255 ,1)']//'rgb(127, 59, 8)']
        //         ]
        //     }
        // });

    })
}

// 设置建筑物贴地
export const set3DtilesHeight = (height: number, tileset: any) => {
    // const height = 10;
    const cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
    );
    const surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        0.0
    );
    const offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        height
    );
    const translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
    );
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}