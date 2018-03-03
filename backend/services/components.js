const { models: { components } } = require('../models');
const { clone } = require('../util');
// const Systems = require('./systems');

module.exports = {
  findOrCreate: component => new Promise(async (resolve, reject) => {
    const { label } = component;

    return components.findOrCreate({ where: { label } })
      .spread((result, created) => {
        console.log(created ? 'created ' : 'found ', clone(result));
        return resolve([null, result]);
      })
      .catch(err => reject([err]));
  }),
  findAll: () => new Promise(async (resolve, reject) => (
    components.findAll({
      include: [
        { association: 'subscriptions' },
        { association: 'contexts' },
      ],
    })
      .then((rows => clone(rows).map((row) => {
        const { contexts = [], subscriptions = [] } = row;
        return {
          ...row,
          contexts: contexts.map(({ id }) => id),
          subscriptions: subscriptions.map(({ id }) => id),
        };
      })))
      .then((rows => resolve([null, rows])))
      .catch(err => reject([err]))
  )),
};
