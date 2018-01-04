import { makeId } from '../util';

// temporarily curry this fn into here until i can pull away the anim
const animation = (anim, fpsMeter) => ({
  id: makeId(),
  fn: (state) => {
    fpsMeter.tickStart();
    anim.rotation += 0.01; // eslint-disable-line
    fpsMeter.tick();
    return state;
  },
});

export default animation;
