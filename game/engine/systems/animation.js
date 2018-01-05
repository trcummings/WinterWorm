import { makeId } from '../util';

// temporarily curry this fn into here until i can pull away the anim
const animation = anim => ({
  id: makeId(),
  fn: (state) => {
    anim.rotation += 0.01; // eslint-disable-line
    return state;
  },
});

export default animation;
