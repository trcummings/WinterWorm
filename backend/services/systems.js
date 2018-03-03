const { models } = require('../models');
const { clone } = require('../util');

module.exports = {
  findOrCreate: system => new Promise(async (resolve, reject) => {
    const { label } = system;

    return models.systems.findOrCreate({ where: { label } })
      .spread((result, created) => {
        console.log(created ? 'created ' : 'found ', clone(result));
        return resolve([null, result]);
      })
      .catch(err => reject([err]));
  }),
  findAll: () => new Promise(async (resolve, reject) => (
    models.systems.findAll()
      .then((rows => resolve([null, clone(rows)])))
      .catch(err => reject([err]))
  )),
};
