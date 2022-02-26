import { InitSystem } from "./init_base_system.js";
import { CmpPosition, CmpTagStaticWall, CmpRotation, CmpObject3D} from "../../components.js";
import { createWall } from "../../services/prefab_service/prefabs.js";


class WallInitSystem extends InitSystem {
    onInit() {
        let entity = this.world.createEntity();
        entity.addComponent(CmpObject3D, {object: createWall()})
              .addComponent(CmpPosition, {x: 2, z: 2})
              .addComponent(CmpTagStaticWall)
              .addComponent(CmpRotation, {around_y: 0});

    }
}

export { WallInitSystem };
