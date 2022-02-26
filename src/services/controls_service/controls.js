import * as THREE from "../../../node_modules/three/build/three.module.js"

import { CmpPlayerInput } from "../../components.js";
import { OrbitControls } from "./OrbitControls.js"

class ControlsService {

    constructor(scene_service, window_service) {
        this.scene_service = scene_service;
        this.orbit_controls = null;
        this._WASD = [87, 83, 68, 65];
        this.mouse = new THREE.Vector2();
        this.window_service = window_service
    }

    initOrbitControls() {
        const camera = this.scene_service.getCamera();
        const dom_element = this.window_service.getRendererContainer();
        this.orbit_controls = new OrbitControls(camera, dom_element);
    }

    onMouseMove(event) {         
        const window_params = this.window_service.getWindowParams();
        this.mouse.x = (event.clientX / window_params.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window_params.innerHeight) * 2 + 1;
    }

    onControlsInputDown(event) {
        if (this._WASD.includes(event.keyCode)){
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

    onControlsInputUp(event) {
        if (this._WASD.includes(event.keyCode)){
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

export { ControlsService };
