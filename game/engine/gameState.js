// @flow

export opaque type GameState = {
  gameloop: () => mixed,
  entities: {},
  components: {},
  systems: {},
  scenes: [],
  state: {},
};

const gameState = {
  gameloop: a => a,
  entities: {},
  components: {},
  systems: {},
  scenes: [],
  state: {},
};

export default gameState;
