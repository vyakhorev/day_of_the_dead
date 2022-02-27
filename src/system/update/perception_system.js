import { System } from "ecsy";
import { CmpWhiskers, CmpPosition, CmpRotation } from "../../components.js";

class PerceptionSystem extends System {
    execute(delta, time) {
        this.queries.viewable.results.forEach(entity => {
            const position = entity.getComponent(CmpPosition);
            const whis = entity.getMutableComponent(CmpWhiskers);
            const rotation = entity.getComponent(CmpRotation);
            if ((Math.abs(position.x) > 3) || (Math.abs(position.z) > 3)) {
                whis.facing_wall = true;
            } else {
                whis.facing_wall = false;
            }
        });
    }
}

PerceptionSystem.queries = {
    viewable: {
        components: [CmpWhiskers, CmpPosition, CmpRotation]
    }
}

export {PerceptionSystem};
