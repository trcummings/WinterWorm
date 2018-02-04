// @flow
import { merge } from 'ramda';

import {
  ENTITIES,
  COMPONENTS,
  SYSTEMS,
  SCENES,
  PARAMETERS,
} from './symbols';

import type { Id } from './types';

type MakeIdType =
  | typeof ENTITIES
  | typeof COMPONENTS
  | typeof SYSTEMS
  | typeof SCENES
  | typeof PARAMETERS

const counterDict = {
  [ENTITIES]: 0,
  [COMPONENTS]: 0,
  [SYSTEMS]: 0,
  [SCENES]: 0,
  [PARAMETERS]: 0,
};

export const makeId = (type: MakeIdType): Id => {
  if (
    typeof type === 'undefined' ||
    typeof counterDict[type] === 'undefined'
  ) throw new Error('undefined or type not in counterDictionary given to makeId');

  // increment the number of ids of that type in the counter dictionary
  counterDict[type] += 1;

  return (`${type}-${counterDict[type]}`: Id);
};

export const conjoin = arg1 => arg2 => merge(arg2, arg1);

export const concatKeywords = (k1: string, k2: string): string => `${k1}-${k2}`;

export const isDev = () => process.env.NODE_ENV === 'development';
