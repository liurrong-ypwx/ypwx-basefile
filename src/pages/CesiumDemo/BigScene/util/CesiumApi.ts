import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { EchartPoint } from '../../../../utils/CesiumApi/WithEchart/EchartPoint';
// import { EchartWinds} from "../../../../utils/CesiumApi/WithEchart/EchartWinds";
import { MultiLinePipe } from "../../../../pages/CesiumDemo/UgPipe/data";
import jt from "../../../../assets/image/newDir.png";
import { dataMId } from './testData';
import { testDataPipe } from './pipe2';


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


    // viewer.scene.fxaa = false
    viewer.scene.postProcessStages.fxaa.enabled = true;

    // var supportsImageRenderingPixelated = viewer.cesiumWidget._supportsImageRenderingPixelated;
    // if (supportsImageRenderingPixelated) {
    //     var vtxf_dpr = window.devicePixelRatio;
    //     while (vtxf_dpr >= 2.0) { vtxf_dpr /= 2.0; }
    //     viewer.resolutionScale = vtxf_dpr;
    // }

    // if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) { // 判断是否支持图像渲染像素化处理
    viewer.resolutionScale = window.devicePixelRatio;
    // }




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

export const zoomToPara = (viewer: any, option: any) => {
    const locationSZ = { lng: option.lng, lat: option.lat, height: option.height };
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
    // const url = "http://localhost:9000/model/d7d5f9e058cc11ecac096d8016c07366/tileset.json";
    // var tileset = new Cesium.Cesium3DTileset({ url: url });
    // viewer.scene.primitives.add(tileset);

    const tmpTileset = new Cesium.Cesium3DTileset({
        url: "./Models/szNanshan/tileset.json",
        // url: "./Models/tiles_jianzhua_normal/tileset.json",
        // skipLevelOfDetail: true,
        // maximumScreenSpaceError: 8, //最大的屏幕空间误差
        // maximumMemoryUsage:1024
    })

    // 给建筑物添加shader
    tmpTileset.readyPromise.then(function (tileset: any) {
        viewer.scene.primitives.add(tmpTileset);

        tileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ['true', 'rgba(0, 127.5, 255 ,1)']//'rgb(127, 59, 8)']
                ]
            }
        });

        // tileset.tileVisible.addEventListener(function (tile: any) {
        //     const content = tile.content;
        //     const featuresLength = content.featuresLength;
        //     for (let i = 0; i < featuresLength; i += 2) {
        //         let feature = content.getFeature(i)
        //         let model = feature.content._model

        //         if (model && model._sourcePrograms && model._rendererResources) {
        //             Object.keys(model._sourcePrograms).forEach(key => {
        //                 let program = model._sourcePrograms[key]
        //                 let fragmentShader = model._rendererResources.sourceShaders[program.fragmentShader];
        //                 let v_position = "";
        //                 if (fragmentShader.indexOf(" v_positionEC;") !== -1) {
        //                     v_position = "v_positionEC";
        //                 } else if (fragmentShader.indexOf(" v_pos;") !== -1) {
        //                     v_position = "v_pos";
        //                 }
        //                 const color = `vec4(${feature.color.toString()})`;

        //                 model._rendererResources.sourceShaders[program.fragmentShader] =
        //                     "varying vec3 " + v_position + ";\n" +
        //                     "void main(void){\n" +
        //                     "    vec4 position = czm_inverseModelView * vec4(" + v_position + ",1);\n" +
        //                     "    float glowRange = 120.0;\n" +
        //                     "    gl_FragColor = " + color + ";\n" +
        //                     // "    gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0);\n" +
        //                     "    gl_FragColor *= vec4(vec3(position.z / 80.0), 1.0);\n" +
        //                     "    float time = fract(czm_frameNumber / 120.0);\n" +
        //                     "    time = abs(time - 0.5) * 2.0;\n" +
        //                     "    float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));\n" +
        //                     "    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);\n" +
        //                     "}\n"
        //             })
        //             model._shouldRegenerateShaders = true
        //         }
        //     }
        // });


        // 设置3dTiles贴地
        // set3DtilesHeight(500, tileset);

        // 设置hover事件
        // addHoverAction(tileset, viewer);

    })
}

// 设置建筑物贴 地
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

export const addFuseEchartGraphic = (viewer: any) => {
    // new EchartWinds(viewer);
    new EchartPoint(viewer);
}


// 2021-04-27 粉刷匠 补充-线管
export const addPolylineVolume = (viewer: any) => {

    function computeCircle(radius: number) {
        var positions = [];
        for (var i = 0; i < 360; i += 10) {
            var radians = Cesium.Math.toRadians(i);
            positions.push(
                new Cesium.Cartesian2(
                    radius * Math.cos(radians),
                    radius * Math.sin(radians)
                )
            );
        }
        return positions;
    }

    // function starPositions(arms: any, rOuter: any, rInner: any) {
    //     var angle = Math.PI / arms;
    //     var pos = [];
    //     for (var i = 0; i < 2 * arms; i++) {
    //         var r = i % 2 === 0 ? rOuter : rInner;
    //         var p = new Cesium.Cartesian2(
    //             Math.cos(i * angle) * r,
    //             Math.sin(i * angle) * r
    //         );
    //         pos.push(p);
    //     }
    //     return pos;
    // }

    const sigLine = MultiLinePipe.features;
    for (let i = 0; i < sigLine.length; i++) {
        const coordinates = sigLine[i].geometry.coordinates;
        for (let j = 0; j < coordinates.length; j++) {
            const sigcoordinates = coordinates[j];
            const sigcoordinatesOne = sigcoordinates.reduce((a: any, b: any) => { return a.concat(b) })
            viewer.entities.add({
                polylineVolume: {
                    positions: Cesium.Cartesian3.fromDegreesArray(sigcoordinatesOne),
                    shape: computeCircle(10),
                    // outline: true,
                    // outlineColor: Cesium.Color.WHITE,
                    // outlineWidth: 1,
                    material: Cesium.Color.fromRandom({ alpha: 1.0 }),
                    // material: Cesium.Color.fromCssColorString("#364141").withAlpha(0.5),
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,

                },
            });
        }
    }


}

// 2021-04-14 粉刷匠 添加各类线集合
export const addMutTypeLine = (viewer: any) => {


    // 1: 流动箭头线
    const data: any = {
        imgWidth: 315,
        imgHeight: 447,
        minR: 0,
        maxR: 315,
        deviationR: 10,// 差值 差值也大 速度越快
    }

    let r1 = data.minR;
    const imgWidth = data.imgWidth;
    const imgHeight = data.imgHeight;

    function makeJT() { // 这是callback，参数不能内传  
        r1 = r1 + data.deviationR;// deviationR为每次圆增加的大小
        if (r1 >= data.maxR) {
            r1 = data.minR;
        }
        const ramp = document.createElement('canvas');
        ramp.width = imgWidth;
        ramp.height = imgHeight;
        const ctx: any = ramp.getContext('2d');
        ctx.beginPath();
        const img = new Image();
        img.src = jt;
        img.onload = function () {
            // 将图片画到canvas上面上去！
            ctx.drawImage(img, r1, 0);
            ctx.drawImage(img, imgWidth - r1, 0, r1, imgHeight, 0, 0, r1, imgHeight);
            // ctx.drawImage(img, 0, 0);
        }
        return ramp;
    }


    const sigcoordinatesOne: any = [];
    for (let i = 0; i < dataMId.length; i += 3) {
        sigcoordinatesOne.push(dataMId[i + 1]);
        sigcoordinatesOne.push(dataMId[i + 2]);
        sigcoordinatesOne.push(80);
    }


    viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(sigcoordinatesOne),
            width: 10,
            // clampToGround: true,
            // 流动纹理
            material: new Cesium.ImageMaterialProperty({
                image: new Cesium.CallbackProperty(makeJT, false),
                repeat: new Cesium.Cartesian2(400.0, 1.0),
                transparent: true,
            })

        },
    });


}

export const addTdt = (viewer: any) => {
    //影像
    // viewer.imageryLayers.addImageryProvider(
    //     new Cesium.WebMapTileServiceImageryProvider({
    //         url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=077b9a921d8b7e0fa268c3e9146eb373",
    //         layer: "tdtBasicLayer",
    //         style: "default",
    //         format: "image/jpeg",
    //         tileMatrixSetID: 'GoogleMapsCompatible',
    //     }),
    // );

    // 矢量
    // viewer.imageryLayers.addImageryProvider(
    //     new Cesium.WebMapTileServiceImageryProvider({
    //         // url: "http://{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
    //         //     "&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    //         //     "&style=default&format=tiles&tk=077b9a921d8b7e0fa268c3e9146eb373",
    //         url: "http://t6.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&FORMAT=tiles&tk=0ffbace33f0235207d70c43cbbe91e04",
    //         // url: "https://{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=ebf64362215c081f8317203220f133eb",
    //         layer: "tdtCva",
    //         style: "default",
    //         format: "tiles",
    //         tileMatrixSetID: "c",
    //         subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    //         tilingScheme: new Cesium.GeographicTilingScheme(),
    //         tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
    //         maximumLevel: 18,
    //         // ellipsoid: new Cesium.Ellipsoid(6378245, 6356863.0187730473, 1 / 298.3)
    //     })
    // );

    addGeoJsonData(viewer);



    // 注记
    //   viewer.imageryLayers.addImageryProvider(
    //     new Cesium.WebMapTileServiceImageryProvider({
    //         url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=077b9a921d8b7e0fa268c3e9146eb373",
    //         layer: "tdtAnnoLayer",
    //         style: "default",
    //         format: "image/jpeg",
    //         tileMatrixSetID: 'GoogleMapsCompatible',
    //     })
    // );
}

// 2022-05-09 粉刷匠 先试一下管道到底是什么样的
export const addPipe = (viewer: any) => {

    // function computeCircle(radius: number) {
    //     var positions = [];
    //     for (var i = 0; i < 360; i += 10) {
    //         var radians = Cesium.Math.toRadians(i);
    //         positions.push(
    //             new Cesium.Cartesian2(
    //                 radius * Math.cos(radians),
    //                 radius * Math.sin(radians)
    //             )
    //         );
    //     }
    //     return positions;
    // }

    // const sigLine = testDataPipe4;
    // for (let i = 0; i < sigLine.length; i += 4) {


    //     // const orglng1 = sigLine[i];
    //     // const orglat1 = sigLine[i + 1];
    //     // const orglng2 = sigLine[i + 2];
    //     // const orglat2 = sigLine[i + 3];

    //     const lng1 = sigLine[i];
    //     const lat1 = sigLine[i + 1];
    //     const lng2 = sigLine[i + 2];
    //     const lat2 = sigLine[i + 3];

    //     // lat84
    //     // const a1 = 0.0002;
    //     // const b1 = 1;
    //     // const c1 = 0;

    //     // // lng84
    //     // const a2 = 0.00001;
    //     // const b2 = 0;
    //     // const c2 =  1;

    //     // // a + b*x  + c*y   x:lat54 y:lng54

    //     // const lng1 = a2 + b2 * orglat1 + c2 * orglng1;
    //     // const lat1 = a1 + b1 * orglat1 + c1 * orglng1;
    //     // const lng2 = a2 + b2 * orglat2 + c2 * orglng2;
    //     // const lat2 = a1 + b1 * orglat2 + c1 * orglng2;

    //     const sigcoordinatesOne = [lng1, lat1, lng2, lat2]
    //     viewer.entities.add({
    //         polylineVolume: {
    //             positions: Cesium.Cartesian3.fromDegreesArray(sigcoordinatesOne),
    //             shape: computeCircle(0.5),
    //             // outline: true,
    //             // outlineColor: Cesium.Color.WHITE,
    //             // outlineWidth: 1,
    //             // material: Cesium.Color.fromRandom({ alpha: 1.0 }),
    //             // .withAlpha(0.95),
    //             material: Cesium.Color.fromCssColorString("#ff0000"),
    //             heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,

    //         },
    //     });

    // }

    // 添加一个测试使用的图层服务
    //     viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    //         url: 'https://www.jj-zhps.cn/geoserver/jiaojiang/wms?',   //服务地址
    //         layers: 'jiaojiang:ST_PS_PIPE_ZY',                    //服务图层，修改成自己发布的名称
    //         parameters: {
    //         service: 'WMS',
    //         format: 'image/png',
    //         transparent: true
    //        },
    //    }));

}

// 
export const addGeoJsonData = (viewer: any) => {
    viewer.dataSources.add(Cesium.GeoJsonDataSource.load('./Models/json/SZDD.geojson', {
        clampToGround: true,
        stroke: Cesium.Color.BLUE,
        strokeWidth: 1,
        markerSymbol: '?'
    }));
}

// 简单缩放
export const zoomPipe = (viewer: any) => {
    const locationSZ = { lng: testDataPipe[0], lat: testDataPipe[1], height: 1300.0 };
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