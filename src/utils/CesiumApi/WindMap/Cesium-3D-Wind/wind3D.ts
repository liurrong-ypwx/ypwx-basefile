import * as Cesium from 'cesium';
import { DataProcess } from './dataProcess';
import { ParticleSystem } from './particleSystem';
import { Util } from "./util"

const defaultPannelInfo = {
    particlesTextureSize: 64,
    // globeLayer: this.globeLayer,
    // WMS_URL: this.WMS_URL,
    maxParticles: 64 * 64,
    particleHeight: 100.0,
    fadeOpacity: 0.9,
    dropRate: 0.003,
    dropRateBump: 0.01,
    speedFactor: 0.5,
    lineWidth: 4.0
}

export class Wind3D {
    viewer: any;
    scene: any;
    camera: any;
    particleSystem: any;
    viewerParameters: any;
    globeBoundingSphere: any;


    constructor(viewer: any) {
        this.viewer = viewer;
        this.scene = viewer.scene;
        this.camera = viewer.camera;
        this.viewerParameters = {
            lonRange: new Cesium.Cartesian2(),
            latRange: new Cesium.Cartesian2(),
            pixelSize: 0.0
        };

        // use a smaller earth radius to make sure distance to camera > 0
        this.globeBoundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, 0.99 * 6378137.0);
        this.updateViewerParameters();


        DataProcess.loadData().then(
            (data) => {

                // this.addTestPrimitives();

                this.particleSystem = new ParticleSystem(
                    this.scene.context,
                    data,
                    defaultPannelInfo,
                    this.viewerParameters
                );

                // this.testPaticel();

                this.addPrimitives();
                this.setupEventListeners();

            });


    }

    addTestPrimitives() {
        const position = Cesium.Cartesian3.fromDegrees(
            113.91,
            22.50,
            140.0
        );

        this.viewer.entities.add({
            position: position,
            box: {
                dimensions: new Cesium.Cartesian3(400.0, 400.0, 800.0),
                material: Cesium.Color.WHITE.withAlpha(0.3),
                outline: true,
                outlineColor: Cesium.Color.WHITE,
            },
        });
    }

    testPaticel() {
        if (this.particleSystem) {
            console.log('创建成功');
        }
    }


    addPrimitives() {
        // the order of primitives.add() should respect the dependency of primitives
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.calculateSpeed);
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.updatePosition);
        this.scene.primitives.add(this.particleSystem.particlesComputing.primitives.postProcessingPosition);

        this.scene.primitives.add(this.particleSystem.particlesRendering.primitives.segments);
        this.scene.primitives.add(this.particleSystem.particlesRendering.primitives.trails);
        this.scene.primitives.add(this.particleSystem.particlesRendering.primitives.screen);
    }

    updateViewerParameters() {
        let viewRectangle = this.camera.computeViewRectangle(this.scene.globe.ellipsoid);
        let lonLatRange = Util.viewRectangleToLonLatRange(viewRectangle);
        this.viewerParameters.lonRange.x = lonLatRange.lon.min;
        this.viewerParameters.lonRange.y = lonLatRange.lon.max;
        this.viewerParameters.latRange.x = lonLatRange.lat.min;
        this.viewerParameters.latRange.y = lonLatRange.lat.max;

        let pixelSize = this.camera.getPixelSize(
            this.globeBoundingSphere,
            this.scene.drawingBufferWidth,
            this.scene.drawingBufferHeight
        );

        if (pixelSize > 0) {
            this.viewerParameters.pixelSize = pixelSize;
        }
    }

    setupEventListeners() {
        const that = this;

        this.camera.moveStart.addEventListener(function () {
            that.scene.primitives.show = false;
        });

        this.camera.moveEnd.addEventListener(function () {
            that.updateViewerParameters();
            that.particleSystem.applyViewerParameters(that.viewerParameters);
            that.scene.primitives.show = true;
        });

        let resized = false;
        window.addEventListener("resize", function () {
            resized = true;
            that.scene.primitives.show = false;
            that.scene.primitives.removeAll();
        });

        this.scene.preRender.addEventListener(function () {
            if (resized) {
                that.particleSystem.canvasResize(that.scene.context);
                resized = false;
                that.addPrimitives();
                that.scene.primitives.show = true;
            }
        });

    }


}
