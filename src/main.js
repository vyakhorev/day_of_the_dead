import * as THREE from "../node_modules/three/build/three.module.js"
import { OrbitControls } from "./services/controls/OrbitControls.js"

import { CmpPlayerInput } from "./components.js";
import { PrefabService } from "./services/prefab_service/prefabs.js"
import { SceneService } from "./services/scene_service/scene.js"
import { WorldService } from "./services/ecs_world_service/world.js"
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

    initCameraControls() {
        this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        this.cameraDistance = 5;
        this.camera.position.set(22.8, 16.3, 14.7);
        this.camera.rotation.set(-0.84, 0.80, 0.68);
        this.scene_service.getScene().add(this.camera);

        this.mouse = new THREE.Vector2();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        window.addEventListener("mousemove", e => {
            
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	        this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

        });
    }

    setupServices() {
        // Divide code by services to simplify dependency managment
        this.world_service = new WorldService();
        this.scene_service = new SceneService(this.world_service);
        this.prefab_service = new PrefabService(this.scene_service);
        // Register in singleton, for in system-invocation
        Services.world_service = this.world_service;
        Services.prefabs_service = this.prefab_service;
        Services.scene_service = this.scene_service;
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
        window.addEventListener("keydown", this._onControlsInputDown.bind(this));
        window.addEventListener("keyup", this._onControlsInputUp.bind(this));
    }

    _onControlsInputDown(event) {
        if ([87, 83, 68, 65].includes(event.keyCode)){
            const player_input = this.scene_service.getCharacterEntity().getMutableComponent(CmpPlayerInput);

            if (event.keyCode === 87){
                player_input.z = -1;
            }
            if (event.keyCode === 83){
                player_input.z = 1;
            }

            if (event.keyCode === 68){
                player_input.x = -1;
            }
            if (event.keyCode === 65){
                player_input.x = 1;
            }   
        }
    }

    _onControlsInputUp(event) {
        if ([87, 83, 68, 65].includes(event.keyCode)){
            const player_input = this.scene_service.getCharacterEntity().getMutableComponent(CmpPlayerInput);

            if (event.keyCode === 87){
                player_input.z = 0;
            }
            if (event.keyCode === 83){
                player_input.z = 0;
            }

            if (event.keyCode === 68){
                player_input.x = 0;
            }
            if (event.keyCode === 65){
                player_input.x = 0;
            }   
        }
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

