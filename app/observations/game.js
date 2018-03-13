import { GAME, OPEN_GAME_FINISH } from 'App/actionTypes';
import { getDevDims } from 'App/utils/screenUtil';
import { startGame } from 'App/utils/browserWindowUtil';
import { setProcess } from 'App/utils/stateUtil';

export const onOpenGame = (state, event) => {
  const game = startGame(getDevDims());
  const next = setProcess(GAME, game, state);

  game.once('ready-to-show', () => (
    event.sender.send(OPEN_GAME_FINISH)
  ));

  return next;
};
