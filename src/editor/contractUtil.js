export const stateFromContract = (contract = {}) => (
  Object.keys(contract).reduce((total, key) => (
    Object.assign(total, { [key]: contract[key].defaultsTo })
  ), {})
);

export const makeValidState = (state, contract) => Object.keys(contract)
  .reduce((total, key) => (
    Object.assign(total, { [key]: state[key] })
  ), {});
