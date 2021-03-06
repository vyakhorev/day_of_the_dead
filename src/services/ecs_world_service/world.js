// import { World } from '../../../node_modules/ecsy/build/ecsy.module.js';
import { World } from "ecsy";
import { CmpObject3D, CmpPosition, CmpRotation, CmpVelocity, CmpWhiskers, 
    CmpPlayerInput, CmpTagStaticWall, CmpSingleShaderUniform, CmpAnimationMixer } from "../../components.js";
import { ViewSystem } from "../../system/update/view_system.js";
import { MoveSystem } from "../../system/update/move_system.js";
import { PerceptionSystem } from "../../system/update/perception_system.js";
import { AiSystem } from "../../system/update/ai_system.js";
import { CharMoveSystem } from "../../system/update/char_move_system.js";
import { WallInitSystem } from "../../system/init/wall_init_system.js";
import { ShaderUniformSystem } from "../../system/update/shader_uniform_system.js";
import { AnimationSystem } from "../../system/update/animation_system.js";


class WorldService {

    constructor() {
        this.world = new World();
        this.world
            .registerComponent(CmpTagStaticWall)
            .registerComponent(CmpObject3D)
            .registerComponent(CmpPosition)
            .registerComponent(CmpVelocity)
            .registerComponent(CmpRotation)
            .registerComponent(CmpWhiskers)
            .registerComponent(CmpPlayerInput)
            .registerComponent(CmpSingleShaderUniform)
            .registerComponent(CmpAnimationMixer);

        this.world
            .registerSystem(WallInitSystem)
            .registerSystem(MoveSystem)
            .registerSystem(ViewSystem)
            .registerSystem(PerceptionSystem)
            .registerSystem(AiSystem)
            .registerSystem(CharMoveSystem)
            .registerSystem(ShaderUniformSystem)
            .registerSystem(AnimationSystem);
    }

    getWorld() {
        return this.world;
    }

    execute(delta, elapsedTime) {
        this.world.execute(delta, elapsedTime);
    }

}

export { WorldService };
