const app = require('../server');
const { clone } = require('../util');
// const { models } = require('../models');

const EventTypes = require('../services/eventTypes');
const Components = require('../services/components');
const Systems = require('../services/systems');
const Scenes = require('../services/scenes');
const Entities = require('../services/entities');
const ComponentStates = require('../services/componentStates');

const systemPartitions = {
  fpsTickStart: { partition: 'pre', orderIndex: 0 },
  ticker: { partition: 'pre', orderIndex: 1 },
  meta: { partition: 'pre', orderIndex: 2 },
  loader: { partition: 'pre', orderIndex: 3 },
  input: { partition: 'pre', orderIndex: 4 },
  inputControl: { partition: 'main', orderIndex: 0 },
  sprite: { partition: 'main', orderIndex: 1 },
  animate: { partition: 'main', orderIndex: 2 },
  move: { partition: 'main', orderIndex: 3 },
  accelerate: { partition: 'main', orderIndex: 4 },
  physics: { partition: 'main', orderIndex: 5 },
  position: { partition: 'main', orderIndex: 6 },
  spriteRender: { partition: 'main', orderIndex: 7 },
  render: { partition: 'main', orderIndex: 8 },
  clearEventQueue: { partition: 'post', orderIndex: 0 },
  fpsTickEnd: { partition: 'post', orderIndex: 1 },
};

const serviceMap = {
  entities: Entities,
  components: Components,
  eventTypes: EventTypes,
  systems: Systems,
  scenes: Scenes,
  componentStates: ComponentStates,
};

// const logAccessors = (type) => {
//   const associations = models[type].associations;
//   const accessors = Object.keys(associations).map(key => associations[key].accessors);
//   console.log('accessors', accessors);
// };

const makeErrorOut = send => (error) => {
  console.error(error);
  return send({ error });
};

// get all game objects. Good for loading up the editor for the first time
app.get('/init', async (req, res) => {
  const gameObjects = {};
  const errorOut = makeErrorOut(res.send);

  for (const type of Object.keys(serviceMap)) {
    const [err, result] = await serviceMap[type].findAll();
    if (err) return errorOut(err);

    result.forEach((record) => {
      if (!gameObjects[type]) gameObjects[type] = {};
      gameObjects[type][record.id] = clone(record);
    });
  }

  return res.send(JSON.stringify({ data: gameObjects }));
});

// create all game objects from the game's specs folder
app.post('/init', async (req, res) => {
  const { body: { eventTypes, components, systems } } = req;
  const errorOut = makeErrorOut(res.send);

  // create systems
  for (const system of systems) {
    const body = Object.assign({}, system, systemPartitions[system.label]);
    const [sErr] = await Systems.findOrCreate({ body });
    if (sErr) errorOut(sErr);
  }

  // create all event types & store a label => id map
  const eventTypeMap = {};
  for (const eventType of eventTypes) {
    const [err, result] = await EventTypes.findOrCreate({ body: eventType });
    if (err) return errorOut(err);

    eventTypeMap[result.label] = result;
  }

  // mapping of component id to component label for context
  const contextMap = {};
  const componentMap = {};
  for (const component of components) {
    const { label, context = [], subscriptions = [], contract } = component;

    // create the component
    const [cErr, cResult] = await Components.findOrCreate({ body: { label, contract } });
    if (cErr) return errorOut(cErr);

    // add the component to the component map
    componentMap[cResult.label] = cResult;

    // add the component's context to the context map
    if (context.length > 0) contextMap[cResult.label] = context;

    // create the system
    const [systemLabel] = label.split('able');
    const body = Object.assign({}, { label: systemLabel }, systemPartitions[systemLabel]);
    const [sErr, system] = await Systems.findOrCreate({ body });
    if (sErr) return errorOut(sErr);

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

  // Create an initial scene for the game to use
  const [scErr, scene] = await Scenes.findOrCreate({ body: { label: 'Scene 1' } });
  if (scErr) return errorOut(scErr);

  // Create a main camera entity for the game to use
  const [eErr, entity] = await Entities.findOrCreate({ body: { label: 'Main Camera' } });
  if (eErr) return errorOut(eErr);

  await scene.setEntities([entity]);

  return res.send({});
});
