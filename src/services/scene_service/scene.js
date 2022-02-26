import * as THREE from "../../../node_modules/three/build/three.module.js"
import { CmpObject3D, CmpPosition, CmpRotation, CmpVelocity, CmpWhiskers, CmpPlayerInput, CmpTagStaticWall } from "../../components.js";


class SceneService {

    constructor(world_service) {
        this.world_service = world_service;
        this.three_scene = null;
        this.character_entity = null;
    }

    getScene() {
        return this.three_scene;
    }

    getCamera() {
        return this.camera;
    }

    getCharacterEntity() {
        return this.character_entity;
    }

    _initCamera() {
        this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        this.cameraDistance = 5;
        this.camera.position.set(22.8, 16.3, 14.7);
        this.camera.rotation.set(-0.84, 0.80, 0.68);
        this.three_scene.add(this.camera);
    }

    setupScene() {
        
        this.three_scene = new THREE.Scene();

        this._initCamera();

        const helper = new THREE.AxesHelper(3);
        helper.position.set(-3.5, 0, -3.5);
        this.three_scene.add(helper);

        const helperG = new THREE.GridHelper(20);
        this.three_scene.add(helperG);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        this.three_scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.three_scene.add(ambientLight);

        this.raycaster = new THREE.Raycaster();

        let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        let material = new THREE.MeshStandardMaterial({color: "green", flatShading: true});       
        let mesh_view = new THREE.Mesh( geometry, material );
        this.three_scene.add(mesh_view);

        let entity = this.world_service.getWorld().createEntity();
        entity.addComponent(CmpObject3D, {object: mesh_view})
              .addComponent(CmpPosition, {x: 0, z: 0})
              .addComponent(CmpVelocity, {x: 1.5, z: 1.5})
              .addComponent(CmpRotation, {around_y: 0})
              .addComponent(CmpWhiskers, {facing_wall: false});

        geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        material = new THREE.MeshStandardMaterial({color: "red", flatShading: true});       
        mesh_view = new THREE.Mesh( geometry, material );
        this.three_scene.add(mesh_view);

        entity = this.world_service.getWorld().createEntity();
        entity.addComponent(CmpObject3D, {object: mesh_view})
              .addComponent(CmpPosition, {x: 1, z: 1})
              .addComponent(CmpVelocity, {x: -1.5, z: -1.5})
              .addComponent(CmpRotation, {around_y: 0})
              .addComponent(CmpWhiskers, {facing_wall: false});

        geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        material = new THREE.MeshStandardMaterial({color: "yellow", flatShading: true});       
        mesh_view = new THREE.Mesh( geometry, material );
        this.three_scene.add(mesh_view);

        this.character_entity = this.world_service.getWorld().createEntity();
        this.character_entity.addComponent(CmpObject3D, {object: mesh_view})
                             .addComponent(CmpPosition, {x: 2, z: 2})
                             .addComponent(CmpVelocity, {x: 0, z: 0})
                             .addComponent(CmpPlayerInput, {x: 0, z: 0});
    }

}

export { SceneService };
