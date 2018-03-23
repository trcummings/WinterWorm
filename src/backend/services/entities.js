import { clone, makeContract } from 'Backend/util';
import { models } from 'Backend/models';

const contract = {
  service: 'entities',
  customActions: {
    createWithScene: ({ body: { sceneId, ...rest } }) => (
      models.scenes.findById(sceneId).then(unlinkedScene =>
        models.entities.findOrCreate({ where: rest }).then(([entity]) =>
          unlinkedScene.addEntity(entity).then(() => (
            models.scenes.findById(clone(unlinkedScene).id, { include: [
              { association: 'entities' },
            ] }).then((scene) => {
              const newEntity = clone(entity);
              const newScene = clone(scene);

              return {
                entities: { [newEntity.id]: newEntity },
                scenes: {
                  [newScene.id]: {
                    ...newScene,
                    entities: newScene.entities.map(({ id }) => id),
                  },
                },
              };
            })
          ))))
        .then(resp => [null, resp])
    ),
  },
};

export default makeContract(contract);
