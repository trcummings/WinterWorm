export default (entityId, componentState, context) => {
  const { positionable: { x, y }, animateable: { animation } } = context;
  animation.setTransform(x, y);

  return componentState;
};
