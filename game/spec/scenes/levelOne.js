import { makeId } from '../../engine/util';
import { meta, clearEventQueue } from '../../engine/systems';

export const levelOneId = makeId();

// temporarily curry this fn into here until i can pull away the anim
export const levelOne = animSystem => ({
  id: levelOneId,
  systems: [animSystem, meta.id, clearEventQueue.id],
});
