import * as THREE from "../node_modules/three/build/three.module.js"


import { PrefabService } from "./services/prefab_service/prefabs.js"
import { SceneService } from "./services/scene_service/scene.js"
import { WorldService } from "./services/ecs_world_service/world.js"
import { ControlsService } from "./services/controls_service/controls.js"
import { WindowService } from "./services/window_service/window.js"
import { Services } from "./services/serv.js"


export default class App {
    /* Wire up events and embed app into it's container */
    constructor(options) {
        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        this.renderer.setSize(this.width, this.height);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);
    }

    initWorld() {
        this.clock = new THREE.Clock();
    }

    setupServices() {
        // Divide code by services to simplify dependency managment
        this.world_service = new WorldService();
        this.scene_service = new SceneService(this.world_service);
        this.prefab_service = new PrefabService(this.scene_service);
        this.window_service = new WindowService(window);
        this.controls_service = new ControlsService(this.scene_service,
                                                    this.window_service);
        // Register in singleton, for in system-invocation
        Services.world_service = this.world_service;
        Services.prefabs_service = this.prefab_service;
        Services.scene_service = this.scene_service;
        Services.controls_service = this.controls_service;
        Services.window_service = this.window_service;
    }

    setupScene() {
        this.scene_service.setupScene();
    }

    startGameLoop() {
        this.clock.start();
        this.renderer.setAnimationLoop(this._updateLoop.bind(this));
    }

    _updateLoop() {
        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.elapsedTime;
        this.world_service.getWorld().execute(delta, elapsedTime);
        this.renderer.render(this.scene_service.getScene(), this.camera);
    }

    subscribeResize() {
        window.addEventListener("resize", this._onResize.bind(this));
    }


    _onResize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    initCharacterControls() {
        window.addEventListener("keydown", 
          this.controls_service.onControlsInputDown
          .bind(this.controls_service));
        window.addEventListener("keyup", 
          this.controls_service.onControlsInputUp
          .bind(this.controls_service));
    }

    initCameraControls() {
        
        this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        this.cameraDistance = 5;
        this.camera.position.set(22.8, 16.3, 14.7);
        this.camera.rotation.set(-0.84, 0.80, 0.68);
        this.scene_service.getScene().add(this.camera);

        this.controls_service
            .initOrbitControls(this.camera,
                               this.renderer.domElement);

        window.addEventListener("mousemove",
            this.controls_service.onMouseMove
            .bind(this.controls_service));

    }

}

var game_app = new App({
    dom: document.getElementById("container"),
});

game_app.setupServices();
game_app.initWorld();
game_app.setupScene();
game_app.subscribeResize();
game_app.initCameraControls();
game_app.initCharacterControls();
game_app.startGameLoop();

