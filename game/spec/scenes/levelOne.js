import { SYSTEMS, ID } from '../../engine/symbols';
import { makeId } from '../../engine/util';

export const levelOneId = makeId();

// temporarily curry this fn into here until i can pull away the anim
export const levelOne = animSystem => ({
  [ID]: levelOneId,
  [SYSTEMS]: [animSystem],
});
