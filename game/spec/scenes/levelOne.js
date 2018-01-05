import { makeId } from '../../engine/util';
import { meta, clearEventQueue, render } from '../../engine/systems';

export const levelOneId = makeId();

// temporarily curry this fn into here until i can pull away the anim
export const levelOne = animSystem => ({
  id: levelOneId,
  systems: [animSystem, meta.id, render.id, clearEventQueue.id],
});
