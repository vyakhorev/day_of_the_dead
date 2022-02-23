import {System} from '../../../node_modules/ecsy/build/ecsy.module.js';
import {CmpPlayerInput, CmpVelocity} from "../../components.js";

class CharMoveSystem extends System {
    execute(delta, time) {
        this.queries.viewable.results.forEach(entity => {
            const inpt = entity.getComponent(CmpPlayerInput);
            const vel = entity.getMutableComponent(CmpVelocity);
            vel.x = inpt.x;
            vel.z = inpt.z;
        });
    }
}

CharMoveSystem.queries = {
    viewable: {
        components: [CmpPlayerInput, CmpVelocity]
    }
}

export {CharMoveSystem};
