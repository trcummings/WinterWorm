import { merge } from 'ramda';

export const makeId = () => `${Math.random()}`;

export const conjoin = arg1 => arg2 => merge(arg2, arg1);

export const concatKeywords = (k1, k2) => Symbol.from(`${k1}-${k2}`);
