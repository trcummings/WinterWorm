const renderPartition = [
  'world',
  'camera',
  'displayContainer',
  'squareGraphicRender',
  'spriteRender',
  'spriteInteractionFilter',
  'render',
];

const systemPartitionList = {
  pre: [
    'fpsTickStart',
    'ticker',
    'meta',
    'loader',
    'input',
    'pixiInteraction',
    'interact',
  ],
  main: [
    'inputControl',
    'animate',
    'move',
    'accelerate',
    'physics',
    'position',
    ...renderPartition,
  ],
  post: [
    'editorEventHandler',
    'entityTrashcan',
    'clearEventQueue',
    'fpsTickEnd',
  ],
};

const allPartitionKeys = Object.keys(systemPartitionList).reduce((total, key) => (
  total.concat(systemPartitionList[key]
    .map((label, orderIndex) => ({ label, orderIndex, partition: key })))
), []);

export const systemPartitions = (
  allPartitionKeys.reduce((total, { label, orderIndex, partition }) => (
    Object.assign(total, { [label]: { partition, orderIndex } })
  ), {})
);
