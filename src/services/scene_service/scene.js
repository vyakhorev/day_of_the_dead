// import * as THREE from "../../../node_modules/three/build/three.module.js"
import * as THREE from "three";
import { CmpObject3D, CmpPosition, CmpRotation, CmpVelocity, 
    CmpWhiskers, CmpPlayerInput, CmpTagStaticWall, CmpSingleShaderUniform } from "../../components.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

class SceneService {

    constructor(world_service) {
        this.world_service = world_service;
        this.scene = null;
        this.character_entity = null;
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    setCamera(camera) {
        this.camera = camera;
    }

    getCharacterEntity() {
        return this.character_entity;
    }

    setupScene() {
        
        this.scene = new THREE.Scene();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("draco/");
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.setDRACOLoader(dracoLoader);

        this.player = {};
        this.animations = {};

        this._setupCamera();
        this._setupHelpers();
        this._setupLight();
        this._setupGround();
        this._setupCemetryObjects();
        this._setupGrass();
        this._spawnPlayer();


        this.raycaster = new THREE.Raycaster();
     
    }

    _setupHelpers() {
        const helper = new THREE.AxesHelper(3);
        helper.position.set(-3.5, 0, -3.5);
        this.scene.add(helper);

        const helperG = new THREE.GridHelper(50, 50);
        this.scene.add(helperG);
    }

    _setupCamera() {
        this.cameraDistance = 4;
        this.camera.position.set(22.8, 16.3, 14.7);
        this.camera.rotation.set(-0.84, 0.80, 0.68);
        this.scene.add(this.camera);
    }

    _setupLight() {
        this.scene.fog = new THREE.Fog("#201919", 1, 80);

        const light = new THREE.DirectionalLight( 0xFFFFFF );
        light.position.set(10, 10, 10);
        this.scene.add(light);

    }

    _setupGround() {
        this.gltfLoader.load("ground.glb", gltf => {
            const ground = gltf.scenes[0].children[0];
            ground.scale.set(10, 2, 10);
            console.log(gltf.scenes[0].children[0]);
            this.scene.add(ground);
        });
    }

    _setupCemetryObjects() {
        this.gltfLoader.load("ironFenceBorder.glb", gltf => {
            const ironFence = gltf.scenes[0].children[0];
            ironFence.scale.set(2, 2, 2);
            ironFence.position.z = 19;
            ironFence.position.x = -17;
            this.scene.add(ironFence);
        });

        this.gltfLoader.load("ironFenceBorderColumn.glb", gltf => {
            const ironFence1 = gltf.scenes[0].children[0];
            ironFence1.scale.set(2, 2, 2);
            ironFence1.position.z = 19;
            ironFence1.position.x = -19;
            this.scene.add(ironFence1);

            const ironFence2 = ironFence1.clone();

            ironFence2.position.z = 19;
            ironFence2.position.x = -19;
            this.scene.add(ironFence2);

        });
    }

    _setupGrass() {
        
        this.uniforms = {};
        this.uniforms.time = {value: this.time};
        this.uniforms.playerPos = {value: new THREE.Vector3()};

        const leavesMaterialStandart = new THREE.MeshStandardMaterial({color: 0x52FFA1, side: THREE.DoubleSide});
        leavesMaterialStandart.onBeforeCompile = (shader) => {
            shader.uniforms.time = this.uniforms.time;
            shader.uniforms.playerPos = this.uniforms.playerPos;
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `
                #include <common>
                varying vec2 vUv;
                uniform float time;
                uniform vec3 playerPos;
                `);
            shader.vertexShader = shader.vertexShader.replace(
                '#include <project_vertex>',
                `
                vUv = uv;

                vec4 mvPosition = vec4( position, 1.0 );
                #ifdef USE_INSTANCING
                    mvPosition = instanceMatrix * mvPosition;
                #endif

                float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );

                float z = 1.0;
                float t = 1.0;
                if (abs(mvPosition.x - playerPos.x) <= 0.5 && abs(mvPosition.z - playerPos.z) <= 0.5) {
                    z = 5.0;
                    t = 0.0;
                    mvPosition.y *= 0.5;
                }
                float displacement = sin( mvPosition.z + time * t ) * ( 0.1 * dispPower );
                mvPosition.z += displacement * z;

                mvPosition = modelViewMatrix * mvPosition;
                gl_Position = projectionMatrix * mvPosition;
                
                `);
        }

        const dummy = new THREE.Object3D();
        const instanceNumber = 9000;
        const geometry = new THREE.PlaneGeometry(0.06, 0.7, 1, 4);
        geometry.translate(0, 0.35, 0);

        const instancedMesh = new THREE.InstancedMesh(geometry, leavesMaterialStandart, instanceNumber);
        this.scene.add(instancedMesh);
        for (let i = 0; i < instanceNumber; i++) {
            dummy.position.set(
                +((Math.random() - 0.5) * 40).toFixed(1) - 0.03,
                0,
                +((Math.random() - 0.5) * 40).toFixed(1) - 0.03
            );
            dummy.scale.setScalar(0.5 + Math.random() * 0.5);
            dummy.rotation.y = Math.random() * Math.PI;
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }

        this.shader_uniform_entity = this.world_service.getWorld().createEntity();
        this.shader_uniform_entity.addComponent(CmpSingleShaderUniform, {uniform_link: this.uniforms})
                             

    }

    _spawnPlayer() {
        this.gltfLoader.load("idle.glb", gltf => {
            const mixer = new THREE.AnimationMixer(gltf.scene.children[0]);

            const back = new THREE.Object3D();
            back.position.set(0, 3, -3);
            // back.parent = player.object;
            this.player.cameras = {back};
            
        
            this.player.speed = 2;
            this.player.mixer = mixer;
            this.player.root = mixer.getRoot();
            this.player.object = new THREE.Object3D();
            // this.player.object.position.z = -5;
            this.scene.add(this.player.object);
            this.player.object.add(gltf.scene.children[0]);
            
            this.animations.idle = gltf.animations[0];
            this.player.cameras.back.parent = this.player.object;
        
            this.gltfLoader.load("walking.glb", gltf => {
                this.animations.walking = gltf.animations[0];
            })
            this.gltfLoader.load("walking_back.glb", gltf => {
                this.animations.walking_back = gltf.animations[0];
            })
            this.gltfLoader.load("running.glb", gltf => {
                this.animations.running = gltf.animations[0];
            })
            this.gltfLoader.load("turn_left.glb", gltf => {
                this.animations.turn_left = gltf.animations[0];
            })
            this.gltfLoader.load("turn_right.glb", gltf => {
                this.animations.turn_right = gltf.animations[0];
            })
        
            const action = this.player.mixer.clipAction(this.animations.idle);
            action.time = 0;
            this.player.mixer.stopAllAction();
            this.player.action = "idle";
            this.player.actionTime = Date.now();

            // action.fadeIn(0.5);	
            action.play();
        
            this.isReady = true;
            this.camera.lookAt(this.player.object.position);
        });
    }


    // setupScene() {
        
    //     this.three_scene = new THREE.Scene();

    //     this._initCamera();

    //     const helper = new THREE.AxesHelper(3);
    //     helper.position.set(-3.5, 0, -3.5);
    //     this.three_scene.add(helper);

    //     const helperG = new THREE.GridHelper(20);
    //     this.three_scene.add(helperG);

    //     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    //     directionalLight.position.set(10, 10, 10);
    //     this.three_scene.add(directionalLight);

    //     const ambientLight = new THREE.AmbientLight(0x404040, 2);
    //     this.three_scene.add(ambientLight);

    //     this.raycaster = new THREE.Raycaster();

    //     let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    //     let material = new THREE.MeshStandardMaterial({color: "green", flatShading: true});       
    //     let mesh_view = new THREE.Mesh( geometry, material );
    //     this.three_scene.add(mesh_view);

    //     let entity = this.world_service.getWorld().createEntity();
    //     entity.addComponent(CmpObject3D, {object: mesh_view})
    //           .addComponent(CmpPosition, {x: 0, z: 0})
    //           .addComponent(CmpVelocity, {x: 1.5, z: 1.5})
    //           .addComponent(CmpRotation, {around_y: 0})
    //           .addComponent(CmpWhiskers, {facing_wall: false});

    //     geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    //     material = new THREE.MeshStandardMaterial({color: "red", flatShading: true});       
    //     mesh_view = new THREE.Mesh( geometry, material );
    //     this.three_scene.add(mesh_view);

    //     entity = this.world_service.getWorld().createEntity();
    //     entity.addComponent(CmpObject3D, {object: mesh_view})
    //           .addComponent(CmpPosition, {x: 1, z: 1})
    //           .addComponent(CmpVelocity, {x: -1.5, z: -1.5})
    //           .addComponent(CmpRotation, {around_y: 0})
    //           .addComponent(CmpWhiskers, {facing_wall: false});

    //     geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    //     material = new THREE.MeshStandardMaterial({color: "yellow", flatShading: true});       
    //     mesh_view = new THREE.Mesh( geometry, material );
    //     this.three_scene.add(mesh_view);

    //     this.character_entity = this.world_service.getWorld().createEntity();
    //     this.character_entity.addComponent(CmpObject3D, {object: mesh_view})
    //                          .addComponent(CmpPosition, {x: 2, z: 2})
    //                          .addComponent(CmpVelocity, {x: 0, z: 0})
    //                          .addComponent(CmpPlayerInput, {x: 0, z: 0});
    // }

}

export { SceneService };
