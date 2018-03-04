const { models, schemas } = require('./models');

const clone = obj => JSON.parse(JSON.stringify(obj));

const createDefaults = (schema, object) => (
  Object.keys(schema).reduce((total, key) => (
    Object.assign(total, { [key]: object[key] })
  ), {})
);

const passThrough = (...args) => Promise.resolve(...args);

const makeContract = (schema) => {
  const {
    service,
    findAll: {
      include: includeFindAll = [],
      post: postFindAll = passThrough,
    } = {},
  } = schema;

  return {
    findOrCreate: entity => new Promise((resolve) => {
      const { label } = entity;
      const defaults = createDefaults(schemas[service], entity);

      return models[service].findOrCreate({ where: { label }, defaults })
        .spread((result, created) => {
          console.log(created ? 'created ' : 'found ', clone(result));
          return resolve([null, result]);
        })
        .catch(err => resolve([err]));
    }),
    findAll: () => new Promise(resolve => (
      models[service].findAll({ include: includeFindAll })
        .then(postFindAll)
        .then(rows => resolve([null, rows]))
        .catch(err => resolve([err]))
    )),
  };
};

module.exports = {
  clone,
  createDefaults,
  makeContract,
};
