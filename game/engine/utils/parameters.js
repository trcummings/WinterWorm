// @flow
import { PARAMETERS } from 'Symbols';
import type { Param, ParamType } from 'Types';

import { makeId } from '../util';

export const toParam = (
  name: string,
  type: ParamType,
  param: P
): Param<P> => ({
  id: makeId(PARAMETERS),
  label: name,
  linkFrom: new Set(),
  linkTo: new Set(),
  parentId: '',
  children: [],
  type,
  param,
});
