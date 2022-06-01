import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { EchartPoint } from '../../../../utils/CesiumApi/WithEchart/EchartPoint';
// import { EchartWinds} from "../../../../utils/CesiumApi/WithEchart/EchartWinds";
import { MultiLinePipe } from "../../../../pages/CesiumDemo/UgPipe/data";
import jt from "../../../../assets/image/JT2.png";
// import { dataMId } from './testData';
// import { szLineData, szSxtData } from '../DataXJG/riverData';
import normalMap from "../../../../assets/image/fabric_normal.jpg";
import { textRiverJson0530 } from './riverData';
// import { ColorArr } from './testColor';
import { testLine, treePoint, xiaoqu } from './xiaoqu';
import { glbLoc } from './glbloc';

// import { testDataPipe } from './pipe2';


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
        terrainProvider: Cesium.createWorldTerrain(),
    })

    // 演示1：添加免费的osm 建筑物图层
    // viewer.scene.primitives.add(Cesium.createOsmBuildings());

    viewer.scene.globe.imageryLayers.get(0).alpha = 0.4;
    viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 1);


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

    // 场景变暗
    // changeViewerColor(viewer);

    // 添加河流
    addRiver(viewer);

    // 添加建筑物设置样式
    addGBuilding(viewer);

    // 添加管道
    // addPipe(viewer);

    // 添加流动线
    // addMutTypeLine(viewer);

    // 添加摄像头
    addCamera(viewer);

    // 添加建筑模型
    addJianzhu1(viewer);

    // 添加小区的边界线
    addXiaoqu(viewer);

    // 添加水体周边的草坪
    addCaoPing(viewer);

    return viewer;
}

// 2022-05-19 粉刷匠 添加河流
export const addRiver = (viewer: any) => {
    const orgdata = textRiverJson0530.features[0].geometry.coordinates[0][0];
    const fData: any = [];
    for (let i = 0; i < orgdata.length; i++) {
        fData.push(orgdata[i][0]);
        fData.push(orgdata[i][1]);
    }
    const data = fData;


    // 背景颜色
    const color = { r: 84, g: 220, b: 224, a: 150 };
    const backMaterial = new Cesium.Material({
        fabric: {
            type: 'Color',
            uniforms: {
                color: Cesium.Color.fromBytes(color.r, color.g, color.b, color.a)
            }
        }
    });
    const primitiveBack = new Cesium.GroundPrimitive({// 贴地的primitive
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({// 支持CircleGeometry，CorridorGeometry，EllipseGeometry，RectangleGeometry
                // polygonHierarchy: new Cesium.PolygonHierarchy([
                //     // Cesium.Cartesian3.fromDegreesArray(100，25，100，30，110，30)
                //     Cesium.Cartesian3.fromDegreesArrayHeights(shuiMian)
                // ])
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(data)),
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            }),
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            aboveGround: true,
            material: backMaterial
        }),
        show: true
    })
    viewer.scene.primitives.add(primitiveBack)

    // 流动水体
    let material: any = new Cesium.Material({
        fabric: {
            type: 'Water',
            uniforms: { // 动态传递参数
                baseWaterColor: Cesium.Color.WHITE.withAlpha(0.1), // 水体颜色
                blendColor: Cesium.Color.DARKBLUE, // 水陆混合处颜色
                // specularMap:"../../**/jpg", // 一张黑白图用来作为标识哪里是用水来渲染的贴图
                normalMap: Cesium.buildModuleUrl(normalMap), // 用来生成起伏效果的水体
                frequency: 1000.0,
                animationSpeed: 0.1,
                amplitude: 100000
            },
            // source: source
        },
        translucent: false
    })
    const primitive = new Cesium.GroundPrimitive({// 贴地的primitive
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({// 支持CircleGeometry，CorridorGeometry，EllipseGeometry，RectangleGeometry
                // polygonHierarchy: new Cesium.PolygonHierarchy([
                //     // Cesium.Cartesian3.fromDegreesArray(100，25，100，30，110，30)
                //     Cesium.Cartesian3.fromDegreesArrayHeights(shuiMian)
                // ])
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(data)),
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            }),
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            aboveGround: true,
            material: material
        }),
        show: true
    })
    viewer.scene.primitives.add(primitive)

}

// 2022-05-19 粉刷匠 添加建筑物
export const addGBuilding = (viewer: any) => {

    // const tmpTileset = Cesium.createOsmBuildings();

    // http://localhost:9003/model/tIk209L0g/tileset.json
    // http://localhost:9003/model/teOukBqr4/tileset.json
    // http://localhost:9003/model/tkVIcAoHG/tileset.json
    // http://localhost:9003/model/t9ODc8PCR/tileset.json

    const tmpTileset = new Cesium.Cesium3DTileset({
        url: ' http://localhost:9003/model/t9ODc8PCR/tileset.json',
        // 控制切片视角显示的数量，可调整性能
        maximumScreenSpaceError: 2,
        // maximumNumberOfLoadedTiles: 100000,
    })


    // 给建筑物添加shader
    // viewer.scene.primitives.add(Cesium.createOsmBuildings());

    tmpTileset.readyPromise.then(function (tileset: any) {
        viewer.scene.primitives.add(tmpTileset);

        // tileset.style = new Cesium.Cesium3DTileStyle({
        //     color: {
        //         conditions: [
        //             ['true', 'rgba(0, 127.5, 255 ,1)']//'rgb(127, 59, 8)']
        //         ]
        //     }
        // });

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
        //                     "    gl_FragColor *= vec4(vec3(position.z / 200.0), 1);\n" +
        //                     "    float time = fract(czm_frameNumber / 120.0);\n" +
        //                     "    time = abs(time - 0.5) * 2.0;\n" +
        //                     // "    float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));\n" +
        //                     // "    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);\n" +
        //                     "    gl_FragColor.rgb += gl_FragColor.rgb ;\n" +
        //                     "}\n"
        //             })
        //             model._shouldRegenerateShaders = true
        //         }
        //     }
        // });

        // 设置3dTiles贴地
        set3DtilesHeight(20, tileset);

        // 设置hover事件
        // addHoverAction(tileset, viewer);

    })
}

export const addCamera = (viewer: any) => {
    // 摄像头
    // const sxtArr = [[104.06273, 30.77760, 490], [104.04797, 30.76234, 490], [104.06862, 30.76404, 490]];
    const sxtArr = [];

    const orgData = treePoint.features;
    for (let i = 0; i < orgData.length; i++) {
        const loc = orgData[i].geometry.coordinates;
        sxtArr.push([loc[0], loc[1]]);
    }
    const tmpArr = ['sxt', 'l0', 'l1', 'l2', 'l3', 'l4', 'l5', 'l6'];
    for (let i = 0; i < sxtArr.length; i += 4) {
    // const index = Math.floor(Math.random() * (tmpArr.length));
        const index = 0;

        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(sxtArr[i][0], sxtArr[i][1], sxtArr[i][2]),
            billboard: {                
                image: `./Models/image/${tmpArr[index]}.png`,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                scaleByDistance: new Cesium.NearFarScalar(500, 0.11, 2000, 0.1)
            }
        });
    }
}

// 改变场景颜色
export const changeViewerColor = (viewer: any) => {
    // Simple stage to change the color
    var fs =
        'uniform sampler2D colorTexture;\n' +
        'varying vec2 v_textureCoordinates;\n' +
        'uniform float scale;\n' +
        'uniform vec3 offset;\n' +
        'void main() {\n' +
        '    vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
        '    gl_FragColor = vec4(color.rgb * scale + offset, 1.0);\n' +
        '}\n';
    viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
        fragmentShader: fs,
        uniforms: {
            scale: 0.1,
            offset: function () {
                return new Cesium.Cartesian3(0.1, 0.2, 0.3);
            }
        }
    }));
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
        imgWidth: 1660,
        imgHeight: 257,
        minR: 0,
        maxR: 1660,
        deviationR: 30,// 差值 差值也大 速度越快
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

    const featureData = testLine.features;
    for (let i = 0; i < featureData.length; i++) {
        const orgdata = featureData[i].geometry.coordinates[0];
        const newLineData: any = [];
        for (let j = 0; j < orgdata.length; j++) {
            newLineData.push(orgdata[j][0]);
            newLineData.push(orgdata[j][1]);
            newLineData.push(22);
        }

        viewer.entities.add({
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(newLineData),
                width: 10,
                // clampToGround: true,
                // 流动纹理
                material: new Cesium.ImageMaterialProperty({
                    image: new Cesium.CallbackProperty(makeJT, false),
                    repeat: new Cesium.Cartesian2(50.0, 1.0),
                    transparent: true,
                })

            },
        });

    }

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

    // const featureData = testLine.features;

    // for (let i = 0; i < featureData.length; i++) {
    //     const orgdata = featureData[i].geometry.coordinates[0];
    //     const newLineData: any = [];
    //     for (let j = 0; j < orgdata.length; j++) {
    //         newLineData.push(orgdata[j][0]);
    //         newLineData.push(orgdata[j][1]);
    //         newLineData.push(19);
    //     }

    //     const sigcoordinatesOne = newLineData;
    //     viewer.entities.add({
    //         polylineVolume: {
    //             positions: Cesium.Cartesian3.fromDegreesArrayHeights(sigcoordinatesOne),
    //             shape: computeCircle(0.5),
    //             // outline: true,
    //             // outlineColor: Cesium.Color.WHITE,
    //             // outlineWidth: 1,
    //             // material: Cesium.Color.fromRandom({ alpha: 1.0 }),
    //             // .withAlpha(0.95),
    //             material: Cesium.Color.fromCssColorString("#ff0000"),
    //             // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
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
    // const locationSZ = { lng: testDataPipe[0], lat: testDataPipe[1], height: 1300.0 };
    // 121.364952802734749, 31.188761707341701
    const locationSZ = { lng: 121.364952802734749, lat: 31.188761707341701, height: 1300.0 };
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

// 2021-08-16 粉刷匠 添加水坝
export const addJianzhu1 = (viewer: any) => {
    const airplaneUrl = "./Models/House4.glb";
    const newHouse = "./Models/newHouse.glb";
    const newHouse2 = "./Models/newHouse2.glb";
    const glbArr = [airplaneUrl, newHouse, newHouse2];

    const loc1 = glbLoc.features;
    const WaterControlPoint = [];
    for (let i = 0; i < loc1.length; i++) {
        const sigLoc = loc1[i].geometry.coordinates;
        WaterControlPoint.push(sigLoc[0]);
        WaterControlPoint.push(sigLoc[1]);
        WaterControlPoint.push(20);
        WaterControlPoint.push(90);
    }   

    // const WaterControlPoint = [
    //     121.364952802734749, 31.188761707341701, 20, 90,
    // ]

    for (let i = 0; i < WaterControlPoint.length; i += 4) {
        // const cord = [104.04486, 30.77336, 504];

        // const index = Math.floor(Math.random() * 3);
        const cord = [WaterControlPoint[i], WaterControlPoint[i + 1], WaterControlPoint[i + 2]];
        const cartesian = Cesium.Cartesian3.fromDegrees(cord[0], cord[1], cord[2]);
        const newHeading = Cesium.Math.toRadians(WaterControlPoint[i + 3]); //初始heading值赋0
        const newPitch = Cesium.Math.toRadians(0);
        const newRoll = Cesium.Math.toRadians(0);
        const headingPitchRoll = new Cesium.HeadingPitchRoll(newHeading, newPitch, newRoll);
        const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(cartesian, headingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.Matrix4());

        const curModel = viewer.scene.primitives.add(Cesium.Model.fromGltf({
            url: glbArr[0], // 模型地址
            modelMatrix,
        }));

        // todo:平移,可使用偷懒方法，修改Cesium.Cartesian3.fromDegrees(110.95, 23.40, 100); 

        // 放大一点
        curModel.scale = 2;
    }


}

// 添加草坪，同上
export const addCaoPing= (viewer: any) => {
    const airplaneUrl = "./Models/send.glb";

    // const loc1 = glbLoc.features;
    // const WaterControlPoint = [];
    // for (let i = 0; i < loc1.length; i++) {
    //     const sigLoc = loc1[i].geometry.coordinates;
    //     WaterControlPoint.push(sigLoc[0]);
    //     WaterControlPoint.push(sigLoc[1]);
    //     WaterControlPoint.push(20);
    //     WaterControlPoint.push(90);
    // }   

    const WaterControlPoint = [
        121.364952802734749, 31.188761707341701, 20, 90,
    ]

    for (let i = 0; i < WaterControlPoint.length; i += 4) {
        // const cord = [104.04486, 30.77336, 504];

        // const index = Math.floor(Math.random() * 3);
        const cord = [WaterControlPoint[i], WaterControlPoint[i + 1], WaterControlPoint[i + 2]];
        const cartesian = Cesium.Cartesian3.fromDegrees(cord[0], cord[1], cord[2]);
        const newHeading = Cesium.Math.toRadians(WaterControlPoint[i + 3]); //初始heading值赋0
        const newPitch = Cesium.Math.toRadians(0);
        const newRoll = Cesium.Math.toRadians(0);
        const headingPitchRoll = new Cesium.HeadingPitchRoll(newHeading, newPitch, newRoll);
        const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(cartesian, headingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.Matrix4());

        const curModel = viewer.scene.primitives.add(Cesium.Model.fromGltf({
            url: airplaneUrl, // 模型地址
            modelMatrix,
        }));

        // todo:平移,可使用偷懒方法，修改Cesium.Cartesian3.fromDegrees(110.95, 23.40, 100); 

        // 放大一点
        curModel.scale = 2;
    }


}

// 添加小区
export const addXiaoqu = (viewer: any) => {
    const data = {
        minR: 1,
        maxR: 100,
        deviationR: 5,// 差值 差值也大 速度越快
    }
    let r1 = data.minR;
    
    function makeImg() { // 这是callback，参数不能内传  
        r1 = r1 + data.deviationR;// deviationR为每次圆增加的大小
        if (r1 >= data.maxR) {
            r1 = data.minR;
        }
        const ramp = getColorRamp([0, 0, 0, 0, 0, 0.54, 1.0], true, r1)
        return ramp;
    }

    const xiaoqiData = xiaoqu.features;
    for (let i = 0; i < xiaoqiData.length; i++) {
        const cord = xiaoqiData[i].geometry.coordinates[0][0];
        const tmpCord: any = [];
        const minimumHeights = [];
        const maximumHeights = [];
        for (let j = 0; j < cord.length; j++) {
            tmpCord.push(cord[j][0]);
            tmpCord.push(cord[j][1]);
            tmpCord.push(0);
            minimumHeights.push(20);
            maximumHeights.push(30);
        }

        // 添加动态墙
        viewer.entities.add({
            name: `wall${i}`,
            wall: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(tmpCord),
                minimumHeights: minimumHeights,
                maximumHeights: maximumHeights,
                // maximumHeights: new Cesium.CallbackProperty(changeR1, false),
                material: new Cesium.ImageMaterialProperty({
                    // image: getColorRamp([0, 0, 0, 0, 0, 0.54, 1.0], true),
                    image: new Cesium.CallbackProperty(makeImg, false),
                    transparent: true
                })
                // outline: true,
            }
        })
    }




}

// 获取颜色渐变条带
const getColorRamp = (elevationRamp: any, isTransparent?: boolean, height?: number) => {
    const ramp = document.createElement('canvas');
    ramp.width = 1;
    ramp.height = 100;
    const ctx: any = ramp.getContext('2d');

    const values = elevationRamp;
    const grd = ctx.createLinearGradient(0, 0, 0, 100);

    // const colorIndex = Math.floor(Math.random() * (ColorArr.length));
    // grd.addColorStop(values[0], '#000000'); //black
    // grd.addColorStop(values[1], '#2747E0'); //blue
    // grd.addColorStop(values[2], '#D33B7D'); //pink
    // grd.addColorStop(values[3], '#D33038'); //red
    // grd.addColorStop(values[4], '#FF9742'); //orange
    // grd.addColorStop(values[5], '#ffd700'); //yellow
    grd.addColorStop(height ? (1 - height * 0.01) : values[5], 'transparent'); //yellow
    grd.addColorStop(values[6], '#00FFFF'); //white

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1, 100);
    return ramp;
}