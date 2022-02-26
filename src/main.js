
import * as THREE from "../node_modules/three/build/three.module.js"
import { OrbitControls } from "./services/controls/OrbitControls.js"
import { World } from '../node_modules/ecsy/build/ecsy.module.js';
import { CmpObject3D, CmpPosition, CmpRotation, CmpVelocity, CmpWhiskers, CmpPlayerInput, CmpTagStaticWall } from "./components.js";
import { ViewSystem } from "./system/update/view_system.js";
import { MoveSystem } from "./system/update/move_system.js";
import { PerceptionSystem } from "./system/update/perception_system.js";
import { AiSystem } from "./system/update/ai_system.js";
import { CharMoveSystem } from "./system/update/char_move_system.js";
import { WallInitSystem } from "./system/init/wall_init_system.js";
import { Services } from "./services/serv.js"
import { PrefabService } from "./services/prefab_service/prefabs.js"
import { SceneService } from "./services/scene_service/scene.js"


export default class App {
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
        
        this.world = new World();
        this.world
            .registerComponent(CmpTagStaticWall)
            .registerComponent(CmpObject3D)
            .registerComponent(CmpPosition)
            .registerComponent(CmpVelocity)
            .registerComponent(CmpRotation)
            .registerComponent(CmpWhiskers)
            .registerComponent(CmpPlayerInput);

        this.world
            .registerSystem(WallInitSystem)
            .registerSystem(MoveSystem)
            .registerSystem(ViewSystem)
            .registerSystem(PerceptionSystem)
            .registerSystem(AiSystem)
            .registerSystem(CharMoveSystem);
            

        this.clock = new THREE.Clock();
    }

    initCameraControls() {
        this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        this.cameraDistance = 5;
        this.camera.position.set(22.8, 16.3, 14.7);
        this.camera.rotation.set(-0.84, 0.80, 0.68);
        this.scene.add(this.camera);
        

        this.mouse = new THREE.Vector2();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        window.addEventListener("mousemove", e => {
            
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	        this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

        });
    }

    setupServices() {
        SceneService.init();
        Services.setSceneService(SceneService);
        PrefabService.init(SceneService);
        Services.setPrefabService(PrefabService);
    }

    setupScene() {
        
        const scene_service = Services.getSceneService();

        this.scene = scene_service.three_scene;

        const helper = new THREE.AxesHelper(3);
        helper.position.set(-3.5, 0, -3.5);
        this.scene.add(helper);

        const helperG = new THREE.GridHelper(20);
        this.scene.add(helperG);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        this.raycaster = new THREE.Raycaster();

        let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        let material = new THREE.MeshStandardMaterial({color: "green", flatShading: true});       
        let mesh_view = new THREE.Mesh( geometry, material );
        this.scene.add(mesh_view);

        let entity = this.world.createEntity();
        entity.addComponent(CmpObject3D, {object: mesh_view})
              .addComponent(CmpPosition, {x: 0, z: 0})
              .addComponent(CmpVelocity, {x: 1.5, z: 1.5})
              .addComponent(CmpRotation, {around_y: 0})
              .addComponent(CmpWhiskers, {facing_wall: false});

        geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        material = new THREE.MeshStandardMaterial({color: "red", flatShading: true});       
        mesh_view = new THREE.Mesh( geometry, material );
        this.scene.add(mesh_view);

        entity = this.world.createEntity();
        entity.addComponent(CmpObject3D, {object: mesh_view})
              .addComponent(CmpPosition, {x: 1, z: 1})
              .addComponent(CmpVelocity, {x: -1.5, z: -1.5})
              .addComponent(CmpRotation, {around_y: 0})
              .addComponent(CmpWhiskers, {facing_wall: false});

        geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        material = new THREE.MeshStandardMaterial({color: "yellow", flatShading: true});       
        mesh_view = new THREE.Mesh( geometry, material );
        this.scene.add(mesh_view);

        this.character_entity = this.world.createEntity();
        this.character_entity.addComponent(CmpObject3D, {object: mesh_view})
                             .addComponent(CmpPosition, {x: 2, z: 2})
                             .addComponent(CmpVelocity, {x: 0, z: 0})
                             .addComponent(CmpPlayerInput, {x: 0, z: 0});

    }

    startGameLoop() {
        this.clock.start();
        this.renderer.setAnimationLoop(this._updateLoop.bind(this));
    }


    _updateLoop() {
        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.elapsedTime;
        this.world.execute(delta, elapsedTime);
        this.renderer.render(this.scene, this.camera);
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
            const player_input = this.character_entity.getMutableComponent(CmpPlayerInput);

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
            const player_input = this.character_entity.getMutableComponent(CmpPlayerInput);

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

