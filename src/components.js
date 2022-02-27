// import {Component, TagComponent, Types} from './../node_modules/ecsy/build/ecsy.module.js';
import { Component, TagComponent, Types } from 'ecsy';

class CmpVelocity extends Component {}

CmpVelocity.schema = {
    x: { type: Types.Number },
    z: { type: Types.Number }
};

class CmpRotation extends Component {}

CmpRotation.schema = {
    around_y: { type: Types.Number }
};

class CmpPosition extends Component {}

CmpPosition.schema = {
    x: { type: Types.Number },
    z: { type: Types.Number }
};

class CmpObject3D extends Component {}

CmpObject3D.schema = {
    object: { type: Types.Ref }
};

class CmpWhiskers extends Component {}

CmpWhiskers.schema = {
    facing_wall: { type: Types.Boolean }
};

class CmpPlayerInput extends Component {}

CmpPlayerInput.schema = {
    x: { type: Types.Number },
    z: { type: Types.Number }
};

class CmpTagStaticWall extends TagComponent {};

class CmpSingleShaderUniform extends Component {}

CmpSingleShaderUniform.schema = {
    uniform_link: { type: Types.Ref }
};

class CmpAnimationMixer extends Component {}

CmpAnimationMixer.schema = {
    mixer_link: { type: Types.Ref },
    action_id: {type: Types.String }
};

export {CmpVelocity, CmpPosition, CmpObject3D, CmpWhiskers, 
    CmpRotation, CmpPlayerInput, CmpTagStaticWall, CmpSingleShaderUniform,
    CmpAnimationMixer};

