// @flow
import { compose } from 'ramda';
import { mat2d } from 'gl-matrix';

import { CAMERA_ZOOM } from 'Game/engine/symbols';
import { getInboxEvents } from 'Game/engine/events';
import { type Events } from 'Game/engine/types';
import { type EntityId } from 'Editor/types';
import {
  type CameraableState,
} from 'Game/gameObjectSpecs/componentStateFns/cameraable';
import { type PositionableState } from 'Editor/inspector/entityInspector/views/Positionable';

const setPixiMatrix = (pixiMatrix, matrix) => {
  pixiMatrix.a  = matrix[0]; // eslint-disable-line
  pixiMatrix.b  = matrix[1]; // eslint-disable-line
  pixiMatrix.c  = matrix[2]; // eslint-disable-line
  pixiMatrix.d  = matrix[3]; // eslint-disable-line
  pixiMatrix.tx = matrix[4]; // eslint-disable-line
  pixiMatrix.ty = matrix[5]; // eslint-disable-line

  return pixiMatrix;
};

type Op = 'translate' | 'rotate' | 'scale';

const applyMat = (op: Op, args) => mat => mat2d[op](mat, mat, args);

const getMatrix = ({ zoom, pivot, center, rotation, position }) => compose(
  applyMat('translate', [-pivot.x, -pivot.y]),
  applyMat('rotate', rotation),
  applyMat('scale', [1 / zoom, 1 / zoom]),
  applyMat('translate', [position.x, position.y]),
  applyMat('translate', [-center.x, -center.y]),
  applyMat('translate', [pivot.x, pivot.y]),
)(mat2d.identity([]));

export default (
  entityId: EntityId,
  componentState: CameraableState,
  context: { positionable: PositionableState, inbox: Events }
) => {
  const { positionable, inbox } = context;
  const events = getInboxEvents(CAMERA_ZOOM)(inbox);
  const { transform, view, zoom } = componentState;

  const matrix = mat2d.invert([], getMatrix({ ...componentState, position: positionable }));
  const newTransform = setPixiMatrix(transform, matrix);
  const zoomOffset = events.reduce((total, { action: scrollScalar }) => (
    (total + scrollScalar > 3 || total + scrollScalar < 0.1)
      ? total
      : total + scrollScalar
  ), 0);

  return {
    ...componentState,
    transform: newTransform,
    view: { ...view, ...positionable },
    zoom: zoom + zoomOffset,
  };
};
