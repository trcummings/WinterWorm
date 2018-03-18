//
import React, { PureComponent, Fragment } from 'react';

import ListSubheader from 'material-ui/List/ListSubheader';
import List, {
  ListItem,
  // ListItemIcon,
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
      <ScenesController>
        { ({ scenes, selectScene }) => (
          <EntitiesController>
            { ({ entities, selectEntity }) => (
              <List>
                { this.getSorted(scenes).map((sId) => {
                  const { entities: eIds, label } = scenes[sId];
                  const sEntities = this.getSceneEntities(entities, eIds);
                  const sEIds = this.getSorted(sEntities);

                  return (
                    <Fragment key={sId}>
                      <ListItem>
                        <ListItemText
                          onClick={() => selectScene(sId)}
                          primary={label}
                        />
                      </ListItem>
                      { sEIds.length > 0 && (
                        <List disablePadding>
                          { sEIds.map(eId => (
                            <ListItem key={eId}>
                              <ListItemText
                                inset
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
          </EntitiesController>
        ) }
      </ScenesController>
    );
  }
}
