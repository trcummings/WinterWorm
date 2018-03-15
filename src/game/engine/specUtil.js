import {
  SYSTEMS,
  SCENES,
  CURRENT_SCENE,
  ENTITIES,
} from './symbols';

// import preCoreDevOnlySystems from './systems/preCoreDevOnlySystems';
// import coreSystems from './systems/coreSystems';
// import renderSystems from './systems/renderSystems';
// import postRenderDevOnlySystems from './systems/postRenderDevOnlySystems';
// import gameEditorSystems from './systems/gameEditorSystems';
//
// const systemList = [
//   ...preCoreDevOnlySystems,
//   ...coreSystems,
//   ...gameEditorSystems,
//   ...renderSystems,
//   ...postRenderDevOnlySystems,
// ];
//
// const makeSystemIdList = (...userDefinedSystemIds) => ([
//   ...preCoreDevOnlySystems.map(({ id }) => id),
//   ...coreSystems.map(({ id }) => id),
//   ...userDefinedSystemIds,
//   ...renderSystems.map(({ id }) => id),
//   ...postRenderDevOnlySystems.map(({ id }) => id),
// ]);

// const systemIds = systemList.map(({ id }) => id);

// const systemMap = systemList.reduce((total, system) => (
//   Object.assign(total, { [system.id]: system })
// ), {});
//
// const systemsByComponentIds = systemList.reduce((total, { id, component }) => {
//   if (!component) return total;
//   return Object.assign(total, { [component.id]: id });
// }, {});

const getFnFromExportTable = specType => async (name) => {
  const path = `${process.env.GAME_OBJECT_SPECS}/${name}.js`;
  const fn = await import(path);
  console.log(fn);
  return fn;
};

const mapObjectsToLabel = gameObjs => Object.keys(gameObjs).reduce((total, id) => (
  Object.assign(total, { [gameObjs[id].label]: gameObjs[id] })
), {});

export async function gameSpecsToSpecs(specs) {
  console.log(specs);
  const currentSceneId = Object.keys(specs.scenes)[0];
  const currentScene = specs.scenes[currentSceneId];

  const componentLabelMap = mapObjectsToLabel(specs.components);
  const systemLabelMap = mapObjectsToLabel(specs.systems);
  const importComponentFn = getFnFromExportTable('componentFns');
  const importSystemFn = getFnFromExportTable('componentFns');

  const componentLabelFnMap = {};
  for (const label of Object.keys(componentLabelMap)) {
    const fn = await importComponentFn(label);
    componentLabelFnMap[label] = fn;
  }

  const systemLabelFnMap = {};
  for (const label of Object.keys(systemLabelMap)) {
    const fn = await importSystemFn(label);
    systemLabelFnMap[label] = fn;
  }

  // debugger; // eslint-disable-line

  const entityIds = Object.keys(specs.entities); // temporarily spoof the scene having entities
  // const entityIds = currentScene.entities;

  const systemsByComponentIds = Object.keys(specs.systems).reduce((total, { id, componentId }) => (
    componentId
      ? Object.assign(total, { [componentId]: id })
      : total
  ), {});

  const { result: sceneSystemIds } = entityIds.reduce((total, eId) => {
    const componentIds = (specs.entities[eId].components || []).map(({ id }) => id);

    componentIds.forEach((cId) => {
      const systemId = systemsByComponentIds[cId];
      if (!total.memo[systemId]) {
        total.memo[systemId] = true; // eslint-disable-line
        total.result.push(systemId);
      }
    });
    return total;
  }, { result: [], memo: {} });
  // const systemIdsForCurrentScene = makeSystemIdList(sceneSystemIds);

  return [
    { type: SCENES,
      options: { ...currentScene, systems: sceneSystemIds } },
    { type: CURRENT_SCENE,
      options: specs.currentScene },
    ...sceneSystemIds.map(id => ({
      type: SYSTEMS, options: specs.systems[id],
    })),
    ...entityIds.map(eId => ({
      type: ENTITIES, options: specs.entities[eId],
    })),
  ];
}
