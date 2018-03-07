// @flow

import url from 'url';
import path from 'path';

export opaque type HtmlTemplateUrl: string = string;

function makeTemplateUrl(pathname: string): HtmlTemplateUrl {
  return url.format({ pathname, protocol: 'file:', slashes: true });
}

export const gameUrl = makeTemplateUrl(path.resolve('game/game.html'));
export const editorUrl = makeTemplateUrl(path.resolve('editor/editor.html'));
export const configUrl = makeTemplateUrl(path.resolve('config/config.html'));
