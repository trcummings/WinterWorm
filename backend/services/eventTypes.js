const { models } = require('../models');
const { clone } = require('../util');

module.exports = {
  findOrCreate: eventType => new Promise(async (resolve, reject) => {
    const { label } = eventType;

    return models.eventTypes.findOrCreate({ where: { label } })
      .spread((result, created) => {
        console.log(created ? 'created ' : 'found ', clone(result));
        return resolve([null, result]);
      })
      .catch(err => reject([err]));
  }),
  findAll: () => new Promise(async (resolve, reject) => (
    models.eventTypes.findAll()
      .then((rows => resolve([null, clone(rows)])))
      .catch(err => reject([err]))
  )),
};
