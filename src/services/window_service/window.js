// import * as THREE from "../../../node_modules/three/build/three.module.js"
import * as THREE from "three";

class WindowService {
    constructor(scene_service) {
        this.main_window = window;
        this.scene_service = scene_service;
        this.container = null;
        this.renderer = null;
    }

    getWindowParams() {
        return {innerWidth: this.main_window.innerWidth,
                innerHeight: this.main_window.innerHeight};
    }

    getRendererContainer() {
        return this.renderer.domElement;
    }

    setAnimationLoop(callable) {
        this.renderer.setAnimationLoop(callable);
    }

    render() {
        this.renderer.render(this.scene_service.getScene(),
                             this.scene_service.getCamera());
    }

    setupRenderer(dom_container) {
        this.container = dom_container;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        this.renderer.setSize(this.width, this.height);
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container.appendChild(this.renderer.domElement);

        this.renderer.setClearColor("#201919");

        const camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 100);
        this.scene_service.setCamera(camera);

    }

    onResize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        // this.camera.aspect = this.width / this.height;
        // this.camera.updateProjectionMatrix();
    }

}

export { WindowService };


