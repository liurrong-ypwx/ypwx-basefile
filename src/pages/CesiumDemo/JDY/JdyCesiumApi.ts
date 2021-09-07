import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { flightLine, PolyRiver, WaterControlPoint, WaterControlPointValue, WaterFallCord, WaterFloodCord, WaterMonitorPoint } from '../../../utils/CesiumApi/TestData/PolyRiver';
import normalMap from "../../../assets/image/fabric_normal.jpg";
import { MultiPolyRiver } from '../../../utils/CesiumApi/TestData/a';
import { YuShader } from '../../../utils/CesiumApi/MulShader';
import { riverTwoLine } from '../../../utils/CesiumApi/TestData/b';
import moment from "moment";

window.CESIUM_BASE_URL = './cesium/';
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);// 西南东北，默认显示中国
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTIxYjQ0Yi1kODkwLTQwYTctYTdjNi1hOTkwYTRhYTI2NDEiLCJpZCI6MzY4OTQsImlhdCI6MTYwNDMwMzkzM30.btKZ2YlmB0wCTBvk3ewmGk5MAjS5rwl_Izra03VcrnY';

let isNormal: boolean = true;
let isWaterChange: boolean = false;

// 初始化地图
export const initMap = (domID: string, isAddBuilding: boolean) => {

    isNormal = true;
    if (!document.getElementById(domID)) return;
    const viewer = new Cesium.Viewer(domID, {
        geocoder: false,
        homeButton: true,
        sceneModePicker: false,
        baseLayerPicker: true,
        navigationHelpButton: false,
        // animation: false,
        // timeline: false,
        fullscreenButton: false,
        vrButton: false,
        selectionIndicator: false,
        infoBox: false,
    })
    // 演示1：添加免费的osm 建筑物图层
    // viewer.scene.primitives.add(Cesium.createOsmBuildings());
    // 额外设置之显示帧速
    viewer.scene.debugShowFramesPerSecond = true;
    // 添加一个地形
    let terrainProvider = new Cesium.CesiumTerrainProvider({
        url: "http://192.168.207.155:9000/terrain/aad787c00b0011ecbf0d11c2c0edeb81"
    });
    viewer.terrainProvider = terrainProvider;
    // 九道堰相关
    constactJDY(viewer);
    return viewer;
}

// 缩放到指定点
export const flyToPoint = (viewer: any, point: { lng: number, lat: number, height: number }) => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.height),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
        }
    });
}

// 九道堰相关入口
export const constactJDY = (viewer: any) => {
    addWater(viewer, PolyRiver);
    addShuiBa(viewer);
    addJDYFlood(viewer)
    addJDYLabel(viewer);
}

// 水体相关
export const addWater = (viewer: any, poly: number[], color?: any) => {
    const polyRivers: any = [];
    const riverFeature = MultiPolyRiver.features;
    for (let i = 0; i < riverFeature.length; i++) {
        const sigFeature = riverFeature[i];
        const coordinates = sigFeature.geometry.coordinates;
        for (let j = 0; j < coordinates.length; j++) {
            const sigPolygon = coordinates[j];
            const sigPolyCord: any = [];
            for (let k = 0; k < sigPolygon.length; k++) {
                sigPolyCord.push(sigPolygon[k][0], sigPolygon[k][1]);
            }
            polyRivers.push(sigPolyCord);
        }
    }

    for (let i = 0; i < polyRivers.length; i++) {
        addWaterTop(viewer, polyRivers[i]);
        addWaterBot(viewer, polyRivers[i]);
    }
}

// 白色透明水纹
const waterYellowArr: any = [];
export const addWaterTop = (viewer: any, poly: number[], color?: any) => {

    const data = poly;
    let material: any = new Cesium.Material({
        fabric: {
            type: 'Water',
            uniforms: { // 动态传递参数
                baseWaterColor: Cesium.Color.WHITE.withAlpha(0.1), // 水体颜色
                blendColor: Cesium.Color.DARKBLUE, // 水陆混合处颜色
                // specularMap:"../../**/jpg", // 一张黑白图用来作为标识哪里是用水来渲染的贴图
                normalMap: Cesium.buildModuleUrl(normalMap), // 用来生成起伏效果的水体
                frequency: 100.0,
                animationSpeed: 0.01,
                amplitude: 1000
            },
            // source: source
        },
        translucent: false
    })

    if (color) {
        material =new Cesium.Material({
            fabric : {
                type : 'Color',
                uniforms : {
                    color: Cesium.Color.fromBytes(color.r, color.g, color.b, color.a)
                }
            }
        });
    }

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
    viewer.scene.primitives.add(primitive);
    if (color) {
        waterYellowArr.push(primitive);
    }
}

// 蓝色水底基础色
export const addWaterBot = (viewer: any, polydata: number[], color?: any) => {
     viewer.entities.add({
        name: '多边形',
        polygon: {
            hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(polydata)),        
            material: new Cesium.ColorMaterialProperty(Cesium.Color.fromBytes(6, 79, 68)),           
        },
    });
}



// 水位标签 正常情况下不变  特殊情况先增加再减小
let monitorValueTime = 0;
// let interpolation = 0;
// const maxInterpolation = 10;
export const changeLable = (entityArr: any) => {

    if (isNormal) {
        for (let i = 0; i < entityArr.length; i++) {
            const sigEntity = entityArr[i];
            if (sigEntity) {
                const orgText = sigEntity.label._text._value;
                const orgTextIndex = +orgText.substr(3, 1);
                const newValue = WaterControlPointValue[0][orgTextIndex - 1] + Math.random() * 0.1;
                sigEntity.label._text._value = `JCD${orgTextIndex}水位：${newValue.toFixed(2)}`;
                sigEntity.label._fillColor._value = new Cesium.Color(0.22, 0.89, 0.94);
            }
        }
    } else {
        for (let i = 0; i < entityArr.length; i++) {
            const sigEntity = entityArr[i];
            if (sigEntity) {
                const orgText = sigEntity.label._text._value;
                const orgTextIndex = +orgText.substr(3, 1);
                const newValue = WaterControlPointValue[monitorValueTime][orgTextIndex - 1] + Math.random() * 0.1;
                sigEntity.label._text._value = `JCD${orgTextIndex}水位：${newValue.toFixed(2)}`;
                sigEntity.label._fillColor._value = newValue > 2.5 ? Cesium.Color.RED : new Cesium.Color(0.22, 0.89, 0.94);
            }
        }
        monitorValueTime = monitorValueTime + 1 < WaterControlPointValue.length ? monitorValueTime + 1 : 0;
        // if (interpolation + 1 < maxInterpolation) {
        //     interpolation++;
        // } else {
        //     interpolation = 0;
        //     monitorValueTime = monitorValueTime + 1 < WaterControlPointValue.length ? monitorValueTime + 1 : 0;
        // }

    }

}

export const makeVirticelLine = () => {
    const ramp = document.createElement('canvas');
    ramp.width = 100;
    ramp.height = 100;
    const ctx: any = ramp.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(50, 90, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#5BD5DE";// 设置填充颜色
    ctx.fill();//开始填充
    ctx.strokeStyle = "#5BD5DE";//将线条颜色设置为蓝色
    ctx.stroke();//stroke() 方法默认颜色是黑色（如果没有上面一行，则会是黑色）。

    ctx.moveTo(50, 80);
    ctx.lineTo(50, 0);
    ctx.stroke();
    return ramp;
}

export const addJDYLabel = (viewer: any) => {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    // 水位点
    // const pointArr = [[104.19183, 30.789, 500], [104.19879, 30.79091, 520]];
    const pointArr: any = [];
    for (let i = 0; i < WaterMonitorPoint.length; i += 3) {
        pointArr.push([WaterMonitorPoint[i], WaterMonitorPoint[i + 1], 570])
    }

    const jcEntArr: any = [];
    for (let i = 0; i < pointArr.length; i++) {
        const sigEntity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(pointArr[i][0], pointArr[i][1], pointArr[i][2]),
            billboard: {
                image: makeVirticelLine(), // default: undefined  
                width: 50,
                height: 50
            },
            label: {
                // 竖直的文字
                text: `JCD${i + 1}`,
                font: '16px sans-serif',
                // fillColor : Cesium.Color.RED,
                fillColor: new Cesium.Color(0.22, 0.89, 0.94),
                pixelOffset: new Cesium.Cartesian2(0, -30),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
        });
        jcEntArr.push(sigEntity);
    }

    setInterval(() => {
        changeLable(jcEntArr)
    }, 2000);

    // 洼地点
    // const wadiArr = [[104.04863, 30.76756, 530], [104.05429, 30.76585, 530]];
    // for (let i = 0; i < wadiArr.length; i++) {
    //     viewer.entities.add({
    //         position: Cesium.Cartesian3.fromDegrees(wadiArr[i][0], wadiArr[i][1], wadiArr[i][2]),
    //         billboard: {
    //             image: makeVirticelLine(), // default: undefined  
    //             width: 50,
    //             height: 50
    //         },
    //         label: {
    //             // 竖直的文字
    //             text: '洼地',
    //             // font: '30px sans-serif',
    //             fillColor: Cesium.Color.RED.withAlpha(0.7),
    //             // fillColor: new Cesium.Color(0.5, 0.89, 0.94),
    //             pixelOffset: new Cesium.Cartesian2(0, -30),
    //             verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    //         },
    //     });
    // }

    // // 摄像头
    // const sxtArr = [[104.06273, 30.77760, 490], [104.04797, 30.76234, 490], [104.06862, 30.76404, 490]];
    // for (let i = 0; i < sxtArr.length; i++) {
    //     viewer.entities.add({
    //         position: Cesium.Cartesian3.fromDegrees(sxtArr[i][0], sxtArr[i][1], sxtArr[i][2]),
    //         billboard: {
    //             image: './Models/image/sxt.png',
    //             verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //             heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    //             scaleByDistance: new Cesium.NearFarScalar(500, 0.11, 2000, 0.1)
    //         }
    //     });
    // }

    // 水坝指标框
    // const indexArr = [ 104.04506, 30.77378, 600];
    // // const indexArr = [104.18799, 30.79238, 500];    
    // viewer.entities.add({
    //     position: Cesium.Cartesian3.fromDegrees(indexArr[0], indexArr[1], indexArr[2]),
    //     billboard: {
    //         image: makeBillBoardImg(""), // default: undefined  
    //         width: 320,
    //         height: 200
    //     }, 
    //     label: {
    //         text: '指标展示：\n---------------\n---------------',
    //         fillColor: new Cesium.Color(0.5, 0.89, 0.94),
    //         pixelOffset: new Cesium.Cartesian2(0, 10),
    //         verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    //     },       
    // });

}

// arcgis蓝色底图
export const addArcgisMap = (viewer: any) => {
    // viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
    //     url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
    // }))

    // 添加一个蓝色底图来加强图像的展示
    viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
            url: './Models/image/dark.png'
        })
    )

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
    // 注记
    // viewer.imageryLayers.addImageryProvider(
    //     new Cesium.WebMapTileServiceImageryProvider({
    //         url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=077b9a921d8b7e0fa268c3e9146eb373",
    //         layer: "tdtAnnoLayer",
    //         style: "default",
    //         format: "image/jpeg",
    //         tileMatrixSetID: 'GoogleMapsCompatible',
    //     })
    // );
}

// 雨天模拟
let weatherCondition: any = null;
// 2021-04-19 粉刷匠 添加天气效果
export const addWeatherCondition = (viewer: any) => {
    // 雾效果
    if (weatherCondition) viewer.scene.postProcessStages.remove(weatherCondition);
    const tmpCondition = new Cesium.PostProcessStage({
        name: 'weather_yu',
        fragmentShader: YuShader
    })
    viewer.scene.postProcessStages.add(tmpCondition);
    weatherCondition = tmpCondition;
}

// 清空天气效果
export const clearWeatherCondition = (viewer: any) => {
    if (weatherCondition) viewer.scene.postProcessStages.remove(weatherCondition);
}

// 2021-08-16 粉刷匠 添加水坝
export const addShuiBa = (viewer: any) => {
    const airplaneUrl = "./Models/shuiba0902.glb";

    for (let i = 0; i < WaterControlPoint.length; i += 4) {
        // const cord = [104.04486, 30.77336, 504];
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
       
        // 放大一点
        curModel.scale = 30;
    }

}

export const addDynamicChange=(viewer:any)=>{
    addMultiQingxie(viewer);
    addJDYFlowLine(viewer);
    isNormal = false;
}

const entityDrawArr: any = [];
export const addJDYFlowLine = (viewer: any) => {
    const waterAside = riverTwoLine.features[0].geometry.coordinates;
    const waterBside = riverTwoLine.features[1].geometry.coordinates;

    const maxPointNum = 8800;
    let chooseLength = waterAside.length > waterBside.length ? waterBside.length : waterAside.length;
    chooseLength = chooseLength > maxPointNum ? maxPointNum : chooseLength;
    const chooseAside: any = [];
    const chooseBside: any = [];
    for (let i = 0; i < chooseLength; i++) {
        chooseAside.push(waterAside[waterAside.length - 1 - i]);
        chooseBside.push(waterBside[i]);
    }

    const step = 2;
    // for (let i = 0; i < chooseLength; i += step) {
    //     const 
    // }

    // viewer.entities.add({
    //     name: '多边形',
    //     polygon: {
    //         hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(polydata)),
    //         // material: new Cesium.ColorMaterialProperty(Cesium.Color.fromBytes(8, 116, 100)),
    //         material: new Cesium.ColorMaterialProperty(Cesium.Color.RED),
    //         // material: new Cesium.ImageMaterialProperty({
    //         //     image: new Cesium.CallbackProperty(makeJT, false),
    //         //     transparent: true,
    //         // })
    //     },
    // });



   
    viewer.scene.globe.depthTestAgainstTerrain = true;

    const PolygonPrimitive: any = (function () {
        function _(this: any, positions: any) {
            const tmpId = moment().format('YYYY_MM_DD_HH_mm_ss_') + moment().get('milliseconds');
            this.options = {
                id: "draw_Clip" + tmpId,
                name: '多边形',
                polygon: {
                    hierarchy: [],
                    // material: Cesium.Color.GREEN.withAlpha(0.5),
                    material: Cesium.Color.RED,
                }
            };

            this.hierarchy = { positions };
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.hierarchy;
            };
            // 实时更新polygon.hierarchy
            this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
            const tmpEntity = viewer.entities.add(this.options);
            if (tmpEntity) {
                entityDrawArr.push(tmpEntity);
            }
        };

        return _;
    })();

    let polygon: any = null;
    let positions: any = Cesium.Cartesian3.fromDegreesArray([
        chooseBside[1][0], chooseBside[1][1],
        chooseBside[0][0], chooseBside[0][1],
        chooseAside[0][0], chooseAside[0][1],
        chooseAside[1][0], chooseAside[1][1],
    ]);
    polygon = new PolygonPrimitive(positions);
    if(polygon){
        // 
    }
    let polyIndex = 0;
    let tout: any = null;

    // 2021-09-04 粉刷匠 自迭代
    // tout = setInterval(() => {
    //     if ((polyIndex + 1) * step > chooseLength) {
    //         clearInterval(tout);
    //         return;
    //     }
    //     const lineA = chooseAside.filter((t: any, index: any) => index >= (polyIndex) * step && index < (polyIndex + 1) * step);
    //     const lineB = chooseBside.filter((t: any, index: any) => index >= (polyIndex) * step && index < (polyIndex + 1) * step);
 

    //     // for (let i = 0; i < lineB.length; i++) {
    //     //     const sigPointA = lineA[i];
    //     //     const sigPointB = lineB[lineB.length - 1 - i];
    //     //     const sigPointAArr = [sigPointA[0], sigPointA[1]];
    //     //     const sigPointBArr = [sigPointB[0], sigPointB[1]];
    //     //     positions.push(Cesium.Cartesian3.fromDegreesArray(sigPointAArr)[0]);
    //     //     positions.unshift(Cesium.Cartesian3.fromDegreesArray(sigPointBArr)[0])
    //     // }   
        
    //     for (let i = 0; i < lineA.length; i++) {
    //         const sigPointA = lineA[i];          
    //         const sigPointAArr = [sigPointA[0], sigPointA[1]];           
    //         positions.push(Cesium.Cartesian3.fromDegreesArray(sigPointAArr)[0]);           
    //     }
        
    //     for (let i = 0; i < lineB.length; i++) {      
    //         const sigPointB = lineB[lineB.length - 1 - i];        
    //         const sigPointBArr = [sigPointB[0], sigPointB[1]];          
    //         positions.unshift(Cesium.Cartesian3.fromDegreesArray(sigPointBArr)[0])
    //     }   
        
    //     polyIndex = polyIndex + 1;
    // }, 500);

    tout = setInterval(() => {
        if ((polyIndex + 1) * step > chooseLength) {
            clearInterval(tout);
            return;
        }
        const lineA = chooseAside.filter((t: any, index: any) => index >= (polyIndex) * step && index <= (polyIndex + 1) * step);
        const lineB = chooseBside.filter((t: any, index: any) => index >= (polyIndex) * step && index <= (polyIndex + 1) * step);
        const allLinePoint: any = [];

        for (let i = 0; i < lineB.length; i++) {
            const sigPointB = lineB[lineB.length - 1 - i];
            allLinePoint.push(sigPointB[0]);
            allLinePoint.push(sigPointB[1]);
        }

        for (let i = 0; i < lineA.length; i++) {
            const sigPointA = lineA[i];
            allLinePoint.push(sigPointA[0]);
            allLinePoint.push(sigPointA[1]);
        }

        // 174, 128, 77
        addWaterTop(viewer, allLinePoint, { r: 174, g: 128, b: 77, a: 150 });        
        polyIndex = polyIndex + 1;

    }, 100)

}

export const addMultiQingxie = (viewer: any) => {
    // 添加水库流水
    for (let i = 0; i < WaterFallCord.length; i += 7) {
        setTimeout(() => {
            const portHeight = 510;
            const startPoint = [WaterFallCord[i], WaterFallCord[i + 1], portHeight];
            const endPoint = [WaterFallCord[i + 2], WaterFallCord[i + 3], portHeight];
            const portNum = 5;
            const sigStep1 = (endPoint[0] - startPoint[0]) / (portNum - 1);
            const sigStep2 = (endPoint[1] - startPoint[1]) / (portNum - 1);
            const baArray: any = [];
            // baArray.push(startPoint);
            for (let j = 1; j < portNum - 1; j++) {
                baArray.push([startPoint[0] + sigStep1 * j, startPoint[1] + sigStep2 * j, portHeight]);
            }
            // baArray.push(endPoint);
            for (let j = 0; j < baArray.length; j++) {
                addQingxie(viewer, baArray[j][0], baArray[j][1], baArray[j][2], `box${i}-${j}`, WaterFallCord[i + 4], WaterFallCord[i + 5]);
            }
        }, WaterFallCord[i + 6]);
        // }, 200);
    }

}

export const addQingxie = (viewer: any, lng: number, lat: number, height: number, id: string, heading: any, pitch: any) => {
    let viewModel: any = {
        emissionRate: 40.0,
        gravity: -10.0,
        minimumParticleLife: 1.5,
        maximumParticleLife: 2.5,
        minimumSpeed: 15.0,
        maximumSpeed: 16.0,
        // minimumSpeed: 20.0,
        // maximumSpeed: 21.0,
        startScale: 3.0,
        endScale: 4.0,
        particleSize: 25.0,
    };
    // const lng = 110.9495;
    // const lat = 23.4036;
    // const height = 200;

    const boxEntity = viewer.entities.add(
        new Cesium.Entity({
            id: id,
            name: 'Red box with black outline',
            position: Cesium.Cartesian3.fromDegrees(lng, lat, height),
            box: {
                dimensions: new Cesium.Cartesian3(30, 30, 30),
                // 颜色材质
                material: Cesium.Color.RED.withAlpha(0.0),
            }
        })
    );
    viewer.clock.shouldAnimate = true;

    let emitterModelMatrix = new Cesium.Matrix4();
    let translation = new Cesium.Cartesian3();
    let rotation = new Cesium.Quaternion();
    let hpr = new Cesium.HeadingPitchRoll();
    let trs = new Cesium.TranslationRotationScale();

    function computeEmitterModelMatrix() {
        hpr = Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, 0.0, hpr);
        trs.translation = Cesium.Cartesian3.fromElements(
            -4.0,
            0.0,
            1.4,
            translation
        );
        trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
        return Cesium.Matrix4.fromTranslationRotationScale(
            trs,
            emitterModelMatrix
        );
    }

    let gravityScratch = new Cesium.Cartesian3();
    // let isShow: boolean = true;
    let tmpParticel: any = null;
    function applyGravity(p: any, dt: any) {
        // We need to compute a local up vector for each particle in geocentric space.
        let position = p.position;

        Cesium.Cartesian3.normalize(position, gravityScratch);
        Cesium.Cartesian3.multiplyByScalar(
            gravityScratch,
            viewModel.gravity * dt,
            gravityScratch
        );

        p.velocity = Cesium.Cartesian3.add(
            p.velocity,
            gravityScratch,
            p.velocity
        );

        const distance = Cesium.Cartesian3.distance(
            viewer.scene.camera.position,
            Cesium.Cartesian3.fromDegrees(lng, lat, height)
        );     
        if (distance > 5000) {
            // isShow = false;
            if (tmpParticel) {
                // tmpParticel.show = false;
                tmpParticel.startColor = Cesium.Color.LIGHTSEAGREEN.withAlpha(0.0);
            }
        } else {
            // isShow = true;
            if (tmpParticel) {
                // tmpParticel.show = true;
                tmpParticel.particleSize = distance > 500 ? 1 : 25;
                tmpParticel.emissionRate= distance > 500 ? 2 : 40;
                tmpParticel.startColor = Cesium.Color.LIGHTSEAGREEN.withAlpha(0.7);
            }
        }
    }

    tmpParticel = new Cesium.ParticleSystem({
        show: true,
        image: "./Models/image/partical.png",
        startColor: Cesium.Color.LIGHTSEAGREEN.withAlpha(0.7),
        endColor: Cesium.Color.WHITE.withAlpha(0.0),
        startScale: viewModel.startScale,
        endScale: viewModel.endScale,
        minimumParticleLife: viewModel.minimumParticleLife,
        maximumParticleLife: viewModel.maximumParticleLife,
        minimumSpeed: viewModel.minimumSpeed,
        maximumSpeed: viewModel.maximumSpeed,
        imageSize: new Cesium.Cartesian2(
            viewModel.particleSize,
            viewModel.particleSize
        ),
        emissionRate: viewModel.emissionRate,
        lifetime: 16.0,
        emitter: new Cesium.CircleEmitter(0.5),
        emitterModelMatrix: computeEmitterModelMatrix(),
        updateCallback: applyGravity,
    })
    const particleSystem = viewer.scene.primitives.add(tmpParticel);

    function computeModelMatrix(entity: any, time: any) {
        return entity.computeModelMatrix(time, new Cesium.Matrix4());
    }

    viewer.scene.preUpdate.addEventListener(function (scene: any, time: any) {
        particleSystem.modelMatrix = computeModelMatrix(boxEntity, time);

        // Account for any changes to the emitter model matrix.
        particleSystem.emitterModelMatrix = computeEmitterModelMatrix();

        // Spin the emitter if enabled.
        if (viewModel.spin) {
            viewModel.heading += 1.0;
            viewModel.pitch += 1.0;
            viewModel.roll += 1.0;
        }
    });

}

export const addWaterFlood = (viewer: any) => {
    addTestBlueBuilding(viewer);
    isWaterChange = true;
}

// 添加建筑切片3dtiles
let building: any = null;
export const addTestBlueBuilding = (viewer: any) => {

    const tmpTileset = new Cesium.Cesium3DTileset({
        // url: "./Models/szNanshan/tileset.json"
        url: "./Models/building4/tileset.json"
    })

    // 给建筑物添加shader
    tmpTileset.readyPromise.then(function (tileset: any) {
        viewer.scene.primitives.add(tmpTileset);
        building = tmpTileset;

        tileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ['true', 'rgba(0, 127.5, 255 ,1)']//'rgb(127, 59, 8)']
                ]
            }
        });

        tileset.tileVisible.addEventListener(function (tile: any) {
            const content = tile.content;
            const featuresLength = content.featuresLength;
            for (let i = 0; i < featuresLength; i += 2) {
                let feature = content.getFeature(i)
                let model = feature.content._model

                if (model && model._sourcePrograms && model._rendererResources) {
                    Object.keys(model._sourcePrograms).forEach(key => {
                        let program = model._sourcePrograms[key]
                        let fragmentShader = model._rendererResources.sourceShaders[program.fragmentShader];
                        let v_position = "";
                        if (fragmentShader.indexOf(" v_positionEC;") !== -1) {
                            v_position = "v_positionEC";
                        } else if (fragmentShader.indexOf(" v_pos;") !== -1) {
                            v_position = "v_pos";
                        }
                        const color = `vec4(${feature.color.toString()})`;

                        model._rendererResources.sourceShaders[program.fragmentShader] =
                            "varying vec3 " + v_position + ";\n" +
                            "void main(void){\n" +
                            "    vec4 position = czm_inverseModelView * vec4(" + v_position + ",1);\n" +
                            "    float glowRange = 120.0;\n" +
                            "    gl_FragColor = " + color + ";\n" +
                            // "    gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0);\n" +
                            "    gl_FragColor *= vec4(vec3(position.z / 80.0), 1.0);\n" +
                            "    float time = fract(czm_frameNumber / 120.0);\n" +
                            "    time = abs(time - 0.5) * 2.0;\n" +
                            "    float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));\n" +
                            // "    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);\n" +
                            "}\n"
                    })
                    model._shouldRegenerateShaders = true
                }
            }
        });

        // 设置3dTiles贴地
        set3DtilesHeight(500, tileset);

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

export const addJDYFlood = (viewer: any) => {

    const addRealFlood = (polyPosition: any) => {
        const tmpAllHeight = { maxHeight: 495, minHeight: 489 };
        const maxHeight = tmpAllHeight.maxHeight;
        const minHeight = tmpAllHeight.minHeight;
        let tmpHeight = minHeight;
        let tmpInterv = (maxHeight - minHeight) * 0.01;

        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.entities.add({
            name: '多边形',
            polygon: {
                hierarchy: polyPosition,
                perPositionHeight: true,
                extrudedHeight: new Cesium.CallbackProperty(() => {
                    if (!isWaterChange) return 0;
                    if (tmpHeight > maxHeight) {
                        tmpHeight = minHeight;
                        // isWaterChange = false;
                        // waterChangeTime = 0;
                    } else {
                        tmpHeight += tmpInterv;
                    }
                    return tmpHeight;
                }, false),
                // material: Cesium.Color.fromBytes(180, 130, 76, 150),
                // material: Cesium.Color.fromBytes(64, 157, 253, 150),
                material: Cesium.Color.fromBytes(174, 128, 77, 150),
            }
        })
    }

    addRealFlood(Cesium.Cartesian3.fromDegreesArray(WaterFloodCord))


}

// 测试飞行路线
export const flightTest01 = (viewer: any) => {
    const coordinates = flightLine.features[0].geometry.coordinates;
    const flightData: any = [];
    for (let i = 0; i < coordinates.length; i++) {
        flightData.push({
            "longitude": coordinates[i][0],
            "latitude": coordinates[i][1],
            "height": 550
        })
    }

    const timeStepInSeconds = 30;
    const totalSeconds = timeStepInSeconds * (flightData.length - 1);
    const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
    const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.timeline.zoomTo(start, stop);
    // Speed up the playback speed 50x.
    viewer.clock.multiplier = 50;
    // Start playing the scene.
    viewer.clock.shouldAnimate = true;

    // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
    const positionProperty = new Cesium.SampledPositionProperty();

    for (let i = 0; i < flightData.length; i++) {
        const dataPoint = flightData[i];

        // Declare the time for this individual sample and store it in a new JulianDate instance.
        const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
        const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
        // Store the position along with its timestamp.
        // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
        positionProperty.addSample(time, position);

        // viewer.entities.add({
        //     description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
        //     position: position,
        //     point: { pixelSize: 10, color: Cesium.Color.RED }
        // });
    }

    // STEP 4 CODE (green circle entity)        
    const loadModel = async () => {
        const airplaneUrl = await Cesium.IonResource.fromAssetId(178347);
        const airplaneEntity = viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
            position: positionProperty,
            path: new Cesium.PathGraphics({ width: 3 }),
            model: { 
                uri: airplaneUrl,
                // scale: 0.01
             },
            orientation: new Cesium.VelocityOrientationProperty(positionProperty)
        });

        // Make the camera track this moving entity.
        viewer.trackedEntity = airplaneEntity;
    }

    loadModel();
}
export const flightTest02 = (viewer: any) => {

    // const orgpositionList = [
    //     {
    //         cameraHPR: { heading: 6.652918163566034, pitch: -23.670164833832093, roll: 0.021378797704744146 },
    //         cameraHeight: { longitude: 1.8161613604038636, latitude: 0.5365270736995406, height: 1941.1891017571359 },
    //         midLocation: { lon: 104.06374491834225, lat: 30.78044342788164 },
    //         maxx: 104.16204226936144,
    //         maxy: 30.88199944629672,
    //         minx: 103.99029394786989,
    //         miny: 30.759869733757323,
    //     },
    //     {
    //         cameraHPR: { heading: 27.0128706861549, pitch: -42.57919442963148, roll: 0.10442686100153424 },
    //         cameraHeight: { longitude: 1.8159087710608013, latitude: 0.536990274393421, height: 1166.5580844371125 },
    //         maxx: 104.06850505403422,
    //         maxy: 30.792106327787764,
    //         midLocation: { lon: 104.04993287186846, lat: 30.777479274946113 },
    //         minx: 104.04022136849748,
    //         miny: 30.769869939838074,
    //     },
    //     {
    //         cameraHPR: { heading: 97.45542653664275, pitch: -23.332199614652108, roll: 0.1823598102269964 },
    //         cameraHeight: { longitude: 1.8158521231255667, latitude: 0.5370592687735752, height: 940.2614186444936 },
    //         maxx: 104.12471300905945,
    //         maxy: 30.80007526452808,
    //         midLocation: { lon: 104.06324959580404, lat: 30.768675166899442 },
    //         minx: 104.05135631838664,
    //         miny: 30.725733140607268,
    //     },
    //     {
    //         cameraHPR: { heading: 86.54908880930111, pitch: -8.398338637671372, roll: 0.17041561019198742 },
    //         cameraHeight: { longitude: 1.8160477325473185, latitude: 0.536990242336082, height: 654.8231346993504 },
    //         maxx: 105.01508286133091,
    //         maxy: 31.5862887489164,
    //         midLocation: { lon: 104.09822613140358, lat: 30.76968006047867 },
    //         minx: 103.0886580771976,
    //         miny: 30.760204570680866,

    //     },
    //     {
    //         cameraHPR: { heading: 69.84474768924534, pitch: -24.02839251843541, roll: 0.17366530469938055 },
    //         cameraHeight: { longitude: 1.8161697301231845, latitude: 0.5369713926557584, height: 685.7675497087027 },
    //         maxx: 104.11668596175066,
    //         maxy: 30.80545069086785,
    //         midLocation: { lon: 104.07394842479444, lat: 30.77097561244481 },
    //         minx: 104.06473040237525,
    //         miny: 30.758139679364014,
    //     },
    //     {
    //         cameraHPR: { heading: 69.84475174018445, pitch: -24.02839585353808, roll: 0.173655356159698 },
    //         cameraHeight: { longitude: 1.8162992487502085, latitude: 0.5368875323874007, height: 1073.3500824621467 },
    //         maxx: 104.15696514127319,
    //         maxy: 30.822959225619428,
    //         midLocation: { lon: 104.08989983965004, lat: 30.768873321889323 },
    //         minx: 104.07546942649603,
    //         miny: 30.74874510003887,
    //     },
    //     {
    //         cameraHPR: { heading: 6.652918163566034, pitch: -23.670164833832093, roll: 0.021378797704744146 },
    //         cameraHeight: { longitude: 1.8161613604038636, latitude: 0.5365270736995406, height: 1941.1891017571359 },
    //         midLocation: { lon: 104.06374491834225, lat: 30.78044342788164 },
    //         maxx: 104.16204226936144,
    //         maxy: 30.88199944629672,
    //         minx: 103.99029394786989,
    //         miny: 30.759869733757323,
    //     },

    // ]

    // const orgpositionList = [
    //     {
    //         cameraHPR: { heading: 133.3609743017041, pitch: -16.369337186833643, roll: 0.1279255313695261 },
    //         cameraHeight: { longitude: 1.815851462402374, latitude: 0.5371574042180032, height: 790.9728001576939 },
    //         maxx: 105.10024098228838,
    //         maxy: 31.676571373068384,
    //         midLocation: { lon: 104.06108828795156, lat: 30.760161882449538 },
    //         minx: 102.98100905434063,
    //         miny: 30.763830398693845,
    //     },
    //     {
    //         cameraHPR: { heading: 133.36097924256342, pitch: -16.369321301844764, roll: 0.1279079998920797 },
    //         cameraHeight: { longitude: 1.8160036349462967, latitude: 0.537031707409364, height: 788.6189675234281 },
    //         maxx: 105.10728557220747,
    //         maxy: 31.668038426284337,
    //         midLocation: { lon: 104.06974470400772, lat: 30.753009657752138 },
    //         minx: 102.99140215347064,
    //         miny: 30.75666723516035,
    //     },
    //     {
    //         cameraHPR: { heading: 82.01556664263038, pitch: -35.94359280544416, roll: 0.20663267641945707 },
    //         cameraHeight: { longitude: 1.8162138546486037, latitude: 0.5369248138367584, height: 1385.2726259614535 },
    //         maxx: 104.1041762104805,
    //         maxy: 30.78867050646143,
    //         midLocation: { lon: 104.08115616249827, lat: 30.765918553469948 },
    //         minx: 104.07119247193879,
    //         miny: 30.748120249012054,
    //     },
    //     {
    //         cameraHPR: { heading: 89.3537262904265, pitch: -16.100381262764472, roll: 0.17576831147889319 },
    //         cameraHeight: { longitude: 1.8164176745610652, latitude: 0.5369542141085324, height: 974.9128577700126 },
    //         maxx: 105.25050916065776,
    //         maxy: 31.763510329110428,
    //         midLocation: { lon: 104.1083764718844, lat: 30.76554939809908 },
    //         minx: 102.89562400997526,
    //         miny: 30.756253125361933,
    //     },
    //     {
    //         cameraHPR: { heading: 6.652918163566034, pitch: -23.670164833832093, roll: 0.021378797704744146 },
    //         cameraHeight: { longitude: 1.8161613604038636, latitude: 0.5365270736995406, height: 1941.1891017571359 },
    //         midLocation: { lon: 104.06374491834225, lat: 30.78044342788164 },
    //         maxx: 104.16204226936144,
    //         maxy: 30.88199944629672,
    //         minx: 103.99029394786989,
    //         miny: 30.759869733757323,
    //     },
    // ];

    const orgpositionList = [      
        {
            cameraHPR: { heading: 153.43856517230074, pitch: -9.73252251093558, roll: 0.07660269872902929 },
            cameraHeight: { longitude: 1.8159221413898698, latitude: 0.5371575724182873, height: 629.8668450350851 },
            maxx: 104.98929744674714,
            maxy: 31.580187886471403,
            midLocation: { lon: 104.06185258937609, lat: 30.747182528672166 },
            minx: 103.10005180524945,
            miny: 30.763154818002352,
        },
        {
            cameraHPR: { heading: 153.75635536528912, pitch: -20.35221838217794, roll: 0.07958389848868294 },
            cameraHeight: { longitude: 1.8159554487735392, latitude: 0.5370804174731175, height: 708.6187781710912 },
            maxx: 104.14247170841546,
            maxy: 30.76731107565897,
            midLocation: { lon: 104.05540903354549, lat: 30.756979977702905 },
            minx: 104.04087412637821,
            miny: 30.673801199351168,
        },
        {
            cameraHPR: { heading: 115.60296054738397, pitch: -14.04675384795527, roll: 0.15695534979107897 },
            cameraHeight: { longitude: 1.815986239931206, latitude: 0.5370132112349144, height: 585.4354460574084 },
            maxx: 104.95869207386541,
            maxy: 31.54319366732148,
            midLocation: { lon: 104.07040321323709, lat: 30.759461414489753 },
            minx: 103.13800232991416,
            miny: 30.75943616258597,
        },
        {
            cameraHPR: { heading: 132.93953739281932, pitch: -14.379020949460076, roll: 0.12757851868692632 },
            cameraHeight: { longitude: 1.8160139551878371, latitude: 0.537032226414407, height: 636.3788298390069 },
            maxx: 104.99939608286873,
            maxy: 31.577130423872752,
            midLocation: { lon: 104.06892888793773, lat: 30.754414187110854 },
            minx: 103.10047425537704,
            miny: 30.758473004918716,
        },
        {
            cameraHPR: { heading: 50.17946324024635, pitch: -15.03168204138972, roll: 0.13437195660209675 },
            cameraHeight: { longitude: 1.81607197310695, latitude: 0.5369331095137597, height: 643.0655123839153 },
            maxx: 105.00767903649353,
            maxy: 31.575664002963553,
            midLocation: { lon: 104.07248644694882, lat: 30.777841401094058 },
            minx: 103.09883966555482,
            miny: 30.76537037440261,
        },
        {
            cameraHPR: { heading: 5.39614970737285, pitch: -9.390672230333035, roll: 0.016105641208721135 },
            cameraHeight: { longitude: 1.816212049752347, latitude: 0.5369430055680182, height: 607.904504551795 },
            maxx: 104.98903601872784,
            maxy: 31.553830525255815,
            midLocation: { lon: 104.06490334649297, lat: 30.797634097090913 },
            minx: 103.13353428449973,
            miny: 30.775350825647934,
        },
        {
            cameraHPR: {heading: 93.82529693886202, pitch: -18.35691281611371, roll: 0.17753733792151333},
            cameraHeight: {longitude: 1.8162105025938122, latitude: 0.5369916292439553, height: 793.426430340166},
            maxx: 104.30349860154776,
            maxy: 30.86530589519751,
            midLocation: {lon: 104.08613103627562, lat: 30.7659118898656},
            minx: 104.07266591577401,
            miny: 30.65291063412907,
        },
        {
            cameraHPR: { heading: 82.01556664263038, pitch: -35.94359280544416, roll: 0.20663267641945707 },
            cameraHeight: { longitude: 1.8162138546486037, latitude: 0.5369248138367584, height: 1385.2726259614535 },
            maxx: 104.1041762104805,
            maxy: 30.78867050646143,
            midLocation: { lon: 104.08115616249827, lat: 30.765918553469948 },
            minx: 104.07119247193879,
            miny: 30.748120249012054,
        },
        {
            cameraHPR: { heading: 89.3537262904265, pitch: -16.100381262764472, roll: 0.17576831147889319 },
            cameraHeight: { longitude: 1.8164176745610652, latitude: 0.5369542141085324, height: 974.9128577700126 },
            maxx: 105.25050916065776,
            maxy: 31.763510329110428,
            midLocation: { lon: 104.1083764718844, lat: 30.76554939809908 },
            minx: 102.89562400997526,
            miny: 30.756253125361933,
        },
        {
            cameraHPR: { heading: 6.652918163566034, pitch: -23.670164833832093, roll: 0.021378797704744146 },
            cameraHeight: { longitude: 1.8161613604038636, latitude: 0.5365270736995406, height: 1941.1891017571359 },
            midLocation: { lon: 104.06374491834225, lat: 30.78044342788164 },
            maxx: 104.16204226936144,
            maxy: 30.88199944629672,
            minx: 103.99029394786989,
            miny: 30.759869733757323,
        },
    ]


    const distanceArr: any = [];
    for (let i = 0; i < orgpositionList.length - 1; i++) {
        const p1 = orgpositionList[i].cameraHeight;
        const p2 = orgpositionList[i + 1].cameraHeight;
        const dh = p1.height - p2.height;
        const dlat = p1.latitude - p2.latitude;
        const dlng = p1.longitude - p2.longitude;
        const d = Math.sqrt(dh * dh + dlat * dlat + dlng * dlng);
        distanceArr.push(d);
    }

    let minDis = distanceArr[0];
    for (let i = 1; i < distanceArr.length; i++) {
        minDis = minDis < distanceArr[i] ? minDis : distanceArr[i];
    }
    const stepArray = [];
    const minStep = 20;
    for (let i = 0; i < distanceArr.length; i++) {
        // if (distanceArr[i] === minDis) {
        //     stepArray.push(minStep);
        // } else {
        //     stepArray.push(Math.round(distanceArr[i] * 10.0 / minDis));
        // }
        if (i + 1 === distanceArr.length) {
            stepArray.push(90);
        } else {
            stepArray.push(minStep);
        }
    }

    const positionList: any = [];
    for (let i = 0; i < stepArray.length; i++) {
        positionList.push(orgpositionList[i]);
        const sigheading = (orgpositionList[i + 1].cameraHPR.heading - orgpositionList[i].cameraHPR.heading) / stepArray[i];
        const sigpitch = (orgpositionList[i + 1].cameraHPR.pitch - orgpositionList[i].cameraHPR.pitch) / stepArray[i];
        const sigroll = (orgpositionList[i + 1].cameraHPR.roll - orgpositionList[i].cameraHPR.roll) / stepArray[i];
        const siglng = (orgpositionList[i + 1].cameraHeight.longitude - orgpositionList[i].cameraHeight.longitude) / stepArray[i];
        const siglat = (orgpositionList[i + 1].cameraHeight.latitude - orgpositionList[i].cameraHeight.latitude) / stepArray[i];
        const sigheght = (orgpositionList[i + 1].cameraHeight.height - orgpositionList[i].cameraHeight.height) / stepArray[i];

        for (let j = 1; j < stepArray[i] - 1; j++) {
            positionList.push({
                cameraHPR: {
                    heading: orgpositionList[i].cameraHPR.heading + sigheading * j,
                    pitch: orgpositionList[i].cameraHPR.pitch + sigpitch * j,
                    roll: orgpositionList[i].cameraHPR.roll + sigroll * j,
                },
                cameraHeight: {
                    longitude: orgpositionList[i].cameraHeight.longitude + siglng * j,
                    latitude: orgpositionList[i].cameraHeight.latitude + siglat * j,
                    height: orgpositionList[i].cameraHeight.height + sigheght * j,
                },
            })
        }
    }

    positionList.push(orgpositionList[orgpositionList.length - 1])


    let count = 0;
    fly();

    function fly() {
        if (count >= positionList.length) {
            // count = 0;
            return;
        }
        const cameraInfo = positionList[count];
        goToBookMark(viewer, cameraInfo, 0.1, fly);
        count++;
    }
}
export const addTestFlightLine = (viewer: any) => {

    if(building){
        // viewer.scene.primitives.remove(building);
    }
    // flightTest01(viewer);
    flightTest02(viewer);
}

// 辅助工具 
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

// 2021-04-20 粉刷匠 当前场景跳转, 血与泪的尝试，具体的尝试次数参考上面函数
export const goToBookMark = (viewer: any, cameraInfo: any, duration?: any, callBack?: any) => {
    if (!viewer) return;

    if (duration) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(cameraInfo.cameraHeight.longitude, cameraInfo.cameraHeight.latitude, cameraInfo.cameraHeight.height),
            orientation: {
                heading: Cesium.Math.toRadians(cameraInfo.cameraHPR.heading),
                pitch: Cesium.Math.toRadians(cameraInfo.cameraHPR.pitch),
                roll: Cesium.Math.toRadians(cameraInfo.cameraHPR.roll)
            },
            duration: duration,
            complete: function () {
                if (callBack) {
                    callBack();
                }
            }
        });
    } else {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(cameraInfo.cameraHeight.longitude, cameraInfo.cameraHeight.latitude, cameraInfo.cameraHeight.height),
            orientation: {
                heading: Cesium.Math.toRadians(cameraInfo.cameraHPR.heading),
                pitch: Cesium.Math.toRadians(cameraInfo.cameraHPR.pitch),
                roll: Cesium.Math.toRadians(cameraInfo.cameraHPR.roll)
            },
            complete: function () {
                if (callBack) {
                    callBack();
                }
            }
        });
    }
}

// 2021-08-16 粉刷匠 点击获取经纬度
export const clickToGetCord = (viewer: any) => {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement: any) {

        // 获取世界坐标 Ray 三维模式下的坐标转换（getPickRay参数：屏幕坐标），从摄像机位置通过窗口位置的像素创建一条光线，返回射线的笛卡尔坐标位置和方向
        const windowPosition = viewer.camera.getPickRay(movement.position);
        const cartesianCoordinates = viewer.scene.globe.pick(windowPosition, viewer.scene);
        const cartoCoordinates = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesianCoordinates);
        const latitude = (cartoCoordinates.latitude * 180 / Math.PI).toFixed(5);
        const longitude = (cartoCoordinates.longitude * 180 / Math.PI).toFixed(5);

        // 获取世界坐标 Cartesian3（pickEllipsoid参数：屏幕坐标，椭球体），二维的方法
        // WGS84经纬度坐标系（没有实际的对象）、WGS84弧度坐标系（Cartographic）、笛卡尔空间直角坐标系（Cartesian3）、平面坐标系（Cartesian2），4D笛卡尔坐标系（Cartesian4）
        // const cartesian2 = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
        // const carto2 = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian2);
        // const latitude = carto2.latitude * 180 / Math.PI;
        // const longitude = carto2.longitude * 180 / Math.PI;

        // 获取场景坐标 Cartesian3 （pickPosition）
        // const cartesian = viewer.scene.pickPosition(movement.position);
        // console.log("经f纬度：", cartoCoordinates);
        console.log("经纬度：", longitude, latitude);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}