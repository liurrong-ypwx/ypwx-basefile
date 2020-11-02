import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import * as THREE from "three";
import "./ThreeJsDemo.less";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function ThreeJsDemo(): JSX.Element {

    const [isSim, setIsSim] = useState(false);

    useEffect(() => {
        setIsSim(false);
        if (isSim) {
            loadThreeJsDemo();
        } else {
            loadThreeJsDemoCom()
        }
        // eslint-disable-next-line
    }, [])

    // 实验1
    const loadThreeJsDemo = () => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xcfcfcf);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        const tmpDoc = document.getElementById("threeJsContainer");
        if (tmpDoc) {
            tmpDoc.appendChild(renderer.domElement);
        }

        // document.body.appendChild(renderer.domElement);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;
        // camera.position.y = 5;
        // camera.position.x = 5;
        camera.lookAt(0, 0, 0);

        const animate = () => {
            requestAnimationFrame(animate);
            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();

    }

    // 实验2
    const loadThreeJsDemoCom = () => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xcfcfcf);

        // 添加光线
        const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
        light.position.set(0, 1, 0);
        scene.add(light);

        // 导入材质
        // const texture =THREE.

        
        

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        const tmpDoc = document.getElementById("threeJsContainer");
        if (tmpDoc) {
            tmpDoc.appendChild(renderer.domElement);
        }

        // document.body.appendChild(renderer.domElement);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);
        console.log(cube);
        
        camera.position.z = 5;
        // camera.position.y = 5;
        // camera.position.x = 5;
        camera.lookAt(0, 0, 0);
        
        let loader = new GLTFLoader();
        loader.load("models/TEST.glb", (gltf: any) => {
            console.log(gltf);
            scene.add(gltf.scene);
        },
        undefined,
            (err: any) => {
                console.error(err)
            })
        // 添加用户交互：鼠标左键按住旋转，右键按住平移，滚轮缩放
        const controls = new OrbitControls(camera, renderer.domElement);
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableDamping = true;
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        //controls.dampingFactor = 0.25;
        //是否可以缩放
        controls.enableZoom = true;
        //是否自动旋转
        controls.autoRotate = false;
        //设置相机距离原点的最远距离
        controls.minDistance = 2;
        //设置相机距离原点的最远距离
        controls.maxDistance = 60;
        //是否开启右键拖拽
        controls.enablePan = true;

        const animate = () => {
            controls.update();
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }


    return (
        <div className="threeJs-wrapper">
            <div id="threeJsContainer" className="threeJs-container" style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, color: "white" }} >test data</div>
            </div>
        </div>
    )
}

export default withRouter(ThreeJsDemo);