import { makeId } from '../engine/util';
import { position, utils } from '../engine/components';
import { ENTITIES } from '../engine/symbols';

const positionState = utils.setPositionState({ x: 200, y: 200, z: 1 });

const player = {
  id: makeId(ENTITIES),
  components: [
    { id: position.id, state: positionState },
  ],
};

export default player;
