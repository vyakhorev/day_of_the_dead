import { System } from "ecsy";
import { CmpVelocity, CmpPosition, CmpWhiskers } from "../../components.js";

class MoveSystem extends System {
    execute(delta, time) {
        // Iterate through all the entities on the query
        this.queries.moving.results.forEach(entity => {
            const velocity = entity.getComponent(CmpVelocity);
            const position = entity.getMutableComponent(CmpPosition);
            position.x += velocity.x * delta;
            position.z += velocity.z * delta;
        });
    }
}

MoveSystem.queries = {
    moving: {
        components: [CmpVelocity, CmpPosition]
    }
}

export {MoveSystem};
