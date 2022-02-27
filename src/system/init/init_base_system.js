// import {System} from '../../../node_modules/ecsy/build/ecsy.module.js';
import { System } from "ecsy";

class InitSystem extends System {
    execute(delta, time) {
        this.onInit();
        this.stop();
    }

    onInit() {
        
    }
}

export {InitSystem};
