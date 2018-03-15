import tmp from 'tmp';
import fs from 'fs';

import { GAME, OPEN_GAME_FINISH, START_GAME } from 'App/actionTypes';
import { getDevDims } from 'App/utils/screenUtil';
import { startGame } from 'App/utils/browserWindowUtil';
import { setProcess, getState, setState } from 'App/utils/stateUtil';

const makeTempGameSpec = (state, data) => new Promise(resolve => (
  tmp.file((err, path, fd) => {
    if (err) resolve([err]);

    const file = fs.createWriteStream(path, { fd, encoding: 'utf-8' });

    file.write(JSON.stringify(data), 'utf-8', (wErr) => {
      if (wErr) return resolve([wErr]);
      return file.end((eErr) => {
        if (eErr) return resolve([eErr]);
        return resolve([null, setState(GAME, { path }, state)]);
      });
    });
  })
));

export const onOpenGame = async (state, event, data) => {
  const game = startGame(getDevDims());
  const next = setProcess(GAME, game, state);

  // create temporary json file for game state & save it
  const [err, nextState] = await makeTempGameSpec(next, data);
  if (err) throw err;

  game.once('ready-to-show', () => (
    event.sender.send(OPEN_GAME_FINISH)
  ));

  return nextState;
};

export const onGameSync = (state, event) => new Promise((resolve) => {
  // in dev mode:
  // read the temporary json & send it to the game
  const { path } = getState(GAME, state);
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) throw err;
    event.sender.send(START_GAME, JSON.parse(data));
    resolve(state);
  });

  // NB: in prod mode, read it from ./dist probably
});
