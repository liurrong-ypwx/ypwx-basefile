"use strict";
exports.__esModule = true;
exports.changeHeight = exports.makeModelBaseLand = exports.addGeometry = exports.addBuilding = exports.setExtent = exports.initMap = void 0;
var Cesium = require("cesium");
require("cesium/Build/Cesium/Widgets/widgets.css");
window.CESIUM_BASE_URL = './cesium/';
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTIxYjQ0Yi1kODkwLTQwYTctYTdjNi1hOTkwYTRhYTI2NDEiLCJpZCI6MzY4OTQsImlhdCI6MTYwNDMwMzkzM30.btKZ2YlmB0wCTBvk3ewmGk5MAjS5rwl_Izra03VcrnY';
var locationSZ = { lng: 114.167, lat: 22.67, height: 130000.0 };
// const locationJDY = { lng: 104.06, lat: 30.78, height: 13000.0 };
var location = locationSZ;
// 初始化地图
exports.initMap = function (domID, isAddBuilding) {
    if (!document.getElementById(domID))
        return;
    var viewer = new Cesium.Viewer(domID, {
        geocoder: false,
        homeButton: true,
        sceneModePicker: false,
        baseLayerPicker: false,
        animation: false,
        // creditContainer:"credit",
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        terrainProvider: Cesium.createWorldTerrain()
    });
    if (isAddBuilding) {
        var tmpTileset = new Cesium.Cesium3DTileset({
            url: "./Models/building/tileset.json"
        });
        tmpTileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    // eslint-disable-next-line
                    ['${Height} >= 200', 'color("purple", 0.5)'],
                    // eslint-disable-next-line
                    ['${Height} >= 100', 'color("red")'],
                    ['true', 'color("blue")']
                ]
            },
            // eslint-disable-next-line
            show: '${Height} > 0',
            meta: {
                // eslint-disable-next-line
                description: '"Building id ${id} has height ${Height}."'
            }
        });
        viewer.scene.primitives.add(tmpTileset);
    }
    exports.addGeometry(viewer, "no", { longitude: 123, latitude: 23, height: 23 });
    exports.setExtent(viewer);
    return viewer;
};
// 缩放到指定位置
exports.setExtent = function (viewer) {
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, location.height),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
        }
    });
};
// 添加building
exports.addBuilding = function (viewer, buildingUrl) {
    var entity = viewer.entities.add({
        name: "plane",
        position: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, 1300.0),
        model: {
            uri: "./Models/building.glb"
        }
    });
    //设置摄像头定位到模型处
    viewer.trackedEntity = entity;
};
exports.addGeometry = function (viewer, type, postion) {
    if (!viewer)
        return;
    // 箱子纹理
    var boxEntity = new Cesium.Entity({
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
                transparent: true
            }),
            outline: true,
            outlineColor: Cesium.Color.BLACK
        }
    });
    // 线纹理
    var lineEntity = new Cesium.Entity({
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
    });
    // 贴地线
    viewer.scene.primitives.add(new Cesium.GroundPrimitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.CorridorGeometry({
                vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
                positions: Cesium.Cartesian3.fromDegreesArray([
                    113.91, 22.52,
                    113.904, 22.483
                ]),
                width: 10
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 0.3, 0.9, 0.5))
            }
        }),
        classificationType: Cesium.ClassificationType.TERRAIN
    }));
    // 线纹理
    viewer.entities.add(boxEntity);
    viewer.entities.add(lineEntity);
};
// 获取颜色渐变条带
var getColorRamp = function (elevationRamp, isTransparent) {
    var ramp = document.createElement('canvas');
    ramp.width = 1;
    ramp.height = 100;
    var ctx = ramp.getContext('2d');
    var values = elevationRamp;
    var grd = ctx.createLinearGradient(0, 0, 0, 100);
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
};
// 调整位置，贴地
exports.makeModelBaseLand = function (tileset) {
    // 创建平移矩阵
    var transition = Cesium.Cartesian3.fromArray([0, 0, 60]);
    var m = Cesium.Matrix4.fromTranslation(transition);
    tileset._modelMatrix = m;
};
// 调节高度
exports.changeHeight = function (tileset, height) {
    height = Number(height);
    if (isNaN(height)) {
        return;
    }
    var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
    var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
};
