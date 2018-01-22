// @flow

import url from 'url';
import path from 'path';

// const appPath = path.resolve(process.env.APP_PATH, './');
// const gamePath = path.resolve(process.env.GAME_PATH, '../../game');

export opaque type HtmlTemplateUrl: string = string;

function makeTemplateUrl(pathname: string): HtmlTemplateUrl {
  // const pathname = path.join(basePath, filepath);
  return url.format({ pathname, protocol: 'file:', slashes: true });
}

export const gameUrl = makeTemplateUrl(path.resolve('game/game.html'));
export const editorUrl = makeTemplateUrl(path.resolve('editor/editor.html'));

// export const setupUrl = makeTemplateUrl(appPath, './setup.html');
// export const preloadUrl = makeTemplateUrl(appPath, './preload.html');
// export const gameUrl = makeTemplateUrl(gamePath, './game.html');
