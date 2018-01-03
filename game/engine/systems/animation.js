import { FN, ID } from '../symbols';
import { makeId } from '../util';

// temporarily curry this fn into here until i can pull away the anim

export const animation = anim => ({
  [ID]: makeId(),
  [FN]: (gameState) => {
    anim.rotation += 0.01; // eslint-disable-line
    return gameState;
  },
});
