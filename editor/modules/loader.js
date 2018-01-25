const INITIAL_STATE = {

};

export const loadConfigs = () => dispatch => dispatch({
  type: 'LOAD_CONFIGS',
});

export default function loader(state = INITIAL_STATE, action = {}) {
  const { type, payload, meta } = action;

  switch (type) {
    default: return state;
  }
}
