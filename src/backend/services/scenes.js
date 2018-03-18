const { clone, makeContract } = require('../util');

const contract = {
  service: 'scenes',
  findAll: {
    include: [
      { association: 'entities' },
    ],
    post: rows => clone(rows).map((row) => {
      const { entities = [] } = row;
      return Object.assign({}, row, {
        entities: entities.map(({ id }) => id),
      });
    }),
  },
};

module.exports = makeContract(contract);
