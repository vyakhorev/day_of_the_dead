import "./style.css";

import * as THREE from "three";
import { PrefabService } from "./services/prefab_service/prefabs.js";
import { SceneService } from "./services/scene_service/scene.js";
import { WorldService } from "./services/ecs_world_service/world.js";
import { ControlsService } from "./services/controls_service/controls.js";
import { WindowService } from "./services/window_service/window.js";
import { Services } from "./services/serv.js";


export default class App {
    /* Wire up events and embed app into it's container */
    constructor(options) {
        this.app_options = options;
        this.clock = new THREE.Clock();
    }

    runStartupSequence() {
        this.setupServices();
        this.setupRenderer();
        this.setupScene();
        this.subscribeResize();
        this.initCameraControls();
        this.initCharacterControls();
        this.startGameLoop();
    }

    setupServices() {
        // Divide code by services to simplify dependency managment
        this.world_service = new WorldService();
        this.scene_service = new SceneService(this.world_service);
        this.prefab_service = new PrefabService(this.scene_service);
        this.window_service = new WindowService(this.scene_service);
        this.controls_service = new ControlsService(this.scene_service,
                                                    this.window_service);

        // Register in singleton, for in system-invocation, try avoiding such calls
        Services.world_service = this.world_service;
        Services.prefabs_service = this.prefab_service;
        Services.scene_service = this.scene_service;
        Services.controls_service = this.controls_service;
        Services.window_service = this.window_service;
    }

    setupScene() {
        this.scene_service.setupScene();
    }

    setupRenderer() {
        this.window_service.setupRenderer(this.app_options.dom);
    }

    subscribeResize() {
        window.addEventListener("resize", 
            this.window_service.onResize
            .bind(this.window_service));
    }

    initCameraControls() {
    
        this.controls_service
            .initOrbitControls();

        window.addEventListener("mousemove",
            this.controls_service.onMouseMove
            .bind(this.controls_service));

    }

    initCharacterControls() {
        window.addEventListener("keydown", 
          this.controls_service.onControlsInputDown
          .bind(this.controls_service));
        window.addEventListener("keyup", 
          this.controls_service.onControlsInputUp
          .bind(this.controls_service));
    }


    startGameLoop() {
        this.clock.start();
        this.window_service.setAnimationLoop(this._updateLoop.bind(this));
    }

    _updateLoop() {
        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.elapsedTime;
        this.world_service.execute(delta, elapsedTime);
        this.window_service.render();
    }

}

var game_app = new App({
    dom: document.getElementById("container"),
});
game_app.runStartupSequence();


