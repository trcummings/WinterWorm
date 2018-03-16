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

  const actions = {
    find: ({ query, params }) => new Promise(resolve => (
      models[service].find({ where: Object.assign({}, query, params) })
        .then(rows => resolve([null, rows]))
        .catch(err => resolve([err]))
    )),
    findOrCreate: ({ body }) => new Promise((resolve) => {
      const { label } = body;
      const defaults = createDefaults(schemas[service], body);

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
    create: ({ body, query }) => new Promise(resolve => ((query.batch
      ? models[service].bulkCreate(body)
      : models[service].create(body)
    )
      .then(rows => resolve([null, rows]))
      .catch(err => resolve([err]))
    )),
    update: ({ body, query, params }) => new Promise(resolve => (
      models[service].update(body, { where: Object.assign({}, query, params) })
        .then(resp => models[service].findById(resp[0]))
        .then(rows => resolve([null, rows]))
        .catch(err => resolve([err]))
    )),
    destroy: ({ query, params }) => new Promise(resolve => (
      models[service].destroy({ where: Object.assign({}, query, params) })
        .then(rows => resolve([null, rows]))
        .catch(err => resolve([err]))
    )),
  };

  actions.run = type => (req, res) => actions[type](req).then(([err, result]) => (
    res.send({
      data: result,
      error: err,
      statusCode: err ? 400 : 200,
    })
  ));

  return actions;
};

const makeController = (app, name, service) => {
  app.get(`/${name}`, service.run('findAll'));
  app.get(`/${name}/:id`, service.run('find'));
  app.post(`/${name}`, service.run('create'));
  app.put(`/${name}`, service.run('update'));
  app.delete(`/${name}`, service.run('destroy'));
};

module.exports = {
  clone,
  createDefaults,
  makeContract,
  makeController,
};