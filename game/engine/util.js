// @flow

import { merge } from 'ramda';

import type { ID } from './types';

let counter = 0;
export const makeId = (): ID => {
  counter += 1;
  return (`${counter}`: ID);
};

export const conjoin = arg1 => arg2 => merge(arg2, arg1);

export const concatKeywords = (k1: string, k2: string): string => `${k1}-${k2}`;
