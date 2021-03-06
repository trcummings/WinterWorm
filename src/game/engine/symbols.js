// @flow

// ECS
export const ID = 'id';
export const FN = 'fn';
export const UPDATE_FNS = 'updateFns';
export const SCENES = 'scenes';
export const SCRIPTS = 'scripts';
export const SYSTEMS = 'systems';
export const SYSTEM_FN = 'systemFn';
export const ENTITIES = 'entities';
export const COMPONENTS = 'components';
export const CURRENT_SCENE = 'currentScene';
export const ENTITY_TRASHCAN = 'entityTrashcan';
export const SUBSCRIPTIONS = 'subscriptions';
export const CLEANUP_FN = 'cleanupFn';
export const CONTEXT = 'context';
export const ID_RECORD = 'idRecord';

export const STATE = 'state';

export const GAME_LOOP = 'gameLoop';
export const RENDER_ENGINE = 'renderEngine';
export const PHYSICS_ENGINE = 'physicsEngine';
export const CURRENT_CAMERA = 'currentCamera';

// Asset Loaders
export const ASSET_LOADERS = 'assetLoaders';
// LoaderTypes
export const SPRITE_LOADER = 'spriteLoader';

// Events
export const EVENTS = 'events';
// EventTypes
export const QUEUE = 'queue';
export const META = 'meta';

// Queue Event Types
export const REMOVE_ENTITY = 'removeEntity';
export const KEYBOARD_INPUT = 'keyboardInput';
export const POSITION_CHANGE = 'positionChange';
export const ACCELERATION_CHANGE = 'accelerationChange';
export const SCENE_CHANGE = 'sceneChange';
export const ANIMATION_CHANGE = 'animationChange';
export const FRAME_CHANGE = 'frameChange';
export const RENDER_ACTION = 'renderAction';
export const PHYSICS_EVENT = 'physicsEvent';
export const TIME_TICK = 'timeTick';
export const PIXI_INTERACTION = 'pixiInteraction';
export const CAMERA_ZOOM = 'cameraZoom';
export const GAME_TO_EDITOR = 'gameToEditor';
export const EDITOR_TO_GAME = 'editorToGame';

export const events = {
  [REMOVE_ENTITY]: REMOVE_ENTITY,
  [KEYBOARD_INPUT]: KEYBOARD_INPUT,
  [POSITION_CHANGE]: POSITION_CHANGE,
  [ACCELERATION_CHANGE]: ACCELERATION_CHANGE,
  [SCENE_CHANGE]: SCENE_CHANGE,
  [ANIMATION_CHANGE]: ANIMATION_CHANGE,
  [FRAME_CHANGE]: FRAME_CHANGE,
  [RENDER_ACTION]: RENDER_ACTION,
  [PHYSICS_EVENT]: PHYSICS_EVENT,
  [TIME_TICK]: TIME_TICK,
  [PIXI_INTERACTION]: PIXI_INTERACTION,
  [CAMERA_ZOOM]: CAMERA_ZOOM,
  [GAME_TO_EDITOR]: GAME_TO_EDITOR,
  [EDITOR_TO_GAME]: EDITOR_TO_GAME,
};
