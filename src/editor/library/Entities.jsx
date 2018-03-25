//
import React, { PureComponent, Fragment } from 'react';

import List, {
  ListItem,
  ListItemText,
  // ListItemSecondaryAction,
} from 'material-ui/List';

import { default as ScenesController } from './ScenesController';
import { default as EntitiesController } from './EntitiesController';

export default class Entities extends PureComponent { // eslint-disable-line
  getSorted = objs => (
    Object.keys(objs)
      .sort((id1, id2) => objs[id1].label.localeCompare(objs[id2].label))
  );

  getSceneEntities = (entities, eIds) => eIds.reduce((total, eId) => (
    Object.assign(total, { [eId]: entities[eId] })
  ), {})

  render() {
    return (
      <EntitiesController>
        { ({ entities, selectEntity, addNewEntity }) => (
          <ScenesController>
            { ({ scenes, selectScene }) => (
              <List disablePadding>
                { this.getSorted(scenes).map((sId) => {
                  const { entities: eIds, label } = scenes[sId];
                  const sEntities = this.getSceneEntities(entities, eIds);
                  const sEIds = this.getSorted(sEntities);

                  return (
                    <Fragment key={sId}>
                      <ListItem disableGutters button dense>
                        <ListItemText
                          component="h6"
                          onClick={() => selectScene(sId)}
                          primary={label}
                        />
                      </ListItem>
                      { sEIds.length > 0 && (
                        <List disablePadding>
                          <ListItem disableGutters button dense>
                            <ListItemText
                              inset
                              component="h6"
                              primary="+ New Entity"
                              onClick={() => (
                                addNewEntity({
                                  label: `New Entity ${Object.keys(entities).length + 1}`,
                                  sceneId: sId,
                                })
                              )}
                            />
                          </ListItem>
                          { sEIds.map(eId => (
                            <ListItem disableGutters button dense key={eId}>
                              <ListItemText
                                inset
                                component="h6"
                                onClick={() => selectEntity(eId)}
                                primary={entities[eId].label}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Fragment>
                  );
                }) }
              </List>
            ) }
          </ScenesController>
        ) }
      </EntitiesController>
    );
  }
}
