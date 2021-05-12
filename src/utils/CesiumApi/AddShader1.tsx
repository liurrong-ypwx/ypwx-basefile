export const ShaderPlane = (viewer: any, Cesium: any) => {

    //平面的顶点数据
    let points = [
        110.2, 20.0,
        112.2, 20.0,
        110.2, 22.0,
        112.2, 22.0
    ];
    let positions = Cesium.Cartesian3.fromDegreesArray(points);
    //顶点对应的纹理坐标数据
    let sts = [
        0, 0,
        0, 1,
        1, 0,
        1, 1
    ];

    //顶点卷绕的方式
    let positionIndex = [
        0, 1, 2,
        1, 2, 3
    ];


    function createAppearance(vertexShader: any, fragShader: any) {
        return new Cesium.Appearance({
            material: new Cesium.Material({
                fabric: {
                    uniforms: {
                        speed: 0.1
                    },
                    source: getMS()
                }
            }),
            translucent: false,//显示不为半透明
            renderState: {
                blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,//使用Alpha混合功能启用混合
                depthTest: { enabled: true },//深度检测
                depthMask: true,//将深度值写入深度缓冲区
            },
            fragmentShaderSource: fragShader,//片段着色器
            vertexShaderSource: vertexShader//顶点着色器
        });
    }
    //构建几何体
    function createGeometry(positions: any, sts: any, positionIndex: any) {
        return new Cesium.Geometry({
            attributes: {//几何顶点属性
                position: new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.DOUBLE,//数据类型
                    componentsPerAttribute: 3,//定义几个为一组
                    values: positions//坐标值
                }),
                st: new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.FLOAT,//数据类型
                    componentsPerAttribute: 2,//定义几个为一组
                    values: sts//坐标值
                })
            },
            indices: positionIndex,//顶点索引
            primitiveType: Cesium.PrimitiveType.TRIANGLES,//图元类型
            boundingSphere: Cesium.BoundingSphere.fromVertices(positions)//包围球
        });
    }

    function v_shader() {
        return 'attribute vec3 position3DHigh;\n' +
            'attribute vec3 position3DLow;\n' +
            'attribute float batchId;\n' +
            'attribute vec2 st;\n' +
            'varying vec2 v_st;\n' +
            'void main() {\n' +
            '   vec4 position = czm_modelViewProjectionRelativeToEye *czm_computePosition();\n' +
            '   v_st = st;\n' +
            '   gl_Position = position;\n' +
            '}';
    }

    function f_shader() {
        return 'varying vec2 v_st;\n' +
            '//uniform float speed;\n' +
            'void main() {\n' +
            '   vec2 position = -1.0 + 2.0 *v_st;\n' +
            '   float speed = getSpeed();\n' +
            '   float time= czm_frameNumber *speed;\n' +
            '   float r = abs( cos( position.x * position.y + time / 5.0 ));\n' +
            '   float g = abs( sin( position.x * position.y + time / 4.0 ) );\n' +
            '   float b = abs( cos( position.x * position.y + time / 3.0 ) );\n' +
            '   gl_FragColor = vec4( r, g, b, 1.0 );\n' +
            '}\n';
    }

    function getMS() {
        return 'uniform float speed;\n' +
            'float getSpeed(){\n' +
            '   return speed;\n' +
            '}';
    }

    const vertexShader = v_shader();
    const fragShader = f_shader();
    let tempPosition = [];
    for (var i = 0; i < positions.length; i++) {
        tempPosition.push(positions[i].x);
        tempPosition.push(positions[i].y);
        tempPosition.push(positions[i].z);
    }
    positions = new Float64Array(tempPosition);//顶点数据
    let geometry = createGeometry(positions, sts, positionIndex);//几何体
    let appearance = createAppearance(vertexShader, fragShader);//外观
    //primitive方式加载
    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({//渲染的几何体
            geometry: geometry
        }),
        appearance: appearance,//外观
        asynchronous: false
    }));


}


export const test = (viewer: any, Cesium: any) => {
    // 
}