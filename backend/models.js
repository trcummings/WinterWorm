const Sequelize = require('sequelize');

const db = new Sequelize('db', 'username', 'password', {
  host: 'localhost',
  port: 3002,
  dialect: 'sqlite',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: 'db.sqlite',
});

const componentSchema = {
  label: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: '',
  },
};
const Component = db.define('component', componentSchema);

const systemSchema = {
  label: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: '',
  },
  devOnly: {
    defaultValue: false,
    type: Sequelize.BOOLEAN,
  },
};
const System = db.define('system', systemSchema);

const eventTypeSchema = {
  label: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: '',
  },
};
const EventType = db.define('eventType', eventTypeSchema);

// components
// cleanup fns
// component state fns

// systems
// system fns


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

const models = {
  components: Component,
  systems: System,
  eventTypes: EventType,
};

const schemas = {
  components: componentSchema,
  systems: systemSchema,
  eventTypes: eventTypeSchema,
};

module.exports = { db, models, schemas };
