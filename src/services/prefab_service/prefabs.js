
import * as THREE from "../../../node_modules/three/build/three.module.js"
import { Services } from "../../services/serv.js"


function createWall() {
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({color: "indigo", flatShading: true});       
    const mesh_view = new THREE.Mesh( geometry, material );
    const scene = Services.getSceneService();
    scene.add(mesh_view);
    return mesh_view
}

export { createWall };
