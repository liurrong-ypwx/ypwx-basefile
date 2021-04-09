import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { flowArray, testFlightData } from '../../pages/CesiumDemo/ChBuild/testData';
// import CesiumHeatmap from "../../../public/js/CesiumHeatmap";
// const CesiumHeatmap = require('./component/CesiumHeatmap');
// import roadImage from "../../assets/image/road.jpg";
import testPoint from "../../assets/image/point5.png";
// import julei from "../../assets/image/point1.png";
import testgif from "../../assets/image/testgif.gif";

window.CESIUM_BASE_URL = './cesium/';
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTIxYjQ0Yi1kODkwLTQwYTctYTdjNi1hOTkwYTRhYTI2NDEiLCJpZCI6MzY4OTQsImlhdCI6MTYwNDMwMzkzM30.btKZ2YlmB0wCTBvk3ewmGk5MAjS5rwl_Izra03VcrnY';
const locationSZ = { lng: 114.167, lat: 22.67, height: 130000.0 };
// const locationJDY = { lng: 104.06, lat: 30.78, height: 13000.0 };
const location = locationSZ;



// 初始化地图
export const initMap = (domID: string, isAddBuilding: boolean) => {

    if (!document.getElementById(domID)) return;

    const viewer = new Cesium.Viewer(domID, {
        geocoder: false,
        homeButton: true,
        sceneModePicker: false,
        baseLayerPicker: true,
        navigationHelpButton: false,
        animation: false,
        // creditContainer:"credit",
        // timeline: false,
        fullscreenButton: false,
        vrButton: false,
        selectionIndicator: false,
        infoBox: false,

        // 演示1：三维地形图
        // terrainProvider: Cesium.createWorldTerrain({
        //     requestVertexNormals:true,
        //     requestWaterMask:true
        // }),
        // skyBox: new Cesium.SkyBox({
        //     sources: {
        //         positiveX: './Models/image/box.png',
        //         negativeX: './Models/image/box.png',
        //         positiveY: './Models/image/box.png',
        //         negativeY: './Models/image/box.png',
        //         positiveZ: './Models/image/box.png',
        //         negativeZ: './Models/image/box.png'
        //     }
        // })
    })
    // 演示1：添加免费的osm 建筑物图层
    // viewer.scene.primitives.add(Cesium.createOsmBuildings());

    // 导航插件
    // viewer.extend(Cesium.viewerCesiumNavigationMixin, {});

    // 额外设置之显示帧速
    viewer.scene.debugShowFramesPerSecond = true;


    // 假如添加建筑物3dtile
    // if (isAddBuilding) {

    //     const tmpTileset = new Cesium.Cesium3DTileset({
    //         url: "./Models/building2/tileset.json"
    //     })

    //     // 给建筑物添加shader
    //     tmpTileset.readyPromise.then(function (tileset: any) {

    //         // 摄像机移动到建筑群
    //         const boundingSphere = tileset.boundingSphere;
    //         viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0));
    //         viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);


    //         tileset.style = new Cesium.Cesium3DTileStyle({
    //             color: {
    //                 conditions: [
    //                     ['true', 'rgba(0, 127.5, 255 ,1)']//'rgb(127, 59, 8)']
    //                 ]
    //             }
    //         });


    //         tileset.tileVisible.addEventListener(function (tile: any) {
    //             const content = tile.content;
    //             const featuresLength = content.featuresLength;
    //             for (let i = 0; i < featuresLength; i += 2) {
    //                 let feature = content.getFeature(i)
    //                 let model = feature.content._model

    //                 if (model && model._sourcePrograms && model._rendererResources) {
    //                     Object.keys(model._sourcePrograms).forEach(key => {
    //                         let program = model._sourcePrograms[key]
    //                         let fragmentShader = model._rendererResources.sourceShaders[program.fragmentShader];
    //                         let v_position = "";
    //                         if (fragmentShader.indexOf(" v_positionEC;") !== -1) {
    //                             v_position = "v_positionEC";
    //                         } else if (fragmentShader.indexOf(" v_pos;") !== -1) {
    //                             v_position = "v_pos";
    //                         }
    //                         const color = `vec4(${feature.color.toString()})`;

    //                         model._rendererResources.sourceShaders[program.fragmentShader] =
    //                             "varying vec3 " + v_position + ";\n" +
    //                             "void main(void){\n" +
    //                             "    vec4 position = czm_inverseModelView * vec4(" + v_position + ",1);\n" +
    //                             "    float glowRange = 360.0;\n" +
    //                             "    gl_FragColor = " + color + ";\n" +
    //                             // "    gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0);\n" +
    //                             "    gl_FragColor *= vec4(vec3(position.z / 100.0), 1.0);\n" +
    //                             "    float time = fract(czm_frameNumber / 360.0);\n" +
    //                             "    time = abs(time - 0.5) * 2.0;\n" +
    //                             "    float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));\n" +
    //                             "    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);\n" +
    //                             "}\n"
    //                     })
    //                     model._shouldRegenerateShaders = true
    //                 }
    //             }
    //         });
    //     })



    //     // 普通款制作专题图的样式
    //     // tmpTileset.style = new Cesium.Cesium3DTileStyle({
    //     //     color: {
    //     //         conditions: [
    //     //             // eslint-disable-next-line
    //     //             ['${Height} >= 200', 'color("purple", 0.5)'],
    //     //             // eslint-disable-next-line
    //     //             ['${Height} >= 100', 'color("red")'],
    //     //             ['true', 'color("blue")']
    //     //         ]
    //     //     },        
    //     //     // eslint-disable-next-line
    //     //     show: '${Height} > 0',
    //     //     meta: {
    //     //         // eslint-disable-next-line
    //     //         description: '"Building id ${id} has height ${Height}."'
    //     //     }
    //     // });



    //     viewer.scene.primitives.add(tmpTileset);
    // }


    // 演示2：添加各类智慧城市的动效图，等等等等
    if (isAddBuilding) {

        // 添加测试蓝色的底图
        // addTestDarkImg(viewer);

        // 缩放到深圳
        setExtent(viewer);

        // 添加不同的地图底图
        addDiffBaseMap(viewer, "arcgis");

        // 添加聚类点
        // addClusterPoint(viewer);

        // 添加billboard gif
        // addBillBoardGif(viewer);
        


        // 添加测试南山区建筑3dtile数据
        // addTestBlueBuilding(viewer);

        // 添加Geojson数据
        // addGeoJsonData(viewer);


        // 添加测试道路数据
        // addTestRroadGeoJsonData(viewer);

      

        // 添加一个glb模型
        // addTestGlbLabel(viewer);

        // 添加测试标注的椭圆图片---透明png
        // addTestBox(viewer);

        // 添加蓝色的泛光线
        // addTestBlueLine(viewer);

        // 添加带有贴图的道路
        // addRoadWithImage(viewer);

        // 添加流动的线
        // addTestFlowLine(viewer);


        // 测试---雷达圆扫描图
        // showTestCircleScan(viewer);
        // 测试---雷达圆扩散图
        // showTestCircleScan2(viewer);



    }

    // addWmtsLayer(viewer);

    return viewer;
}

// 2021-04-09 粉刷匠 添加不同的底图
export const addDiffBaseMap = (viewer: any, type?: string) => {
    if (type === "gd") {
        viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
            url: 'http://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            tilingScheme: new Cesium.WebMercatorTilingScheme()
        }));
    } else if (type === "tdt") {
        //影像
        viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=077b9a921d8b7e0fa268c3e9146eb373",
                layer: "tdtBasicLayer",
                style: "default",
                format: "image/jpeg",
                // url: 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS',
                // layer: 'USGSShadedReliefOnly',
                // style: 'default',
                // format: 'image/jpeg',
                tileMatrixSetID: 'GoogleMapsCompatible',
                // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
                // maximumLevel: 19,
                // credit: new Cesium.Credit('U. S. Geological Survey')
            }),
        );
        // 注记
        viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=077b9a921d8b7e0fa268c3e9146eb373",
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: 'GoogleMapsCompatible',
            })
        );
    } else if (type === "arcgis") {
        viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
            url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
        }))
    } else if (type === "geoserver") {
        // wms地图服务
        viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
            url: 'http://localhost:8080/geoserver/fs/wms',
            layers: 'fs:county3',//图层
            parameters: {
                transparent: true,
                format: 'image/png',
                srs: 'EPSG:4490',
                styles: ''
            }
        }));
        // wmts服务
        viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts/rest/topp:states/{style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}?format=image/png',
            layer: 'topp:states',//图层名称
            style: '',
            format: 'image/png',
            tileMatrixSetID: 'EPSG:4326',
            tileMatrixLabels: ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'],
            tilingScheme: new Cesium.GeographicTilingScheme({
                numberOfLevelZeroTilesX: 2,
                numberOfLevelZeroTilesY: 1
            })
        }))
    }
}

// 2021-04-09 粉刷匠 添加聚类点
export const addClusterPoint = (viewer: any) => {
    // viewer.dataSources.add(Cesium.GeoJsonDataSource.load('./Models/json/clusterPoint.geojson'));
    Cesium.GeoJsonDataSource.load('./Models/json/clusterPoint.geojson').then(function (dataSource: any) {
        viewer.dataSources.add(dataSource);
        const entities = dataSource.entities.values;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            // 普通点
            // entity.billboard = undefined;
            // entity.point = new Cesium.PointGraphics({
            //     color: Cesium.Color.RED,
            //     pixelSize: 10
            // });
            // 对单个实体进行设置
            // entity.billboard = undefined;
            entity.billboard.image = testPoint;
            entity.billboard.width = 20;
            entity.billboard.height = 20;
            // todo:添加注记,下面的报错，有时间再修改，垃圾玩意
            // entity.label = new Cesium.LabelGraphics({
            //     text: entity.properties.id._value,
            //     // font: '12px sans-serif',
            //     // pixelOffset: new Cesium.Cartesian2(0.0, 10)
            // });    
        }

        // todo:点聚类练习
        dataSource.clustering.enabled = true;
        dataSource.clustering.pixelRange = 15;
        dataSource.clustering.minimumClusterSize = 3;

        dataSource.clustering.clusterEvent.addEventListener(function (entities: any, cluster: any) {
         
            cluster.billboard.id = cluster.label.id;
            const simpleImg = makeClusterImg(entities.length.toLocaleString());
            // cluster.billboard.image = julei;
            cluster.billboard.image = simpleImg;
            cluster.billboard.width = 60;
            cluster.billboard.height = 60;
            cluster.billboard.show = true;

            cluster.label.show = false;
            // cluster.label.text = entities.length.toLocaleString();
            // cluster.label.pixelOffset = new Cesium.Cartesian2(-10, 10)
        });

    })
}

// 构造聚类图标
export const makeClusterImg = (number: string) => {
    const ramp = document.createElement('canvas');
    ramp.width = 200;
    ramp.height = 200;
    const ctx: any = ramp.getContext('2d');
    ctx.beginPath();

    // todo: 加载聚类的图标,粉刷匠 加不上去，谢特    
    // const img = new Image();    
    // img.onload = () => {
    //     // 将图片画到canvas上面上去！
    //     ctx.drawImage(img, 0, 0, 100, 100);
    // }
    // img.src = julei;
    // img.src = "./point2.png";
    // ctx.fillRect(0, 0, 100, 100);

    // 惨绝人寰 画一个扩散图
    ctx.fillStyle = 'rgba(255, 160, 122,0.3)';
    const panR = 110;
    const panL = (360 - (panR * 3)) / 3;
    const panStart = (90 - panR / 2) - panL;

    ctx.beginPath();
    ctx.moveTo(100, 100); 
    ctx.arc(100, 100, 90, panStart * Math.PI / 180, (panStart + panR) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 90, (panStart + panR + panL) * Math.PI / 180, (panStart + panR * 2 + panL) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 90, (panStart + panR * 2 + panL * 2) * Math.PI / 180, (panStart + panR * 3 + panL * 2) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 127, 80,0.5)';
    ctx.beginPath();
    ctx.moveTo(100, 100); 
    ctx.arc(100, 100, 70, panStart * Math.PI / 180, (panStart + panR) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 70, (panStart + panR + panL) * Math.PI / 180, (panStart + panR * 2 + panL) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 70, (panStart + panR * 2 + panL * 2) * Math.PI / 180, (panStart + panR * 3 + panL * 2) * Math.PI / 180, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 69, 0,0.8)';
    ctx.beginPath();
    ctx.moveTo(100, 100); 
    ctx.arc(100, 100, 50, panStart * Math.PI / 180, (panStart + panR) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 50, (panStart + panR + panL) * Math.PI / 180, (panStart + panR * 2 + panL) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 50, (panStart + panR * 2 + panL * 2) * Math.PI / 180, (panStart + panR * 3 + panL * 2) * Math.PI / 180, false);
    ctx.closePath();
    ctx.restore();
    ctx.fill();

    ctx.fillStyle = '#fff';   // 文字填充颜色
    ctx.font = '64px Adobe Ming Std';
    ctx.textAlign = 'center';
    ctx.fillText(number, 100, 120);
    ctx.stroke();


    
    return ramp.toDataURL();
}

// 2021-04-09 粉刷匠 添加gif  billboard
export const addBillBoardGif = (viewer: any) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    div.appendChild(img);
    img.src = testgif;

    img.onload = () => {
        const superGif = new window.SuperGif({
            gif: img
        });

        superGif.load(() => {
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 1000),
                billboard: {
                    image: new Cesium.CallbackProperty(() => {
                        return superGif.get_canvas().toDataURL("image/png");
                    }, false),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 2000, 0.1)
                }
            });
        });

    }


}


// 添加geoserver发布的wmts服务
export const addWmtsLayer = (viewer: any) => {
    const turl = "http://localhost:8080/geoserver/gwc/service/wmts/rest/nurc:Pk50095/{style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}?format=image/png";
    const tlayer = new Cesium.WebMapTileServiceImageryProvider({
        url: turl,
        layer: 'nurc:Pk50095',
        style: 'default',
        format: 'image/png',
        tileMatrixSetID: 'EPSG:900913',
    });
    viewer.imageryLayers.addImageryProvider(tlayer);
}

// =================================这是示例区域========================
export const addTestDarkImg = (viewer: any) => {
    // 添加一个蓝色底图来加强图像的展示
    viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
            url: './Models/image/dark.png'
        })
    )
}

// 获取相机参数
export const getTestCameraPara = (viewer: any) => {
    
    console.log("参数postion", viewer.camera.position);
    console.log("参数postion", viewer.camera.heading);
    console.log("参数postion", viewer.camera.pitch);
    console.log("参数postion", viewer.camera.roll);
}

// 2020-12-25 粉刷匠 添加热力图
export const addTestHeatmap = (viewer: any) => {
    // 矩形坐标 xmin ymin xmax ymax
    // let bounds = {
    //     west: 113.779,
    //     east: 114.142,
    //     south: 22.564,
    //     north:22.774
    // };

    // let heatMap = CesiumHeatmap.create(
    //     viewer, // your cesium viewer
    //     bounds, // bounds for heatmap layer
    //     {
    //         // backgroundColor: "rgba(0,0,0,0)",
    //         // radius: 50,
    //         // maxOpacity: .5,
    //         // minOpacity: 0,
    //         // blur: .75
    //     }
    // );

    // // random example data
    // let data = [{ "x": 114.1383442264, "y": 22.4360048372, "value": 76 },
    //  { "x": 114.1384363011, "y": 22.4360298848, "value": 63 }, 
    //  { "x": 114.138368102, "y": 22.4358360603, "value": 1 }, 
    //  { "x": 114.1385627739, "y": 22.4358799123, "value": 21 }, 
    //  { "x": 114.1385138501, "y": 22.4359327669, "value": 28 }, 
    //  { "x": 114.1385031219, "y": 22.4359730105, "value": 41 }, 
    //  { "x": 114.1384127393, "y": 22.435928255, "value": 75 },
    //   { "x": 114.1384551136, "y": 22.4359450132, "value": 3 },
    //    { "x": 114.1384927196, "y": 22.4359158649, "value": 45 }, 
    //    { "x": 114.1384938639, "y": 22.4358498311, "value": 45 }, { "x": 114.1385183299, "y": 22.4360213794, "value": 93 }, { "x": 114.1384007925, "y": 22.4359860133, "value": 46 }, { "x": 114.1383604844, "y": 22.4358298672, "value": 54 }, { "x": 114.13851025, "y": 22.4359098303, "value": 39 }, { "x": 114.1383874733, "y": 22.4358511035, "value": 34 }, { "x": 114.1384981796, "y": 22.4359355403, "value": 81 }, { "x": 114.1384504107, "y": 22.4360332348, "value": 39 }, { "x": 114.1385582664, "y": 22.4359788335, "value": 20 }, { "x": 114.1383967364, "y": 22.4360581999, "value": 35 }, { "x": 114.1383839615, "y": 22.436016316, "value": 47 }, { "x": 114.1384082712, "y": 22.4358423338, "value": 36 }, { "x": 114.1385092651, "y": 22.4358577623, "value": 69 }, { "x": 114.138360356, "y": 22.436046789, "value": 90 }, { "x": 114.138471893, "y": 22.4359184292, "value": 88 }, { "x": 114.1385605689, "y": 22.4360271359, "value": 81 }, { "x": 114.1383585714, "y": 22.4359362476, "value": 32 }, { "x": 114.1384939114, "y": 22.4358844253, "value": 67 }, { "x": 114.138466724, "y": 22.436019121, "value": 17 }, { "x": 114.1385504355, "y": 22.4360614056, "value": 49 }, { "x": 114.1383883832, "y": 22.4358733544, "value": 82 }, { "x": 114.1385670669, "y": 22.4359650236, "value": 25 }, { "x": 114.1383416534, "y": 22.4359310876, "value": 82 }, { "x": 114.138525285, "y": 22.4359394661, "value": 66 }, { "x": 114.1385487719, "y": 22.4360137656, "value": 73 }, { "x": 114.1385496029, "y": 22.4359187277, "value": 73 }, { "x": 114.1383989222, "y": 22.4358556562, "value": 61 }, { "x": 114.1385499424, "y": 22.4359149305, "value": 67 }, { "x": 114.138404523, "y": 22.4359563326, "value": 90 }, { "x": 114.1383883675, "y": 22.4359794855, "value": 78 }, { "x": 114.1383967187, "y": 22.435891185, "value": 15 }, { "x": 114.1384610005, "y": 22.4359044797, "value": 15 }, { "x": 114.1384688489, "y": 22.4360396127, "value": 91 }, { "x": 114.1384431875, "y": 22.4360684409, "value": 8 }, { "x": 114.1385411067, "y": 22.4360645847, "value": 42 }, { "x": 114.1385237178, "y": 22.4358843181, "value": 31 }, { "x": 114.1384406464, "y": 22.4360003831, "value": 51 }, { "x": 114.1384679169, "y": 22.4359950456, "value": 96 }, { "x": 114.1384194314, "y": 22.4358419739, "value": 22 }, { "x": 114.1385049792, "y": 22.4359574813, "value": 44 }, { "x": 114.1384097378, "y": 22.4358598672, "value": 82 }, { "x": 114.1384993219, "y": 22.4360352975, "value": 84 }, { "x": 114.1383640499, "y": 22.4359839518, "value": 81 }];
    // let valueMin = 0;
    // let valueMax = 100;

    // // add data to heatmap
    // heatMap.setWGS84Data(valueMin, valueMax, data);

}

export const addImageLine = (viewer: any, lineArr: any) => {
    if (!viewer) return;

    viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(lineArr),
            width: 60,
            // 流动纹理
            material: new Cesium.ImageMaterialProperty({
                image:'./Models/image/road.jpg'
            })
        }
    });
}

// 添加带贴图的道路
export const addRoadWithImage = (viewer: any) => {
    const orgArr = flowArray;
    for (let i = 0; i < 1; i++) {
        const tmpSigLine = orgArr[i];
        const tmpArr: any = [];
        for (let j = 0; j < tmpSigLine.length; j++) {
            if (tmpSigLine[j][0] && tmpSigLine[j][1]) {
                tmpArr.push(tmpSigLine[j][0]);
                tmpArr.push(tmpSigLine[j][1]);
            }
        }
        addImageLine(viewer, tmpArr);
    }
}

export const addTestBlueLine = (viewer: any) => {
    const orgArr = flowArray;
    for (let i = 0; i < orgArr.length; i++) {
        const tmpSigLine = orgArr[i];
        const tmpArr: any = [];
        for (let j = 0; j < tmpSigLine.length; j++) {
            if (tmpSigLine[j][0] && tmpSigLine[j][1]) {
                tmpArr.push(tmpSigLine[j][0]);
                tmpArr.push(tmpSigLine[j][1]);
            }
        }
        addGlowPolyLine(viewer, tmpArr);
    }
}

export const addTestFlowLine = (viewer: any) => {
    const orgArr = flowArray;
    for (let i = 0; i < orgArr.length; i++) {
        const tmpSigLine = orgArr[i];
        const tmpArr: any = [];
        for (let j = 0; j < tmpSigLine.length; j++) {
            if (tmpSigLine[j][0] && tmpSigLine[j][1]) {
                tmpArr.push(tmpSigLine[j][0]);
                tmpArr.push(tmpSigLine[j][1]);
            }
        }
        addFlowLine(viewer, tmpArr);
    }
}

// 添加一个旋转的圆圈
export const addTestBox = (viewer: any) => {

    let rotation = Cesium.Math.toRadians(30);
    function getRotationValue() {
        rotation += 0.002;
        return rotation;
    }

    // 旋转的 圆
    viewer.entities.add({
        name: "a rotate ellipse ",
        position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 1000),
        ellipse: {
            semiMinorAxis: 1000,
            semiMajorAxis: 1000,
            height: 2000,
            material: new Cesium.ImageMaterialProperty({
                image: './Models/image/circle.png',
                repeat: new Cesium.Cartesian2(1, 1),
                transparent: true
            }),
            rotation: new Cesium.CallbackProperty(getRotationValue, false),
            stRotation: new Cesium.CallbackProperty(getRotationValue, false),
            outline: false, // height must be set for outline to display
            numberOfVerticalLines: 100
        },
        description: '测试数据'
    });

}

export const addTestBlueBuilding = (viewer: any) => {

    const tmpTileset = new Cesium.Cesium3DTileset({
        url: "./Models/szNanshan/tileset.json"
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
                            "    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);\n" +
                            "}\n"
                    })
                    model._shouldRegenerateShaders = true
                }
            }
        });

        // 设置3dTiles贴地
        set3DtilesHeight(1, tileset);
       

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

export const addTestGlbLabel = (viewer: any) => {
    const flightData = testFlightData;
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
        const position = Cesium.Cartesian3.fromDegrees(dataPoint[0], dataPoint[1], dataPoint[2]);
        // Store the position along with its timestamp.
        // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
        positionProperty.addSample(time, position);
    }

    // STEP 4 CODE (green circle entity)        
    const loadModel = async () => {
        const airplaneUrl = "./Models/Cesium_Air.glb";
        viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
            position: positionProperty,
            // path: new Cesium.PathGraphics({ width: 3 }),
            model: {
                uri: airplaneUrl,
                minimumPixelSize: 40,
                maximumScale: 20000,
            },
            orientation: new Cesium.VelocityOrientationProperty(positionProperty)
        });
    }

    loadModel();
}

// 测试 沿指定的路径飞行
export const addTestFlightLine = (viewer: any) => {
    // const positionList = testFlightData2;

    const positionList = [
        {
            direction: { x: 0.21737389927048856, y: -0.35625827851488445, z: 0.0005457635106811409 },
            position: {x: -2391675.894952625, y: 5388787.412965841, z: 2426462.2897910792}
        },
        {
            direction: { x: 0.29263695515353305, y: -0.40838371225120706, z: 0.0007456844237099247 },
            position:  {x: -2391483.00669378, y: 5388427.905450816, z: 2427118.8780692583}
        },
        {
            direction: { x: 0.3335510891862299, y: 0.060774701476857595, z: 0.0007774323957603357 },
            position:{x: -2391466.8883185615, y: 5388021.038587686, z: 2427348.174456691}
        },
        {
            direction: { x: 0.32721424136304833, y: 0.10707579115246624, z: 0.0007227711996984354 },
            position: {x: -2391790.5365237165, y: 5387942.510425894, z: 2427250.5374713736}
        }
    ]
    let count = 0;
    fly();

    function fly() {
        if (count >= positionList.length) {
            return;
        }
        var position = positionList[count];

        viewer.camera.flyTo({
            // destination: Cesium.Cartesian3.fromDegrees(
            //     position[0],
            //     position[1],
            //     200
            // ),
            destination: position.position,
            duration: 0.3,

            orientation: {
                heading: position.direction.x,
                pitch: position.direction.y,
                roll: position.direction.z
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

export const addTestRroadGeoJsonData = (viewer: any) => {
    const tmpDataSource = Cesium.GeoJsonDataSource.load('./Models/json/line2.json', {
        clampToGround: true,
        stroke: Cesium.Color.CHOCOLATE,
        strokeWidth: 1,
        markerSymbol: '?'
    })

    tmpDataSource.then(function (dataSource: any) {
        viewer.dataSources.add(dataSource);
        
        const entities = dataSource.entities.values;
        for (let i = 0; i < entities.length; i++) {
            entities[i].polyline.classificationType = Cesium.ClassificationType.TERRAIN;
        }

    })
    
}

// 添加一个圆扫描--测试
export const showTestCircleScan = (viewer: any) => {

    let rotation = Cesium.Math.toRadians(30);
    function getRotationValue() {
        rotation += 0.01;
        // rotation += 0.0;
        return rotation;
    }

    // 旋转的 圆
    viewer.entities.add({
        name: "a rotate ellipse ",
        position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 100),
        ellipse: {
            semiMinorAxis: 1000,
            semiMajorAxis: 1000,
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
export const showTestCircleScan2 = (viewer: any) => {

    const data = {
        minR: 100,
        maxR: 1000,
        deviationR: 10,// 差值 差值也大 速度越快
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
        position: Cesium.Cartesian3.fromDegrees(113.91, 22.51, 100),
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

// 获取渐变色颜色的环
const getColorCircle2 = (color: any, isTransparent?: boolean) => {
    const ramp = document.createElement('canvas');
    ramp.width = 100;
    ramp.height = 100;
    const ctx: any = ramp.getContext('2d');

    // const values = elevationRamp;
    const grd = ctx.createRadialGradient(50, 50, 50, 50, 50, 0);
    grd.addColorStop(1, 'transparent'); //black
    grd.addColorStop(0.1, 'rgba(225,255,255,0.1)'); //black
    grd.addColorStop(0, "rgba(225,255,255,0.7)");

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
    grd.addColorStop(0.5, 'rgba(225,255,255,0.5)'); //orange
    grd.addColorStop(1, 'rgba(225,255,255,1)'); //yellow

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.arc(50, 50, 50, -90 / 180 * Math.PI, 0 / 180 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'transparent';
    ctx.strokeStyle = 'rgba(225,255,255,1)';
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    return ramp;
}

// showCircleScan() // 圆扩散
export const showCircleScan = (viewer: any) => {
    const cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(113.9), Cesium.Math.toRadians(22.51), 1000);
    const scanColor = Cesium.Color.CYAN;
    addCircleScanPostStage(viewer, cartographicCenter, 1000, scanColor, 4000);
}

// showRadarScan() // 雷达扫描
export const showRadarScan = (viewer: any) => {
    const cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(113.9), Cesium.Math.toRadians(22.49), 320);
    // const scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
    const scanColor = Cesium.Color.AQUA;
    addRadarScanPostStage(viewer, cartographicCenter, 1000, scanColor, 3000);
}

/*
    添加扩散效果扫描线
    viewer
    cartographicCenter 扫描中心
    radius  半径 米
    scanColor 扫描颜色
    duration 持续时间 毫秒
*/
function addCircleScanPostStage(viewer: any, cartographicCenter: any, maxRadius: any, scanColor: any, duration: any) {
    const _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    const _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

    const _CartograhpicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
    const _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartograhpicCenter1);
    const _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

    const _time = (new Date()).getTime();

    const _scratchCartesian4Center = new Cesium.Cartesian4();
    const _scratchCartesian4Center1 = new Cesium.Cartesian4();
    const _scratchCartesian3Normal = new Cesium.Cartesian3();


    const ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: getScanSegmentShader(),
        uniforms: {
            u_scanCenterEC: function () {
                const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                return temp;
            },
            u_scanPlaneNormalEC: function () {
                const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                const temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);

                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;

                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

                return _scratchCartesian3Normal;
            },
            u_radius: function () {
                return maxRadius * (((new Date()).getTime() - _time) % duration) / duration;
            },
            u_scanColor: scanColor
        }
    });

    viewer.scene.postProcessStages.add(ScanPostStage);
    return ScanPostStage;
}

//扩散效果Shader
function getScanSegmentShader() {
    // eslint-disable-next-line
    const scanSegmentShader = "\n\
                uniform sampler2D colorTexture;\n\
                uniform sampler2D depthTexture;\n\
                varying vec2 v_textureCoordinates;\n\
                uniform vec4 u_scanCenterEC;\n\
                uniform vec3 u_scanPlaneNormalEC;\n\
                uniform float u_radius;\n\
                uniform vec4 u_scanColor;\n\
                \n\
                vec4 toEye(in vec2 uv,in float depth)\n\
                {\n\
                            vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n\
                            vec4 posIncamera = czm_inverseProjection * vec4(xy,depth,1.0);\n\
                            posIncamera = posIncamera/posIncamera.w;\n\
                            return posIncamera;\n\
                }\n\
                \n\
                vec3 pointProjectOnPlane(in vec3 planeNormal,in vec3 planeOrigin,in vec3 point)\n\
                {\n\
                            vec3 v01 = point - planeOrigin;\n\
                            float d = dot(planeNormal,v01);\n\
                            return (point-planeNormal * d);\n\
                }\n\
                float getDepth(in vec4 depth)\n\
                {\n\
                            float z_window = czm_unpackDepth(depth);\n\
                            z_window = czm_reverseLogDepth(z_window);\n\
                            float n_range = czm_depthRange.near;\n\
                            float f_range = czm_depthRange.far;\n\
                            return (2.0 * z_window - n_range - f_range)/(f_range-n_range);\n\
                } \n\
                void main()\n\
                {\n\
                            gl_FragColor = texture2D(colorTexture,v_textureCoordinates);\n\
                            float depth = getDepth(texture2D(depthTexture,v_textureCoordinates));\n\
                            vec4 viewPos = toEye(v_textureCoordinates,depth);\n\
                            vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz,u_scanCenterEC.xyz,viewPos.xyz);\n\
                            float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n\
                            if(dis<u_radius)\n\
                            {\n\
                                float f = 1.0-abs(u_radius - dis )/ u_radius;\n\
                                f = pow(f,4.0);\n\
                                gl_FragColor = mix(gl_FragColor,u_scanColor,f);\n\
                            }\n\
                } \n ";
    return scanSegmentShader;
}

/*
    添加雷达扫描线
    viewer
    cartographicCenter 扫描中心
    radius  半径 米
    scanColor 扫描颜色
    duration 持续时间 毫秒
*/
function addRadarScanPostStage(viewer: any, cartographicCenter: any, radius: any, scanColor: any, duration: any) {
    const _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    const _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

    const _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
    const _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
    const _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

    const _CartographicCenter2 = new Cesium.Cartographic(cartographicCenter.longitude + Cesium.Math.toRadians(0.001), cartographicCenter.latitude, cartographicCenter.height);
    const _Cartesian3Center2 = Cesium.Cartographic.toCartesian(_CartographicCenter2);
    const _Cartesian4Center2 = new Cesium.Cartesian4(_Cartesian3Center2.x, _Cartesian3Center2.y, _Cartesian3Center2.z, 1);
    const _RotateQ = new Cesium.Quaternion();
    const _RotateM = new Cesium.Matrix3();

    const _time = (new Date()).getTime();

    const _scratchCartesian4Center = new Cesium.Cartesian4();
    const _scratchCartesian4Center1 = new Cesium.Cartesian4();
    const _scratchCartesian4Center2 = new Cesium.Cartesian4();
    const _scratchCartesian3Normal = new Cesium.Cartesian3();
    const _scratchCartesian3Normal1 = new Cesium.Cartesian3();

    const ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: getRadarScanShader(),
        uniforms: {
            u_scanCenterEC: function () {
                return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
            },
            u_scanPlaneNormalEC: function () {
                const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                const temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;

                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                return _scratchCartesian3Normal;
            },
            u_radius: radius,
            u_scanLineNormalEC: function () {
                const temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                const temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                const temp2 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center2, _scratchCartesian4Center2);

                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;

                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

                _scratchCartesian3Normal1.x = temp2.x - temp.x;
                _scratchCartesian3Normal1.y = temp2.y - temp.y;
                _scratchCartesian3Normal1.z = temp2.z - temp.z;

                const tempTime = (((new Date()).getTime() - _time) % duration) / duration;
                Cesium.Quaternion.fromAxisAngle(_scratchCartesian3Normal, tempTime * Cesium.Math.PI * 2, _RotateQ);
                Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
                Cesium.Matrix3.multiplyByVector(_RotateM, _scratchCartesian3Normal1, _scratchCartesian3Normal1);
                Cesium.Cartesian3.normalize(_scratchCartesian3Normal1, _scratchCartesian3Normal1);
                return _scratchCartesian3Normal1;
            },
            u_scanColor: scanColor
        }
    });
    viewer.scene.postProcessStages.add(ScanPostStage);

    return ScanPostStage;
}
// 雷达扫描线效果Shader
function getRadarScanShader() {
    const scanSegmentShader =
        "uniform sampler2D colorTexture;\n" +
        "uniform sampler2D depthTexture;\n" +
        "varying vec2 v_textureCoordinates;\n" +
        "uniform vec4 u_scanCenterEC;\n" +
        "uniform vec3 u_scanPlaneNormalEC;\n" +
        "uniform vec3 u_scanLineNormalEC;\n" +
        "uniform float u_radius;\n" +
        "uniform vec4 u_scanColor;\n" +

        "vec4 toEye(in vec2 uv, in float depth)\n" +
        " {\n" +
        " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
        " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
        " posInCamera =posInCamera / posInCamera.w;\n" +
        " return posInCamera;\n" +
        " }\n" +

        "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
        "{\n" +
        "vec3 v01 = testPt - ptOnLine;\n" +
        "normalize(v01);\n" +
        "vec3 temp = cross(v01, lineNormal);\n" +
        "float d = dot(temp, u_scanPlaneNormalEC);\n" +
        "return d > 0.5;\n" +
        "}\n" +

        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
        "{\n" +
        "vec3 v01 = point -planeOrigin;\n" +
        "float d = dot(planeNormal, v01) ;\n" +
        "return (point - planeNormal * d);\n" +
        "}\n" +

        "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
        "{\n" +
        "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n" +
        "return length(tempPt - ptOnLine);\n" +
        "}\n" +

        "float getDepth(in vec4 depth)\n" +
        "{\n" +
        "float z_window = czm_unpackDepth(depth);\n" +
        "z_window = czm_reverseLogDepth(z_window);\n" +
        "float n_range = czm_depthRange.near;\n" +
        "float f_range = czm_depthRange.far;\n" +
        "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
        "}\n" +

        "void main()\n" +
        "{\n" +
        "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
        "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
        "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
        "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
        "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
        "float twou_radius = u_radius * 2.0;\n" +
        "if(dis < u_radius)\n" +
        "{\n" +
        "float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n" +
        "f0 = pow(f0, 64.0);\n" +
        "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n" +
        "float f = 0.0;\n" +
        "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n" +
        "{\n" +
        "float dis1= length(prjOnPlane.xyz - lineEndPt);\n" +
        "f = abs(twou_radius -dis1) / twou_radius;\n" +
        "f = pow(f, 3.0);\n" +
        "}\n" +
        "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n" +
        "}\n" +
        "}\n";
    return scanSegmentShader;
}


// --------------------------------------------------------------------

// 添加geojson数据
export const addGeoJsonData = (viewer: any) => {
    viewer.dataSources.add(Cesium.GeoJsonDataSource.load('./Models/json/shenzhengJson.json', {
        clampToGround: true,
        stroke: Cesium.Color.BLUE,
        strokeWidth: 1,
        markerSymbol: '?'
    }));
}

// 添加修改场景参数
export const updateScenePara = (viewer: any) => {
    const viewModel = {
        show: true,
        glowOnly: false,
        contrast: 128,
        brightness: -0.3,
        delta: 1.0,
        sigma: 3.78,
        stepSize: 5.0,
    };
    const bloom = viewer.scene.postProcessStages.bloom;
    bloom.enabled = Boolean(viewModel.show);
    bloom.uniforms.glowOnly = Boolean(viewModel.glowOnly);
    bloom.uniforms.contrast = Number(viewModel.contrast);
    bloom.uniforms.brightness = Number(viewModel.brightness);
    bloom.uniforms.delta = Number(viewModel.delta);
    bloom.uniforms.sigma = Number(viewModel.sigma);
    bloom.uniforms.stepSize = Number(viewModel.stepSize);
}

// 缩放到指定位置
export const setExtent = (viewer: any) => {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, location.height),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
        }
    });
}

// 添加building
export const addBuilding = (viewer: any, buildingUrl: string) => {
    let entity = viewer.entities.add({
        name: "plane",
        position: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, 1300.0),
        model: {
            uri: "./Models/building.glb",
        }
    });
    //设置摄像头定位到模型处
    viewer.trackedEntity = entity;
}

// 添加发光的线
export const addGlowPolyLine = (viewer: any, lineArr: any) => {
    if (!viewer) return;

    // 线纹理
    const lineEntity = new Cesium.Entity({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(lineArr),
            width: 10,
            // 发光纹理
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                taperPower: 0.9,
                // color: Cesium.Color.BLUE,
            })
        }
    })

    viewer.entities.add(lineEntity);
}

// 添加流动的线
export const addFlowLine = (viewer: any, lineArr: any) => {
    if (!viewer) return;

    viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(lineArr),
            width: 6,
            // 流动纹理
            // material: new Cesium.PolylineTrailLinkMaterialProperty({
            //     // color: Cesium.Color.CRIMSON,
            //     color: Cesium.Color.WHITE,
            //     duration: 5000,
            //     d: 1
            // })
        }
    });
}


// 添加几何体
interface IPostion {
    longitude: number,
    latitude: number
    height?: number
}
function computeCircle(radius: number) {
    const positions = [];
    for (let i = 0; i < 360; i++) {
        const radians = Cesium.Math.toRadians(i);
        positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
    }
    return positions;
}
export const addGeometry = (viewer: any, type: string, postion: IPostion) => {
    if (!viewer) return;

    // 箱子纹理
    const boxEntity = new Cesium.Entity({
        id: "boxID01",
        name: 'Red box with black outline',
        position: Cesium.Cartesian3.fromDegrees(113.91, 22.52, 100),
        box: {
            dimensions: new Cesium.Cartesian3(40, 30, 50),
            // 颜色材质
            // material: Cesium.Color.RED.withAlpha(0.5),
            // 图像材质
            // material: new Cesium.ImageMaterialProperty({
            //     image: './Models/image/test.png',
            //     color: Cesium.Color.BLUE,
            //     repeat: new Cesium.Cartesian2(4, 4)
            // }),
            // 黑白棋盘材质
            // material: new Cesium.CheckerboardMaterialProperty({
            //     evenColor:Cesium.Color.WHITE,
            //     oddColor: Cesium.Color.BLACK,
            //     repeat: new Cesium.Cartesian2(4, 4)
            // }),
            // 条纹纹理
            // material: new Cesium.StripeMaterialProperty({
            //     evenColor: Cesium.Color.WHITE,
            //     oddColor: Cesium.Color.BLACK,
            //     repeat: 32,
            //     offset: 20,
            //     orientation: Cesium.StripeOrientation.VERTICAL
            // }),

            // 网格纹理
            // material: new Cesium.GridMaterialProperty({
            //     color: Cesium.Color.YELLOW,
            //     cellAlpha: 0.2,
            //     lineCount: new Cesium.Cartesian2(8, 8),
            //     lineThickness: new Cesium.Cartesian2(2.0, 2.0)
            // }),

            // 渐变纹理
            material: new Cesium.ImageMaterialProperty({
                image: getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0], true),
                transparent: true,
            }),
            outline: true,
            outlineColor: Cesium.Color.BLACK
        }
    });

    // 线纹理
    const lineEntity = new Cesium.Entity({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([113.90, 22.52,
                113.91, 22.53]),
            width: 5,
            // material: Cesium.Color.RED
            // 发光纹理
            // material: new Cesium.PolylineGlowMaterialProperty({
            //     glowPower : 0.2,
            //     color : Cesium.Color.BLUE
            // })
            // border纹理
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.ORANGE,
                outlineWidth: 3,
                outlineColor: Cesium.Color.BLACK
            })
        }
    })

    // 动态纹理
    const tubeEntity = new Cesium.Entity({
        name: 'Red tube with rounded corners',
        polylineVolume: {
            positions: Cesium.Cartesian3.fromDegreesArray([113.90, 22.52, 113.904, 22.483]),
            shape: computeCircle(60.0),
            //颜色回调
            material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function () {
                return Cesium.Color.fromRandom({
                    minimumRed: 0.75,
                    minimumGreen: 0.75,
                    minimumBlue: 0.75,
                    alpha: 1.0
                });
            }, false))
        }
    })
    viewer.entities.add(tubeEntity);

    // 贴地线1---修改声明文件
    // const baseLine = new Cesium.Entity({
    //     corridor: {
    //         // positions: Cesium.Cartesian3.fromDegreesArray([113.90, 22.52,
    //         //     113.91, 22.53]),
    //         positions: Cesium.Cartesian3.fromDegreesArray([113.90, 22.52, 113.904, 22.483]),
    //         width: 5,
    //     }
    // })
    // viewer.entities.add(baseLine);

    // 贴地线2--转为json文件--不成功
    // viewer.dataSources.add(Cesium.GeoJsonDataSource.load('http://localhost:1234/lesson07/pwt1/line.json', {
    //     clampToGround: true
    // }));


    // 贴地线3---成功
    // viewer.scene.primitives.add(new Cesium.GroundPrimitive({
    //     geometryInstances: new Cesium.GeometryInstance({
    //         geometry: new Cesium.CorridorGeometry({
    //             vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
    //             positions: Cesium.Cartesian3.fromDegreesArray([
    //                 113.91, 22.52,
    //                 113.904, 22.483                  
    //             ]),
    //             width: 10
    //         }),
    //         attributes: {
    //             color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.3, 0.9, 0.5))
    //         }
    //     }),
    //     classificationType: Cesium.ClassificationType.TERRAIN
    // }));


    // 线纹理
    viewer.entities.add(boxEntity);
    viewer.entities.add(lineEntity);


}


// 2020-12-21 粉刷匠 添加画图工具中的，添加点线面
let handler: any = null;
export const addCustomGeometry = (viewer: any, type: string) => {
    if (!viewer) return;
    if (type === "Point") {
        addPoint(viewer, handler);
    } else if (type === "Polyline") {
        addPolyline(viewer, handler);
    } else if (type === "Polygon") {
        addPolygon(viewer, handler);
    }
}

// 添加点标注
const addPoint = (viewer: any, handler: any) => {
    // 移除双击事件,清除不该有的东西
    if (!viewer) return;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    if (handler) { handler && handler.destroy(); }

    let positions: any = [];
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);

    // 注册鼠标左击事件
    handler.setInputAction((movement: any) => {
        let ray = viewer.camera.getPickRay(movement.position);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        positions.push(cartesian);

        viewer.entities.add({
            name: '空间直线距离',
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
            },
            label: {
                text: "Point" + positions.length,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((movement: any) => {
        handler && handler.destroy();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

// 添加线
const addPolyline = (viewer: any, handler: any) => {
    // 移除双击事件,清除不该有的东西
    if (!viewer) return;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    if (handler) { handler && handler.destroy(); }

    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    let positions: any = [];
    let poly: any = null;
    let cartesian: any = null;
    let floatingPoint: any = null;
    if (floatingPoint) {
        // 
    }

    // 注册鼠标移动事件 
    handler.setInputAction((movement: any) => {
        // 获取地面点的方法有很多，这是很幸运的一个
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
                poly = new PolyLinePrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 注册鼠标左击事件
    handler.setInputAction((movement: any) => {
        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        floatingPoint = viewer.entities.add({
            name: '空间直线距离',
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击--取消操作
    handler.setInputAction((movement: any) => {
        handler && handler.destroy();
        positions.pop(); // 最后一个点无效
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


    const PolyLinePrimitive: any = (function () {
        function _(this: any, positions: any) {
            this.options = {
                name: '直线',
                polyline: {
                    show: true,
                    positions: [],
                    material: Cesium.Color.CHARTREUSE,
                    width: 10,
                    clampToGround: true
                }
            };
            this.positions = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.positions;
            };
            //实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
            viewer.entities.add(this.options);
        };

        return _;
    })();

}

// 添加面
const addPolygon = (viewer: any, handler: any) => {
    // 移除双击事件,清除不该有的东西
    if (!viewer) return;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    if (handler) { handler && handler.destroy(); }

    // 鼠标事件
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    let positions: any = [];
    let tempPoints: any = [];
    let polygon: any = null;
    let cartesian: any = null;
    let floatingPoint: any = []; // 浮动点
    if (floatingPoint) {
        // 
    }

    // 注册鼠标移动事件
    handler.setInputAction((movement: any) => {
        // 获取地面点的方法有很多，这是很幸运的一个
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length >= 2) {
            if (!Cesium.defined(polygon)) {
                polygon = new PolygonPrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


    // 注册鼠标左击效果
    handler.setInputAction(function (movement: any) {

        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        //在三维场景中添加点
        let cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        let heightString = cartographic.height;
        tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
        floatingPoint = viewer.entities.add({
            name: '多边形面积',
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击效果
    handler.setInputAction(function (movement: any) {
        handler.destroy();
        positions.pop();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    const PolygonPrimitive: any = (function () {
        function _(this: any, positions: any) {
            this.options = {
                name: '多边形',
                polygon: {
                    hierarchy: [],
                    material: Cesium.Color.GREEN.withAlpha(0.5),
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
            viewer.entities.add(this.options);
        };

        return _;
    })();

}


// 添加测距 or 测量面积
export const addMeasureTool = (viewer: any, type: any) => {
    if (!viewer) return;
    if (handler) { handler && handler.destroy(); }

    if (type === "distance") {
        measureLineSpace(viewer, handler);
    } else if (type === "area") {
        measureAreaSpace(viewer, handler);
    }

}



// 测量空间直线距离
export const measureLineSpace = (viewer: any, handler: any) => {

    // 移除双击事件,清除不该有的东西
    if (!viewer) return;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    if (handler) { handler && handler.destroy(); }

    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    let positions: any = [];
    let poly: any = null;
    let distance: any = 0;
    let cartesian: any = null;
    let floatingPoint: any = null;
    if (floatingPoint) {
        // 
    }

    // 注册鼠标移动事件 
    handler.setInputAction((movement: any) => {

        // 获取地面点的方法有很多，这是很幸运的一个
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
                poly = new PolyLinePrimitive(positions);
            } else {
                positions.pop();
                // cartesian.y += (1 + Math.random());
                positions.push(cartesian);
            }
            distance = getSpaceDistance(positions);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 注册鼠标左击事件
    handler.setInputAction((movement: any) => {
        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        let textDisance = distance + "米";
        floatingPoint = viewer.entities.add({
            name: '空间直线距离',
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
            },
            label: {
                text: textDisance,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击--取消操作
    handler.setInputAction((movement: any) => {
        handler.destroy(); //关闭事件句柄
        positions.pop(); //最后一个点无效

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


    const PolyLinePrimitive: any = (function () {
        function _(this: any, positions: any) {
            this.options = {
                name: '直线',
                polyline: {
                    show: true,
                    positions: [],
                    material: Cesium.Color.CHARTREUSE,
                    width: 10,
                    clampToGround: true
                }
            };
            this.positions = positions;
            this._init();
        }

        _.prototype._init = function () {
            var _self = this;
            var _update = function () {
                return _self.positions;
            };
            //实时更新polyline.positions
            this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
            viewer.entities.add(this.options);
        };

        return _;
    })();

    //空间两点距离计算函数
    function getSpaceDistance(positions: any) {
        let distance = 0;
        for (let i = 0; i < positions.length - 1; i++) {

            const point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            const point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
            /**根据经纬度计算出距离**/
            const geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            let s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
            distance = distance + s;
        }
        return distance.toFixed(2);
    }
}

// 测量空间面积 
export const measureAreaSpace = (viewer: any, handler: any) => {
    // 移除双击事件,清除不该有的东西
    if (!viewer) return;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    if (handler) { handler && handler.destroy(); }

    // 鼠标事件
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    let positions: any = [];
    let tempPoints: any = [];
    let polygon: any = null;
    let cartesian: any = null;
    let floatingPoint: any = []; // 浮动点
    if (floatingPoint) {
        // 
    }

    // 注册鼠标移动事件
    handler.setInputAction((movement: any) => {
        // 获取地面点的方法有很多，这是很幸运的一个
        let ray = viewer.camera.getPickRay(movement.endPosition);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length >= 2) {
            if (!Cesium.defined(polygon)) {
                polygon = new PolygonPrimitive(positions);
            } else {
                positions.pop();
                positions.push(cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


    // 注册鼠标左击效果
    handler.setInputAction(function (movement: any) {

        let ray = viewer.camera.getPickRay(movement.position);
        cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (positions.length === 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        //在三维场景中添加点
        let cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
        let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        let heightString = cartographic.height;
        tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString });
        floatingPoint = viewer.entities.add({
            name: '多边形面积',
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右击效果
    handler.setInputAction(function (movement: any) {
        handler.destroy();
        positions.pop();
        const textArea = getArea(tempPoints) + "平方公里";
        viewer.entities.add({
            name: '多边形面积',
            position: positions[positions.length - 1],
            label: {
                text: textArea,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -40),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    let radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
    let degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度

    // 计算多边形面积
    function getArea(points: any) {

        let res = 0;
        //拆分三角曲面

        for (let i = 0; i < points.length - 2; i++) {
            let j = (i + 1) % points.length;
            let k = (i + 2) % points.length;
            let totalAngle = Angle(points[i], points[j], points[k]);


            let dis_temp1 = distance(positions[i], positions[j]);
            let dis_temp2 = distance(positions[j], positions[k]);
            res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
            console.log(res);
        }


        return (res / 1000000.0).toFixed(4);
    }

    /* 角度 */
    function Angle(p1: any, p2: any, p3: any) {
        let bearing21 = Bearing(p2, p1);
        let bearing23 = Bearing(p2, p3);
        let angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }
    /* 方向 */
    function Bearing(from: any, to: any) {
        let lat1 = from.lat * radiansPerDegree;
        let lon1 = from.lon * radiansPerDegree;
        let lat2 = to.lat * radiansPerDegree;
        let lon2 = to.lon * radiansPerDegree;
        let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian;//角度
        return angle;
    }

    const PolygonPrimitive: any = (function () {
        function _(this: any, positions: any) {
            this.options = {
                name: '多边形',
                polygon: {
                    hierarchy: [],
                    material: Cesium.Color.GREEN.withAlpha(0.5),
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
            viewer.entities.add(this.options);
        };

        return _;
    })();



    function distance(point1: any, point2: any) {
        let point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        let point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /** 根据经纬度计算出距离 **/
        let geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        let s = geodesic.surfaceDistance;
        // console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        // 返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        return s;
    }
}


// 获取颜色渐变条带
const getColorRamp = (elevationRamp: any, isTransparent?: boolean) => {
    const ramp = document.createElement('canvas');
    ramp.width = 1;
    ramp.height = 100;
    const ctx: any = ramp.getContext('2d');

    const values = elevationRamp;
    const grd = ctx.createLinearGradient(0, 0, 0, 100);
    grd.addColorStop(values[0], '#000000'); //black
    grd.addColorStop(values[1], '#2747E0'); //blue
    grd.addColorStop(values[2], '#D33B7D'); //pink
    grd.addColorStop(values[3], '#D33038'); //red
    grd.addColorStop(values[4], '#FF9742'); //orange
    // grd.addColorStop(values[5], '#ffd700'); //yellow
    grd.addColorStop(values[5], 'transparent'); //yellow
    grd.addColorStop(values[6], '#ffffff'); //white

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1, 100);
    return ramp;
}


// 调整位置，贴地
export const makeModelBaseLand = (tileset: any) => {
    // 创建平移矩阵
    const transition = Cesium.Cartesian3.fromArray([0, 0, 60]);
    const m = Cesium.Matrix4.fromTranslation(transition);
    tileset._modelMatrix = m;
}

// 调节高度
export const changeHeight = (tileset: any, height: any) => {
    height = Number(height);
    if (isNaN(height)) {
        return;
    }
    const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
    const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}


// 添加webmapTileServiceImageryProvider
export const addWebMapTileService = (viewer: any, url: string) => {
    const shadedRelief1 = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS',
        layer: 'USGSShadedReliefOnly',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'default028mm',
        // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
        maximumLevel: 19,
        credit: new Cesium.Credit('U. S. Geological Survey')
    });
    viewer.imageryLayers.addImageryProvider(shadedRelief1);
}

// 移除imagelayer
export const removeImageryLayer = (viewer: any, layer: any) => {
    if (!viewer || !layer) return
    viewer.imageryLayers.remove(layer);
}


