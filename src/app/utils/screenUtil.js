import { screen } from 'electron';

const third = num => Math.floor(num / 3);

export const getScreenDims = () => {
  const display = screen.getPrimaryDisplay();
  const { size: { height, width } } = display;
  return { height, width, x: 0, y: 0 };
};

export const getDevDims = () => {
  const { height, width } = getScreenDims();
  return { height, width: third(width) * 2, x: 0, y: 0 };
};

export const getEditorDims = () =>
  // const { height, width } = getScreenDims();
  // return { height, width: third(width), x: third(width) * 2, y: 0 };
  ({ fullscreen: true })
;

export const getConfigDims = () => {
  const { height, width } = getScreenDims();

  return {
    height: third(height),
    width: third(width),
    x: third(width),
    y: third(height),
  };
};
