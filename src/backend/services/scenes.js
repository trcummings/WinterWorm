import { clone, makeContract } from 'Backend/util';


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

export default makeContract(contract);
