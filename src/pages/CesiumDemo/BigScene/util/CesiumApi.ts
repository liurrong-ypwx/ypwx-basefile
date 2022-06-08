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
import { sendPoint, shuiweiDian, testFly, testLine, testPoint, xiaoqu } from './xiaoqu';
import { glbLoc } from './glbloc';
import { newTreePoint } from './newTreePoint';
import { newFourPoint } from './newFourPoint';
// import { makeVirticelLine } from '../../../../utils/CesiumApi/CesiumApi';

// import { testDataPipe } from './pipe2';


window.CESIUM_BASE_URL = './cesium/';
// Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);// 西南东北，默认显示中国
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTIxYjQ0Yi1kODkwLTQwYTctYTdjNi1hOTkwYTRhYTI2NDEiLCJpZCI6MzY4OTQsImlhdCI6MTYwNDMwMzkzM30.btKZ2YlmB0wCTBvk3ewmGk5MAjS5rwl_Izra03VcrnY';


// 初始化地图
export const initMap = (domID: string, callBack?: any, callBackClick?: any) => {

    if (!document.getElementById(domID)) return;

    const viewer = new Cesium.Viewer(domID, {
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        fullscreenButton: false,
        vrButton: false,
        selectionIndicator: false,
        infoBox: false,
        timeline: false,
        terrainProvider: Cesium.createWorldTerrain(),
    })

    // 演示1：添加免费的osm 建筑物图层
    // viewer.scene.primitives.add(Cesium.createOsmBuildings());

    // viewer.scene.globe.imageryLayers.get(0).alpha = 0.9;
    // viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 1);

    // viewer.cesiumWidget.creditContainer.style.display = "none";

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
    // viewer.scene.debugShowFramesPerSecond = true;

    // 场景变暗
    changeViewerColor(viewer);

    // 添加建筑物设置样式
    // addGBuilding(viewer);

    // 添加管道
    // addPipe(viewer);

    // 添加流动线
    // addMutTypeLine(viewer);

  

    // 添加建筑模型
    // addJianzhu1(viewer);

    // 添加小区的边界线
    // addXiaoqu(viewer);

    // 添加水体周边的草坪
    // addCaoPing(viewer);

    // 添加鼠标hover事件
    // addMouseHover(viewer, callBack);

    // 添加鼠标click事件
    // addMouseClick(viewer, callBackClick);

    // 添加雷达扫描图
    // addSeveralCircle(viewer);

    // 添加水位监测点
    addShuiwei(viewer);
    // 添加摄像头
    addCamera(viewer);
    // 添加AI告警点 
    addAIPoint(viewer);

    // 添加树木点
    addTree(viewer);

    // 添加道路线
    addRoad(viewer);

    // 添加河流
    addRiver(viewer);



    return viewer;
}

// 2022-06-08 粉刷匠 添加道路
export const addRoad=(viewer:any)=>{

    const airplaneUrl = "./Models/road.glb";
    const cord = [121.364978, 31.207834, 19];
    const cartesian = Cesium.Cartesian3.fromDegrees(cord[0], cord[1], cord[2]);
    const newHeading = Cesium.Math.toRadians(-13); // 初始heading值赋0
    const newPitch = Cesium.Math.toRadians(0);
    const newRoll = Cesium.Math.toRadians(0);
    const headingPitchRoll = new Cesium.HeadingPitchRoll(newHeading, newPitch, newRoll);
    const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(cartesian, headingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.Matrix4());

    const curModel = viewer.scene.primitives.add(Cesium.Model.fromGltf({
        url: airplaneUrl, // 模型地址
        modelMatrix,
    }));

    // 放大一点
    curModel.scale = 8;
}

// 2022-06-08 粉刷匠 添加树木点
export const addTree = (viewer: any) => {
    const airplaneUrl = "./Models/tree_simple.glb";
    const loc1 = newTreePoint.features;
    const WaterControlPoint = [];
    for (let i = 0; i < loc1.length; i++) {
        const sigLoc = loc1[i].geometry.coordinates;
        WaterControlPoint.push(sigLoc[0]);
        WaterControlPoint.push(sigLoc[1]);
        WaterControlPoint.push(17);
        WaterControlPoint.push(45);
    }

    for (let i = 0; i < WaterControlPoint.length; i += 4) {
        const cord = [WaterControlPoint[i], WaterControlPoint[i + 1], WaterControlPoint[i + 2]];
        const cartesian = Cesium.Cartesian3.fromDegrees(cord[0], cord[1], cord[2]);
        const newHeading = Cesium.Math.toRadians(WaterControlPoint[i + 3]); // 初始heading值赋0
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
        curModel.scale = 7;
    }
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
    // const color = { r: 84, g: 220, b: 224, a: 150 };
    const color = { r: 47, g: 90, b: 65, a: 250 };
    // const color ={ r: 174, g: 128, b: 77, a: 150 }

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
                // baseWaterColor: Cesium.Color.BLUE.withAlpha(0.5), // 水体颜色
                baseWaterColor: Cesium.Color.fromCssColorString("#2F4F4F").withAlpha(0.2),
                // blendColor: Cesium.Color.DARKBLUE, // 水陆混合处颜色
                blendColor: Cesium.Color.fromBytes(color.r, color.g, color.b, color.a),
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
    // http://localhost:9003/model/tyxIFBw68/tileset.json
    // http://localhost:9003/model/tiHZ3wvdE/tileset.json
    // http://localhost:9003/model/tdXBdddQ6/tileset.json
    // http://localhost:9003/model/tNMZjFYSa/tileset.json
    // http://localhost:9003/model/tUFIgmo9U/tileset.json
    // http://localhost:9003/model/tT57hO2UY/tileset.json

    const tmpTileset = new Cesium.Cesium3DTileset({
        url: ' http://localhost:9003/model/tT57hO2UY/tileset.json',
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
        set3DtilesHeight(18, tileset);

        // 设置hover事件
        // addHoverAction(tileset, viewer);
        

    })
}

export const addCamera = (viewer: any) => {
    const sxtArr = [];

    const orgData = newFourPoint.features;
    for (let i = 0; i < orgData.length; i++) {
        const loc = orgData[i].geometry.coordinates;
        sxtArr.push([loc[0], loc[1]]);
    }
    const tmpArr = ['o2'];
    // const nameArr = ['视频', '人员', '泵闸', '断面', '水位', '事件'];
    // const nameArr = ['视频', '人员', '水位', '事件'];
    const nameArr = ['王晓洲'];


    for (let i = 3; i < 4; i++) {
        const index = 0;
        const textShow = nameArr[index];
        viewer.entities.add({
            id: `map-no-point${i}no-type${index}`,
            name: `map-no-point${i}-type${index}`,
            position: Cesium.Cartesian3.fromDegrees(sxtArr[i][0], sxtArr[i][1],25),
            billboard: {
                disableDepthTestDistance:50000,
                image: `./Models/image/${tmpArr[index]}.png`,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                // scaleByDistance: new Cesium.NearFarScalar(500, 0.11, 2000, 0.1)
            },
            label: {
                disableDepthTestDistance:50000,
                // 竖直的文字
                // text: '测\n试\n文\n字',
                text: textShow,
                font: `16px sans-serif`,
                // fillColor : Cesium.Color.RED,
                fillColor: Cesium.Color.fromCssColorString('#87CEFA'),
                pixelOffset: new Cesium.Cartesian2(0, -80),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
        });
    }
}

export const addAIPoint = (viewer: any) => {
    // 摄像头
    const sxtArr = [];

    const orgData = newFourPoint.features;
    for (let i = 0; i < orgData.length; i++) {
        const loc = orgData[i].geometry.coordinates;
        sxtArr.push([loc[0], loc[1]]);
    }

    const featureArr: any = [];

    for (let i = 0; i < 1; i++) {
        const index = Math.floor(Math.random() * 4);
        const sigEntity = new Cesium.Entity({
            id: `map-no-point${i}no-type${index}`,
            name: `map-ai-point${i}-type${index}`,
            position: Cesium.Cartesian3.fromDegrees(sxtArr[i][0], sxtArr[i][1], 20),
            billboard: {
                disableDepthTestDistance:50000,
                image: `./Models/image/ai.png`,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.6,
                // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                // scaleByDistance: new Cesium.NearFarScalar(500, 0.11, 2000, 0.1)
            },
            label: {
                disableDepthTestDistance:50000,
                // 竖直的文字
                // text: '测\n试\n文\n字',
                text: `AI预警`,
                font: `16px sans-serif`,
                // fillColor : Cesium.Color.RED,
                fillColor: Cesium.Color.fromCssColorString('#87CEFA'),
                pixelOffset: new Cesium.Cartesian2(0, -90),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
        })
        featureArr.push(sigEntity);
        viewer.entities.add(sigEntity);
    }

    const min = 0.60;
    const max = 0.75;
    const step = 0.02;
    let flag = false;

    const changeSize = () => {
        for (let i = 0; i < featureArr.length; i++) {
            const tmpScale = featureArr[i].billboard.scale > max ? min : featureArr[i].billboard.scale + step;
            featureArr[i].billboard.scale = tmpScale;
            featureArr[i].label.fillColor = flag ? Cesium.Color.fromCssColorString('#87CEFA') : Cesium.Color.fromCssColorString('#FF0000');
        }
        flag = !flag;
    }

    setInterval(() => {
        changeSize();
    }, 200);
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
            scale: 1,
            offset: function () {
                return new Cesium.Cartesian3(0.2, 0.2, 0.3);
            }
        }
    }));
}


// 缩放到深圳
export const zoomToShenzhen = (viewer: any) => {
    // 121.367381457154082, 31.21097934774841
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
    // 121.367381457154082, 31.21097934774841
    // const locationSZ = { lng: 121.367381457154082, lat: 31.21097934774841, height: 1300.0 };
    // const location = locationSZ;
    // viewer.camera.flyTo({
    //     destination: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, location.height),
    //     orientation: {
    //         heading: Cesium.Math.toRadians(30),
    //         pitch: Cesium.Math.toRadians(-90),
    //         roll: 0.0
    //     }
    // });

    if (!viewer) return;

    const cameraInfo = {
        // cameraHPR: { heading: 15.481062760908197, pitch: -31.18818128741477, roll: 0.05321288363450053 },
        // cameraHeight: { longitude: 2.118106804333249, latitude: 0.544476750437641, height: 916.2803963905053 },
        // maxx: 121.3871614437298,
        // maxy: 31.22969948665354,
        // midLocation: { lon: 121.36282102810752, lat: 31.209379261905365 },
        // minx: 121.34852574213636,
        // miny: 31.20198658012191,

        // cameraHPR: { heading: 24.118465637356074, pitch: -15.207435156071249, roll: 0.07216103251978853 },
        // cameraHeight: { longitude: 2.118211242712677, latitude: 0.5446742723728493, height: 69.5328270168534 },
        // maxx: 121.67810751944543,
        // maxy: 31.475226233372293,
        // midLocation: { lon: 121.36566124498057, lat: 31.20964283770574 },
        // minx: 121.05102112974993,
        // miny: 31.208213907708743,

        // cameraHPR: { heading: 25.42852171934043, pitch: -20.307716977990143, roll: 0.0780415210755247 },
        // cameraHeight: { longitude: 2.1182079059714667, latitude: 0.5446731035625492, height: 87.65892938602643 },
        // maxx: 121.37502699272494,
        // maxy: 31.218884438895664,
        // midLocation: { lon: 121.3654405196692, lat: 31.209399615898352 },
        // minx: 121.36351706427872,
        // miny: 31.2081297438934,

        cameraHPR: { heading: 25.428521615561984, pitch: -20.307716388156546, roll: 0.07804182009544941 },
        cameraHeight: { longitude: 2.1182100389663496, latitude: 0.5446767533423199, height: 87.72783749796466 },
        maxx: 121.3751576163834,
        maxy: 31.21910254324854,
        midLocation: { lon: 121.36556357277105, lat: 31.20961024975844 },
        minx: 121.36363859984772,
        miny: 31.20833937944793,
    }

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(cameraInfo.cameraHeight.longitude, cameraInfo.cameraHeight.latitude, cameraInfo.cameraHeight.height),
        orientation: {
            heading: Cesium.Math.toRadians(cameraInfo.cameraHPR.heading),
            pitch: Cesium.Math.toRadians(cameraInfo.cameraHPR.pitch),
            roll: Cesium.Math.toRadians(cameraInfo.cameraHPR.roll)
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
export const addCaoPing = (viewer: any) => {
    const airplaneUrl = "./Models/send.glb";

    const loc1 = sendPoint.features;
    const WaterControlPoint = [];
    for (let i = 0; i < loc1.length; i++) {
        const sigLoc = loc1[i].geometry.coordinates;
        WaterControlPoint.push(sigLoc[0]);
        WaterControlPoint.push(sigLoc[1]);
        WaterControlPoint.push(10);
        WaterControlPoint.push(45);
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

// 添加鼠标点击事件
export const addMouseHover = (viewer: any, callBack: any) => {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);


    // 注册鼠标移动事件
    handler.setInputAction((movement: any) => {

        // Pick a new feature
        const pickedFeature = viewer.scene.pick(movement.endPosition);
        if (!Cesium.defined(pickedFeature)) {
            callBack({
                show: false
            })
            return;
        }

        if (!pickedFeature.id) return;
        const featureName = pickedFeature.id.name;
        if (!featureName) return;
        if (featureName.indexOf("map-point") === -1) return;
        const position = movement.endPosition;

        callBack({
            show: true,
            position,
            pickedFeature
        });
        // console.log(windowPosition, pickedFeature);

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

}

// 添加鼠标点击事件
export const addMouseClick = (viewer: any, callBack: any) => {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);


    // 注册鼠标点击事件
    handler.setInputAction((movement: any) => {

        // Pick a new feature
        const pickedFeature = viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedFeature)) {
            callBack({
                show: false
            })
            return;
        }

        if (!pickedFeature.id) return;
        const featureName = pickedFeature.id.name;
        if (!featureName) return;
        if (featureName.indexOf("map") === -1) return;
        const position = movement.position;

        callBack({
            show: true,
            position,
            pickedFeature
        });
        // console.log(windowPosition, pickedFeature);

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

}

// 添加水位监测点
export const addShuiwei = (viewer: any) => {

    const orgData = newFourPoint.features;
    const pointArr: any = [];
    for (let i = 0; i < orgData.length; i++) {
        const loc = orgData[i].geometry.coordinates;
        pointArr.push([loc[0], loc[1], 20]);
    }

    const myCustomDataSource = new Cesium.CustomDataSource("shuiweiEntityCollection");
    viewer.dataSources.add(myCustomDataSource);

    const tmpArr = ['o3', 'o4'];
    // const nameArr = ['视频', '人员', '泵闸', '断面', '水位', '事件'];

    let flag = false;
    for (let i = 1; i < 3; i++) {

        const index = flag ? 0 : 1;
        const textShow = flag ? "北新泾泵闸" : "天山西路绥宁路";
        flag = !flag;

        viewer.entities.add({
            id: `map-point${i}-type${index}`,
            name: `map-point${i}-type${index}`,
            position: Cesium.Cartesian3.fromDegrees(pointArr[i][0], pointArr[i][1], 15),
            billboard: {
                disableDepthTestDistance:50000,
                image: `./Models/image/${tmpArr[index]}.png`,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                // scaleByDistance: new Cesium.NearFarScalar(500, 0.11, 2000, 0.1)
            },
            label: {
                // 竖直的文字
                // text: '测\n试\n文\n字',
                disableDepthTestDistance:50000,
                text: textShow,
                font: `16px sans-serif`,
                // fillColor : Cesium.Color.RED,
                fillColor: index ? new Cesium.Color(0.22, 0.89, 0.94) : Cesium.Color.fromCssColorString('#FFA500'),
                pixelOffset: new Cesium.Cartesian2(0, -80),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
        });
    }

    // const updateData = () => {
    //     myCustomDataSource.entities.removeAll();
    //     for (let i = 0; i < pointArr.length; i++) {
    //         const value = 2 + Math.random();
    //         const midNum = 2.8;
    //         const color = value < midNum ? null : "#FFA500";
    //         const textShow = value < midNum ? `水位:${value.toFixed(3)}` : `告警！\n水位:${value.toFixed(1)} `;
    //         const sigEntity = new Cesium.Entity({
    //             position: Cesium.Cartesian3.fromDegrees(pointArr[i][0], pointArr[i][1], pointArr[i][2]),
    //             billboard: {
    //                 // image: makeVirticelLine(), // default: undefined  
    //                 image: makeVirticelLine(color), // default: undefined  

    //                 width: 50,
    //                 height: 50
    //             },
    //             label: {
    //                 // 竖直的文字
    //                 // text: '测\n试\n文\n字',
    //                 text: textShow,
    //                 font: `${value < midNum ? 16 : 20}px sans-serif`,
    //                 // fillColor : Cesium.Color.RED,
    //                 fillColor: value < midNum ? new Cesium.Color(0.22, 0.89, 0.94) : Cesium.Color.fromCssColorString('#FFA500'),
    //                 pixelOffset: new Cesium.Cartesian2(0, -30),
    //                 verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    //             },
    //         })

    //         myCustomDataSource.entities.add(sigEntity);
    //     }
    // }

    // setInterval(() => {
    //     updateData();
    // }, 10000);




}


// 获取渐变色颜色的环
const getColorCircle2 = (color: any, isTransparent?: boolean) => {
    const ramp = document.createElement('canvas');
    ramp.width = 100;
    ramp.height = 100;
    const ctx: any = ramp.getContext('2d');

    // const values = elevationRamp;
    const grd = ctx.createRadialGradient(50, 50, 50, 50, 50, 0);
    grd.addColorStop(1, 'transparent'); //black
    // grd.addColorStop(0.1, 'rgba(225,255,255,0.1)'); //black
    // grd.addColorStop(0, "rgba(225,255,255,0.7)");

    grd.addColorStop(0.1, 'rgba(0,206,209,0.1)'); //black
    grd.addColorStop(0, "rgba(0,206,209,0.7)");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 100);
    return ramp;
}

// 获取颜色环
const getColorCircle = (color: any, deg: number, isTransparent?: boolean) => {
    const ramp = document.createElement('canvas');
    ramp.width = 100;
    ramp.height = 100;
    const ctx: any = ramp.getContext('2d');

    // const values = elevationRamp;
    const grd = ctx.createLinearGradient(55, 25, 100, 50);
    grd.addColorStop(0, 'transparent'); //black
    // grd.addColorStop(0.5, 'rgba(225,255,255,0.5)'); //orange
    // grd.addColorStop(1, 'rgba(225,255,255,1)'); //yellow
    grd.addColorStop(0.5, 'rgba(0,206,209,0.5)'); //orange
    grd.addColorStop(1, 'rgba(0,206,209,1)'); //yellow

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.arc(50, 50, 50, -90 / 180 * Math.PI, 0 / 180 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'transparent';
    // ctx.strokeStyle = 'rgba(225,255,255,1)';
    ctx.strokeStyle = 'rgba(0,206,209,1)';

    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    return ramp;
}

export const addSeveralCircle = (viewer: any) => {
    const orgData = shuiweiDian.features;
    const pointArr: any = [];
    for (let i = 0; i < orgData.length; i++) {
        const loc = orgData[i].geometry.coordinates;
        pointArr.push([loc[0], loc[1], 20]);
    }

    for (let i = 0; i < pointArr.length; i += 3) {
        const isCir = i % 2;
        if (isCir) {
            showTestCircleScan(viewer, pointArr[i]);
        } else {
            showTestCircleScan2(viewer, pointArr[i]);
        }
    }
}

// 添加一个圆扫描--测试
export const showTestCircleScan = (viewer: any, loc: any) => {

    let rotation = Cesium.Math.toRadians(30);
    function getRotationValue() {
        rotation += 0.01;
        // rotation += 0.0;
        return rotation;
    }

    // 旋转的 圆
    viewer.entities.add({
        name: "a rotate ellipse ",
        position: Cesium.Cartesian3.fromDegrees(loc[0], loc[1], 100),
        ellipse: {
            semiMinorAxis: 250,
            semiMajorAxis: 250,
            // height: 200,
            //颜色回调
            material: new Cesium.ImageMaterialProperty({
                image: getColorCircle("()", 90, true),
                transparent: true,
            }),
            rotation: new Cesium.CallbackProperty(getRotationValue, false),
            stRotation: new Cesium.CallbackProperty(getRotationValue, false),
            outline: false, // height must be set for outline to display
            numberOfVerticalLines: 100
        },
        description: '测试数据'
    });
}

// 添加一个圆扩散--测试
export const showTestCircleScan2 = (viewer: any, loc: any) => {

    const data = {
        minR: 20,
        maxR: 200,
        deviationR: 2,// 差值 差值也大 速度越快
    }
    let r1 = data.minR;
    let r2 = data.minR;

    function changeR1() { // 这是callback，参数不能内传
        r1 = r1 + data.deviationR;// deviationR为每次圆增加的大小
        if (r1 >= data.maxR) {
            r1 = data.minR;
        }
        return r1;
    }

    function changeR2() {
        r2 = r2 + data.deviationR;
        if (r2 >= data.maxR) {
            r2 = data.minR;
        }
        return r2;
    }

    // 旋转的 圆
    viewer.entities.add({
        name: "a rotate ellipse ",
        position: Cesium.Cartesian3.fromDegrees(loc[0], loc[1], 100),
        ellipse: {
            semiMinorAxis: new Cesium.CallbackProperty(changeR1, false),
            semiMajorAxis: new Cesium.CallbackProperty(changeR2, false),
            // height: 200,
            //颜色回调
            material: new Cesium.ImageMaterialProperty({
                image: getColorCircle2("()", true),
                transparent: true,
            }),
            // rotation: new Cesium.CallbackProperty(getRotationValue, false),
            // stRotation: new Cesium.CallbackProperty(getRotationValue, false),
            outline: false, // height must be set for outline to display
            numberOfVerticalLines: 100
        },
        description: '测试数据'
    });
}

// 2021-04-20 粉刷匠 获取当前场景经纬度范围
export const getCurrentCameraInfo = (viewer: any) => {

    // 经纬度范围
    let params: any = {};
    let extend = viewer.camera.computeViewRectangle();
    if (typeof extend === "undefined") {
        //2D下会可能拾取不到坐标，extend返回undefined,所以做以下转换
        let canvas = viewer.scene.canvas;
        let upperLeft = new Cesium.Cartesian2(0, 0);//canvas左上角坐标转2d坐标
        let lowerRight = new Cesium.Cartesian2(
            canvas.clientWidth,
            canvas.clientHeight
        );// canvas右下角坐标转2d坐标

        let ellipsoid = viewer.scene.globe.ellipsoid;
        let upperLeft3 = viewer.camera.pickEllipsoid(
            upperLeft,
            ellipsoid
        );// 2D转3D世界坐标

        let lowerRight3 = viewer.camera.pickEllipsoid(
            lowerRight,
            ellipsoid
        );// 2D转3D世界坐标

        let upperLeftCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
            upperLeft3
        );// 3D世界坐标转弧度
        let lowerRightCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
            lowerRight3
        );// 3D世界坐标转弧度

        let minx = Cesium.Math.toDegrees(upperLeftCartographic.longitude);//弧度转经纬度
        let maxx = Cesium.Math.toDegrees(lowerRightCartographic.longitude);//弧度转经纬度

        let miny = Cesium.Math.toDegrees(lowerRightCartographic.latitude);//弧度转经纬度
        let maxy = Cesium.Math.toDegrees(upperLeftCartographic.latitude);//弧度转经纬度

        // console.log("经度：" + minx + "----" + maxx);
        // console.log("纬度：" + miny + "----" + maxy);

        params.minx = minx;
        params.maxx = maxx;
        params.miny = miny;
        params.maxy = maxy;
    } else {
        //3D获取方式
        params.maxx = Cesium.Math.toDegrees(extend.east);
        params.maxy = Cesium.Math.toDegrees(extend.north);

        params.minx = Cesium.Math.toDegrees(extend.west);
        params.miny = Cesium.Math.toDegrees(extend.south);
    }

    // 相机参数
    const camera = viewer.camera;
    const heading = Cesium.Math.toDegrees(camera.heading)
    const pitch = Cesium.Math.toDegrees(camera.pitch)//Cesium.Math.toDegrees作用是把弧度转换成度数
    const roll = Cesium.Math.toDegrees(camera.roll)
    params["cameraHPR"] = {
        heading,
        pitch,
        roll
    }

    // 获取中心点坐标与相机高度
    const result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
    const curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
    const lon = curPosition.longitude * 180 / Math.PI;
    const lat = curPosition.latitude * 180 / Math.PI;

    const scene = viewer.scene;
    const ellipsoid = scene.globe.ellipsoid;
    const height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
    const clongitude = Number(viewer.camera.positionCartographic.longitude);
    const clatitude = Number(viewer.camera.positionCartographic.latitude);
    params["midLocation"] = {
        "lon": lon,
        "lat": lat,
    }
    params["cameraHeight"] = {
        "longitude": clongitude,
        "latitude": clatitude,
        "height": height
    }
    return params;// 返回屏幕所在经纬度范围
}

export const addTestFlightLine = (viewer: any) => {
    // const positionList = testFlightData2;

    // const positionList = testFly;
    const positionList = testFly;
    // const positionList: any = [];
    // const insetIndex = 5;
    // for (let i = 0; i < orgList.length - 1; i++) {
    //     positionList.push(orgList[i]);
    //     const nowPoint = orgList[i + 1];
    //     const nextPoint = orgList[i + 1];
    //     for (let j = 0; j < insetIndex - 1; j++) {
    //         positionList.push({
    //             cameraHPR: {
    //                 heading: (nextPoint.cameraHPR.heading - nowPoint.cameraHPR.heading) * (j + 1) / insetIndex,
    //                 pitch: (nextPoint.cameraHPR.pitch - nowPoint.cameraHPR.pitch) * (j + 1) / insetIndex,
    //                 roll: (nextPoint.cameraHPR.roll - nowPoint.cameraHPR.roll) * (j + 1) / insetIndex,
    //             },
    //             cameraHeight: {
    //                 longitude: (nextPoint.cameraHeight.longitude - nowPoint.cameraHeight.longitude) * (j + 1) / insetIndex,
    //                 latitude:(nextPoint.cameraHeight.latitude - nowPoint.cameraHeight.latitude) * (j + 1) / insetIndex,
    //                 height: (nextPoint.cameraHeight.height - nowPoint.cameraHeight.height) * (j + 1) / insetIndex,
    //             },
    //         })
    //     }
    // }

    let count = 0;
    fly();

    function fly() {
        if (count >= positionList.length) {
            return;
        }
        const cameraInfo = positionList[count];

        viewer.camera.flyTo({
            duration: 1,

            destination: Cesium.Cartesian3.fromRadians(cameraInfo.cameraHeight.longitude, cameraInfo.cameraHeight.latitude, cameraInfo.cameraHeight.height),
            orientation: {
                heading: Cesium.Math.toRadians(cameraInfo.cameraHPR.heading),
                pitch: Cesium.Math.toRadians(cameraInfo.cameraHPR.pitch),
                roll: Cesium.Math.toRadians(cameraInfo.cameraHPR.roll)
            },
            // orientation: {
            //     heading: Cesium.Math.toRadians(0.0),
            //     pitch: Cesium.Math.toRadians(-90.0),
            //     roll: Cesium.Math.toRadians(0.0)
            // },
            complete: function () {
                fly();
            }
        });
        count++;
    }


}


// 2021-05-12 粉刷匠 添加日照光阴影
export const addSunShadow = (viewer: any, houro?: number) => {
    viewer.scene.globe.enableLighting = true;
    viewer.shadows = true;
    const hour = houro ? houro - 8 : 0;
    // 有时候需要看一天的阴影变化，可以通过设置时间的方法，示例如下，注意北京东八区
    const utc = Cesium.JulianDate.fromDate(new Date(`2022/06/07 ${hour?.toString().padStart(2, '0')}:00:00`));// UTC
    viewer.clockViewModel.currentTime = Cesium.JulianDate.addHours(utc, 8, new Cesium.JulianDate());//北京时间=UTC+8=GMT+8
}