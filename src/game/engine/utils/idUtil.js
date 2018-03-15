// @flow
// This file is a way of ensuring that all possible specs persisted
// In the state have a deterministic id system made up of a keyword and
// a spec type. Register all Ids here, generate all Ids here. Be careful
// to not register Ids willy nilly.
import {
  ENTITIES,
  COMPONENTS,
  SYSTEMS,
  SCENES,
} from '../symbols';

import type { Id } from '../types';

type MakeIdType =
  | typeof ENTITIES
  | typeof COMPONENTS
  | typeof SYSTEMS
  | typeof SCENES

const idTypes: Array<MakeIdType> = [
  ENTITIES,
  COMPONENTS,
  SYSTEMS,
  SCENES,
];

const idRegistry = new Set();

export const checkIdRegistry = (id: Id): boolean => idRegistry.has(id);

export const removeIdFromRegistry = (id: Id) => {
  idRegistry.delete(id);
  return id;
};

const addToIdRegistry = (id: Id): Id => {
  if (checkIdRegistry(id)) {
    throw new Error(`${id} already exists in Id Registry!`);
  }
  else idRegistry.add(id);
};

export const registerAsId = (idString: string, type: MakeIdType): Id => {
  if (!idTypes.includes(idString)) throw new Error('Not a valid Id Type!');
  const potentialId = (`${type}_id:${idString}`: Id);

  addToIdRegistry(potentialId);

  return potentialId;
};
