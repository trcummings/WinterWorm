const app = require('../server');
const { clone } = require('../util');
// const { models } = require('../models');

const EventTypes = require('../services/eventTypes');
const Components = require('../services/components');
const Systems = require('../services/systems');

const serviceMap = {
  components: Components,
  eventTypes: EventTypes,
  systems: Systems,
};

app.post('/init', async (req, res) => {
  const { body: { eventTypes, components } } = req;
  const gameObjects = { eventTypes: {}, systems: {}, components: {} };

  // for (const type of Object.keys(gameObjects)) {
  //   const associations = models[type].associations;
  //   const accessors = Object.keys(associations).map(key => associations[key].accessors);
  //   console.log('accessors', accessors);
  // }

  // create all event types & store a label => id map
  const eventTypeMap = {};
  for (const eventType of eventTypes) {
    const [err, result] = await EventTypes.findOrCreate(eventType);
    if (err) throw new Error(err);

    eventTypeMap[result.label] = result;
  }

  // mapping of component id to component label for context
  const contextMap = {};
  const componentMap = {};
  for (const component of components) {
    const { label, context = [], subscriptions = [], contract } = component;

    // just log the contract for now
    if (contract) console.log(contract);

    // create the component
    const [cErr, cResult] = await Components.findOrCreate({ label });
    if (cErr) throw new Error(cErr);

    // add the component to the component map
    componentMap[cResult.label] = cResult;

    // add the component's context to the context map
    if (context.length > 0) contextMap[cResult.label] = context;

    // create the system
    const [systemLabel] = label.split('able');
    const [sErr, system] = await Systems.findOrCreate({ label: systemLabel });
    if (sErr) throw new Error(cErr);

    // associate the system to the component
    await system.setComponent(cResult);

    // associate the event types to the component
    if (subscriptions.length > 0) {
      const subs = subscriptions.map(eName => eventTypeMap[eName]);

      await cResult.setSubscriptions(subs);
    }
  }

  // now that all the components have been created we can associate
  // their context safely
  const componentsWithContext = Object.keys(contextMap);
  for (const componentLabel of componentsWithContext) {
    const contextLabels = contextMap[componentLabel];
    const contexts = contextLabels.map(cLabel => componentMap[cLabel]);
    const component = componentMap[componentLabel];

    await component.setContexts(contexts);
  }

  for (const type of Object.keys(gameObjects)) {
    const [err, result] = await serviceMap[type].findAll();
    if (err) throw new Error(err);

    result.forEach((record) => {
      gameObjects[type][record.id] = clone(record);
    });
  }

  res.send(JSON.stringify(gameObjects));
});
