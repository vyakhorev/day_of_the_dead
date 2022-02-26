import {System} from '../../../node_modules/ecsy/build/ecsy.module.js';

class InitSystem extends System {
    execute(delta, time) {
        this.onInit();
        this.stop();
    }

    onInit() {
        
    }
}

export {InitSystem};
