const { clone, makeContract } = require('../util');

const contract = {
  service: 'components',
  findAll: {
    include: [
      { association: 'subscriptions' },
      { association: 'contexts' },
    ],
    post: rows => clone(rows).map((row) => {
      const { contexts = [], subscriptions = [] } = row;
      return Object.assign({}, row, {
        contexts: contexts.map(({ id }) => id),
        subscriptions: subscriptions.map(({ id }) => id),
      });
    }),
  },
};

module.exports = makeContract(contract);