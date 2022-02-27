import { System } from "ecsy";
import { CmpSingleShaderUniform } from "../../components.js";

class ShaderUniformSystem extends System {
    execute(delta, time) {
        this.queries.viewable.results.forEach(entity => {
            const ent = entity.getComponent(CmpSingleShaderUniform);
            ent.uniform_link.time.value = time;
        });
    }
}

ShaderUniformSystem.queries = {
    viewable: {
        components: [CmpSingleShaderUniform]
    }
}

export { ShaderUniformSystem };
