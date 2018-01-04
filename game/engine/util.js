// @flow

import { merge } from 'ramda';

import type { ID } from './types';

export const makeId = (): ID => (`${Math.random()}`: ID);

export const conjoin = arg1 => arg2 => merge(arg2, arg1);

export const concatKeywords = (k1: string, k2: string): string => `${k1}-${k2}`;
