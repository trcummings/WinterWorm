import {
  SYSTEMS,
  SCENES,
  CURRENT_SCENE,
} from './symbols';

import preCoreDevOnlySystems from './systems/preCoreDevOnlySystems';
import coreSystems from './systems/coreSystems';
import renderSystems from './systems/renderSystems';
import postRenderDevOnlySystems from './systems/postRenderDevOnlySystems';

const systemList = [
  ...preCoreDevOnlySystems,
  ...coreSystems,
  ...renderSystems,
  ...postRenderDevOnlySystems,
];

const systemIds = systemList.map(({ id }) => id);
const systemMap = systemList.reduce((total, system) => (
  Object.assign(total, { [system.id]: system })
), {});

export function gameSpecsToSpecs(specs) {
  const [sceneId] = Object.keys(specs.scenes || {});
  const scene = specs.scenes[sceneId];

  return [
    { type: SCENES,
      options: { ...scene, systems: systemIds } },
    { type: CURRENT_SCENE,
      options: sceneId },
    ...systemIds.map(id => ({
      type: SYSTEMS, options: systemMap[id],
    })),
  ];
}
