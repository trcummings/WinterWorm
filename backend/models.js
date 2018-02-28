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

const Component = db.define('component', {
  label: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: '',
  },
  // subscriptions: {},
  // context: {},
});

const System = db.define('system', {
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
});

const Entity = db.define('entity', {
  label: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: '',
  },
});

const EventType = db.define('eventType', {
  label: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: '',
  },
});

// components
// cleanup fns
// component state fns

// systems
// system fns

// Every component that is created by default has a system which manages it
// however, systems may operate on many different properties of the current game state,
// and need not be bound to a component.
Component.hasOne(System);

module.exports = {
  db,
  models: {
    Component,
    System,
    Entity,
    EventType,
  },
};
