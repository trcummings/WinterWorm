const Sequelize = require('sequelize');
const path = require('path');

const dbPath = path.resolve(__dirname, `../../editorFiles/${process.argv[2]}/db.sqlite`);

const db = new Sequelize('db', 'username', 'password', {
  host: 'localhost',
  port: 3002,
  dialect: 'sqlite',
  operatorsAliases: false,
  storage: dbPath,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

const id = {
  unique: true,
  type: Sequelize.UUID,
  primaryKey: true,
  defaultValue: Sequelize.UUIDV4,
};

const label = {
  type: Sequelize.STRING,
  unique: true,
  allowNull: false,
};

const description = {
  type: Sequelize.TEXT,
  defaultValue: '',
};

const componentSchema = {
  id,
  label,
  description,
  contract: {
    type: Sequelize.JSON,
    unique: true,
    allowNull: true,
  },
};
const Component = db.define('component', componentSchema);

const systemSchema = {
  id,
  label,
  description,
  devOnly: {
    defaultValue: false,
    type: Sequelize.BOOLEAN,
  },
};
const System = db.define('system', systemSchema);

const eventTypeSchema = { id, label, description };
const EventType = db.define('eventType', eventTypeSchema);

const entitySchema = { id, label, description };
const Entity = db.define('entity', entitySchema);

const sceneSchema = { id, label, description };
const Scene = db.define('scene', sceneSchema);

// Every component that is created by default has a system which manages it
// however, systems may operate on many different properties of the current game state,
// and need not be bound to a component.
System.belongsTo(Component);

// Subscriptions:
// Components can subscribe to events dispatched through the event queue
// A component can have multiple subscriptions to different event types
Component.belongsToMany(EventType, {
  as: { singular: 'subscription', plural: 'subscriptions' },
  through: 'componentSubscription',
});

EventType.belongsToMany(Component, { through: 'componentSubscription' });

// Context
// Components can get component state from other components to use in
// their state update function
Component.belongsToMany(Component, {
  as: { singular: 'context', plural: 'contexts' },
  through: 'componentContext',
  foreignKey: 'componentId',
  otherKey: 'componentContextId',
});

// Component State
// Entities can be created with initial component state. the shape of this
// state is determined by the component's contracts
const componentStateSchema = {
  id,
  state: Sequelize.JSON,
  active: {
    defaultValue: true,
    type: Sequelize.BOOLEAN,
  },
};
const ComponentState = db.define('componentState', componentStateSchema);

Entity.belongsToMany(Component, { through: ComponentState });
Component.belongsToMany(Entity, { through: ComponentState });


const models = {
  entities: Entity,
  components: Component,
  systems: System,
  eventTypes: EventType,
  scenes: Scene,
  componentStates: ComponentState,
};

const schemas = {
  entities: entitySchema,
  components: componentSchema,
  systems: systemSchema,
  eventTypes: eventTypeSchema,
  scenes: sceneSchema,
  componentStates: componentStateSchema,
};

module.exports = { db, models, schemas };
