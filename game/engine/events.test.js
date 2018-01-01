import { expect } from 'chai';

import {
  getEvents,
  // getSubscribedEvents,
  // makeEvent,
  // emitEvent,
  // emitEvents,
  // batchEmitEvents,
  // clearEventsQueue,
} from './events';
import { STATE, EVENTS, QUEUE } from './symbols';

describe('getEvents', () => {
  const gameState = {
    [STATE]: {
      [EVENTS]: {
        [QUEUE]: [],
      },
    },
  };

  it('should get all the game state events', () => {
    expect(getEvents(gameState)).to.be.an('array').that.is.empty; // eslint-disable-line
  });
});
