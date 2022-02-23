import {System} from '../../../node_modules/ecsy/build/ecsy.module.js';
import {CmpObject3D, CmpPosition} from "../../components.js";

class ViewSystem extends System {
    execute(delta, time) {
        this.queries.viewable.results.forEach(entity => {
            const position = entity.getComponent(CmpPosition);
            const view = entity.getComponent(CmpObject3D);
            view.object.position.set(position.x, 0, position.z);
        });
    }
}

ViewSystem.queries = {
    viewable: {
        components: [CmpPosition, CmpObject3D]
    }
}

export {ViewSystem};
