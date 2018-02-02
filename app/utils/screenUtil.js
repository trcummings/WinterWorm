import { screen } from 'electron';

export const getScreenDims = () => {
  const display = screen.getPrimaryDisplay();
  const { size: { height, width } } = display;
  return { height, width, x: 0, y: 0 };
};

export const getDevDims = () => {
  const { height, width } = getScreenDims();
  return { height, width: Math.floor((2 * width) / 3), x: 0, y: 0 };
};

export const getEditorDims = () => {
  const { height, width } = getScreenDims();
  const thirdWidth = Math.floor(width / 3);
  return { height, width: thirdWidth, x: thirdWidth * 2, y: 0 };
};
