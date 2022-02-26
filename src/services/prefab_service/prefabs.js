import * as THREE from "../../../node_modules/three/build/three.module.js"


class PrefabService {

    constructor(scene_service) {
        this.scene_service = scene_service;
    }

    createWall() {
        const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({color: "indigo", flatShading: true});       
        const mesh_view = new THREE.Mesh( geometry, material );
        this.scene_service.getScene().add(mesh_view);
        return mesh_view
    }

}

export { PrefabService };
