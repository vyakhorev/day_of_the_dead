import { System } from "ecsy";
import { CmpAnimationMixer } from "../../components.js";

class AnimationSystem extends System {
    execute(delta, time) {
        this.queries.viewable.results.forEach(entity => {
            const an_cmp = entity.getMutableComponent(CmpAnimationMixer);
            an_cmp.mixer_link.update(delta);
            // an_cmp.action
        });

        // if (this.isReady && this.player.mixer !== undefined) {
        //     this.player.mixer.update(dt);
        //     this.uniforms.playerPos.value.x = +this.player.object.position.x.toFixed(1);
        //     this.uniforms.playerPos.value.y = +this.player.object.position.y.toFixed(1);
        //     this.uniforms.playerPos.value.z = +this.player.object.position.z.toFixed(1);
        
        // }
    }
}

AnimationSystem.queries = {
    viewable: {
        components: [CmpAnimationMixer]
    }
}

export {AnimationSystem};
