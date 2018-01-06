import { makeId } from '../engine/util';
import { position, renderableRect, utils, boundingRect } from '../engine/components';
import { ENTITIES } from '../engine/symbols';

const positionState = utils.setPositionState({ x: 200, y: 200, z: 1 });
const boundRectState = ({ height: 50, width: 50, lineWidth: 1, lineColor: 0xFF00FF });

const player = {
  id: makeId(ENTITIES),
  components: [
    { id: position.id, state: positionState },
    { id: boundingRect.id, state: boundRectState },
    { id: renderableRect.id, state: undefined },
  ],
};

export default player;
