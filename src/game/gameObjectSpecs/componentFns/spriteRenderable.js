export default (entityId, componentState, context) => {
  const { animation } = componentState;
  const { positionable: { x, y } = {} } = context;
  if (x !== undefined && y !== undefined) animation.setTransform(x, y);


  return componentState;
};
