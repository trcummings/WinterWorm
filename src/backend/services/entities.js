import { clone, makeContract } from '../util';
import { models } from '../models';

const contract = {
  service: 'entities',
  customActions: {
    createWithScene: ({ body }) => new Promise((resolve) => {
      const { sceneId } = body;
      const bodyCopy = Object.assign({}, body);
      delete bodyCopy.sceneId;

      return models.scenes.findById(sceneId).then(unlinkedScene =>
        models.entities.findOrCreate({ where: bodyCopy }).then(([entity]) =>
          unlinkedScene.addEntity(entity).then(() => (
            models.scenes.findById(clone(unlinkedScene).id, { include: [
              { association: 'entities' },
            ] }).then((scene) => {
              const newEntity = clone(entity);
              const newScene = clone(scene);

              return {
                entities: { [newEntity.id]: newEntity },
                scenes: { [newScene.id]: Object.assign({}, newScene, {
                  entities: newScene.entities.map(({ id }) => id),
                }) },
              };
            })
          ))))
        .then(resp => resolve([null, resp]));
    }),
  },
};

export default makeContract(contract);
