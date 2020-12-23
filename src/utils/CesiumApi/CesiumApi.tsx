import * as Cesium from 'cesium';
// import moment from "moment";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { flowArray, testFlightData } from '../../pages/CesiumDemo/ChBuild/testData';
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
        baseLayerPicker: false,
        animation: false,
        // creditContainer:"credit",
        // timeline: false,
        fullscreenButton: false,
        vrButton: false,
        selectionIndicator: false,
        infoBox: false,
        // terrainProvider: Cesium.createWorldTerrain()
    })

    // 假如添加建筑物3dtile
    if (isAddBuilding) {

    

        const tmpTileset = new Cesium.Cesium3DTileset({
            url: "./Models/building2/tileset.json"
        })

        // 给建筑物添加shader
        tmpTileset.readyPromise.then(function (tileset) {

            // 摄像机移动到建筑群
            const boundingSphere = tileset.boundingSphere;
            viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0));
            viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);


            tileset.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                        ['true', 'rgba(0, 127.5, 255 ,1)']//'rgb(127, 59, 8)']
                    ]
                }
            });


            tileset.tileVisible.addEventListener(function (tile) {
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
                                "    float glowRange = 360.0;\n" +
                                "    gl_FragColor = " + color + ";\n" +
                                // "    gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0);\n" +
                                "    gl_FragColor *= vec4(vec3(position.z / 100.0), 1.0);\n" +
                                "    float time = fract(czm_frameNumber / 360.0);\n" +
                                "    time = abs(time - 0.5) * 2.0;\n" +
                                "    float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));\n" +
                                "    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);\n" +
                                "}\n"
                        })
                        model._shouldRegenerateShaders = true
                    }
                }
            });
        })



        // 普通款制作专题图的样式
        // tmpTileset.style = new Cesium.Cesium3DTileStyle({
        //     color: {
        //         conditions: [
        //             // eslint-disable-next-line
        //             ['${Height} >= 200', 'color("purple", 0.5)'],
        //             // eslint-disable-next-line
        //             ['${Height} >= 100', 'color("red")'],
        //             ['true', 'color("blue")']
        //         ]
        //     },        
        //     // eslint-disable-next-line
        //     show: '${Height} > 0',
        //     meta: {
        //         // eslint-disable-next-line
        //         description: '"Building id ${id} has height ${Height}."'
        //     }
        // });



        viewer.scene.primitives.add(tmpTileset);
    }

    // addGeometry(viewer, "no", { longitude: 123, latitude: 23, height: 23 });

    // new Cesium.UrlTemplateImageryProvider({
    //     url: '你的照片'
    // })

    // 贴图
    // const nightLayer = viewer.scene.imageryLayers.addImageryProvider(
    //     new Cesium.SingleTileImageryProvider({
    //         url: './Models/image/night2012.jpg'
    //     })
    // )




    if (!isAddBuilding) {

        // 添加测试蓝色的底图
        addTestDarkImg(viewer);

        // 缩放到深圳
        setExtent(viewer);

        // 添加测试南山区建筑3dtile数据
        addTestBlueBuilding(viewer);

        // 添加Geojson数据
        addGeoJsonData(viewer);

        // 添加测试道路数据
        addTestRroadGeoJsonData(viewer);

        // 添加一个glb模型
        addTestGlbLabel(viewer);

        // 添加测试标注的立方体---透明png
        addTestBox(viewer);

        // 添加蓝色的泛光线
        addTestBlueLine(viewer);

        // 添加流动的线
        // addTestFlowLine(viewer);

        // 雷达圆扩散图
        showCircleScan(viewer);

        // 雷达圆扫描图
        showRadarScan(viewer);

    }

    return viewer;
}

// =================================这是示例区域========================
const addTestDarkImg = (viewer: any) => {
    // 添加一个蓝色底图来加强图像的展示
    viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
            url: './Models/image/dark.png'
        })
    )
}

const addTestBlueLine = (viewer: any) => {
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

// const addTestFlowLine = (viewer: any) => {
//     const orgArr = flowArray;
//     for (let i = 0; i < orgArr.length; i++) {
//         const tmpSigLine = orgArr[i];
//         const tmpArr: any = [];
//         for (let j = 0; j < tmpSigLine.length; j++) {
//             if (tmpSigLine[j][0] && tmpSigLine[j][1]) {
//                 tmpArr.push(tmpSigLine[j][0]);
//                 tmpArr.push(tmpSigLine[j][1]);
//             }
//         }
//         addFlowLine(viewer, tmpArr);
//     }
// }

// 添加一个旋转的圆圈
const addTestBox = (viewer: any) => {

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

const addTestBlueBuilding = (viewer: any) => {

    const tmpTileset = new Cesium.Cesium3DTileset({
        url: "./Models/building3/tileset.json"
    }) 

    // 给建筑物添加shader
    tmpTileset.readyPromise.then(function (tileset) {

        tileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ['true', 'rgba(0, 127.5, 255 ,1)']//'rgb(127, 59, 8)']
                ]
            }
        });

        tileset.tileVisible.addEventListener(function (tile) {
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
    })

    viewer.scene.primitives.add(tmpTileset);
}

const addTestGlbLabel = (viewer: any) => {
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

export const addTestRroadGeoJsonData = (viewer: any) => {
    viewer.dataSources.add(Cesium.GeoJsonDataSource.load('./Models/json/line.json', {
        clampToGround: true,
        stroke: Cesium.Color.CHOCOLATE,
        strokeWidth: 1,
        markerSymbol: '?'
    }));
}

// showCircleScan() // 圆扩散
export const showCircleScan = (viewer: any) => {
    const cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(113.9), Cesium.Math.toRadians(22.51), 320);
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
function addCircleScanPostStage(viewer:any, cartographicCenter:any, maxRadius:any, scanColor:any, duration:any) {
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
function addRadarScanPostStage(viewer:any, cartographicCenter:any, radius:any, scanColor:any, duration:any) {
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
    viewer.camera.setView({
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
            width: 20,
            // 发光纹理
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: Cesium.Color.BLUE.withAlpha(0.7),
            })
        }
    })

    viewer.entities.add(lineEntity);
}

// 添加流动的线
// export const addFlowLine = (viewer: any, lineArr: any) => {
//     if (!viewer) return;

//     viewer.entities.add({
//         polyline: {
//             positions: Cesium.Cartesian3.fromDegreesArray(lineArr),
//             width: 6,
//             // 流动纹理
//             material: new Cesium.PolylineTrailLinkMaterialProperty({
//                 color: Cesium.Color.CRIMSON,
//                 duration: 5000,
//                 d: 1
//             })
//         }
//     });
// }


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

    // viewer.camera.lookAt(
    //     Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0),
    //     new Cesium.Cartesian3(5000.0, 5000.0, 5000.0)
    // );
    // viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    let drawingMode = type;
    let activeShapePoints: any = [];
    let activeShape: any = null;
    let floatingPoint: any = null;

    // 检查是否支持选点
    if (!viewer.scene.pickPositionSupported) {
        window.alert("This browser does not support pickPosition.");
        return;
    }
    // 检查是否支持polyline
    if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
        window.alert("This browser does not support polylines on terrain.");
        return;
    }

    // 移除双击事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    if (handler) {
        handler && handler.destroy();
    }

    // 添加新的处理函数
    handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function (event: any) {
        // 使用 `viewer.scene.pickPosition` 而不是 `viewer.camera.pickEllipsoid` 为了 get correct cord over terrien
        const earthPosition = viewer.scene.pickPosition(event.position);
        // `earthPosition` will be undefined 假如你瞎**点到外太空
        if (Cesium.defined(earthPosition)) {
            if (activeShapePoints.length === 0) {
                floatingPoint = createPoint(earthPosition);
                activeShapePoints.push(earthPosition);
                const dynamicPositions = new Cesium.CallbackProperty(function () {
                    if (drawingMode === "Polygon") {
                        return new Cesium.PolygonHierarchy(activeShapePoints);
                    }
                    return activeShapePoints;
                }, false);
                activeShape = drawShape(dynamicPositions);
            }
            activeShapePoints.push(earthPosition);
            createPoint(earthPosition);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (event: any) {
        if (Cesium.defined(floatingPoint)) {
            const newPosition = viewer.scene.pickPosition(event.endPosition);
            if (Cesium.defined(newPosition)) {
                floatingPoint.position.setValue(newPosition);
                activeShapePoints.pop();
                activeShapePoints.push(newPosition);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Redraw the shape so it's not dynamic and remove the dynamic shape.
    function terminateShape() {
        activeShapePoints.pop();
        drawShape(activeShapePoints);
        viewer.entities.remove(floatingPoint);
        viewer.entities.remove(activeShape);
        floatingPoint = undefined;
        activeShape = undefined;
        activeShapePoints = [];
    }

    handler.setInputAction(function (event: any) {
        terminateShape();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);




    function createPoint(worldPosition: any) {
        const point = viewer.entities.add({
            position: worldPosition,
            point: {
                color: Cesium.Color.WHITE,
                pixelSize: 5,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
        });
        return point;
    }

    function drawShape(positionData: any) {
        let shape: any;
        if (drawingMode === "Polyline") {
            shape = viewer.entities.add({
                polyline: {
                    positions: positionData,
                    clampToGround: true,
                    width: 3,
                },
            });
        } else if (drawingMode === "Polygon") {
            shape = viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(
                        Cesium.Color.WHITE.withAlpha(0.7)
                    ),
                },
            });
        }
        return shape;
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
