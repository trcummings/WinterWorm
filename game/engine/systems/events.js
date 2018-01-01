import { assocPath } from 'ramda';

import { queuePath, clearEventsQueue } from '../events';

// Adds an events entry to the state object.
export const initEventsSystem = gameState => assocPath(queuePath, {}, gameState);

// Clear out events queue. Returns update game state.
export const eventSystem = gameState => clearEventsQueue(gameState);
