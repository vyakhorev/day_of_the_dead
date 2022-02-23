import {System} from '../../../node_modules/ecsy/build/ecsy.module.js';
import {CmpWhiskers, CmpVelocity} from "../../components.js";

class AiSystem extends System {
    execute(delta, time) {
        this.queries.viewable.results.forEach(entity => {
            const vel = entity.getMutableComponent(CmpVelocity);
            const whis = entity.getComponent(CmpWhiskers);
            if (whis.facing_wall) {
                vel.x = Math.random()*10 - 5;
                vel.z = Math.random()*10 - 5;
            };
        });
    }
}

AiSystem.queries = {
    viewable: {
        components: [CmpWhiskers, CmpVelocity]
    }
}

export {AiSystem};
