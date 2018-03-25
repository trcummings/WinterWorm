import { models, schemas } from './models';

export const clone = obj => JSON.parse(JSON.stringify(obj));

export const createDefaults = (schema, object) => (
  Object.keys(schema).reduce((total, key) => (
    Object.assign(total, { [key]: object[key] })
  ), {})
);

const passThrough = (...args) => Promise.resolve(...args);

export const makeContract = (schema) => {
  const {
    service,
    findAll: {
      include: includeFindAll = [],
      post: postFindAll = passThrough,
    } = {},
    customActions,
  } = schema;

  const actions = {
    find: ({ query, params }) => (
      models[service].find({ where: Object.assign({}, query, params) })
        .then(rows => [null, rows])
        .catch(err => [err])
    ),
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
    findAll: () => (
      models[service].findAll({ include: includeFindAll })
        .then(postFindAll)
        .then(rows => [null, rows])
        .catch(err => [err])
    ),
    create: ({ body, query }) => ((
      query.batch
        ? models[service].bulkCreate(body)
        : models[service].create(body)
    )
      .then(rows => [null, rows])
      .catch(err => [err])
    ),
    update: ({ body: { id, ...rest } }) => (
      models[service]
        .update(rest, { where: { id } })
        .then(() => models[service].findOne({ where: { id } }))
        .then(rows => [null, rows])
        .catch(err => [err])
    ),
    destroy: ({ body }) => (
      models[service].destroy({ where: { id: body.id } })
        .then(() => [null, { id: body.id }])
        .catch(err => [err])
    ),
    ...customActions,
  };

  actions.run = type => (req, res) => {
    actions[type](req).then(([err, result]) => {
      res.send({
        data: result,
        error: err,
        statusCode: err ? 400 : 200,
      });
    });
  };

  return actions;
};

const runCustom = service => (req, res) => {
  service.run(req.params.customAction)(req, res);
};

export const makeController = (app, name, service) => {
  app.get(`/${name}`, service.run('findAll'));
  app.get(`/${name}/:id`, service.run('find'));
  app.post(`/${name}`, service.run('create'));
  app.put(`/${name}`, service.run('update'));
  app.delete(`/${name}`, service.run('destroy'));
  app.post(`/${name}/:customAction`, runCustom(service));
};
