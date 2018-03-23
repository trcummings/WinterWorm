import { clone, makeContract } from 'Backend/util';


const contract = {
  service: 'scenes',
  findAll: {
    include: [
      { association: 'entities' },
    ],
    post: rows => clone(rows).map(row => ({
      ...row,
      entities: (row.entities || []).map(({ id }) => id),
    })),
  },
};

export default makeContract(contract);
