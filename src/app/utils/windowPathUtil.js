// @flow

import url from 'url';
import path from 'path';

export opaque type HtmlTemplateUrl: string = string;

function makeTemplateUrl(pathname: string): HtmlTemplateUrl {
  return url.format({ pathname, protocol: 'file:', slashes: true });
}
const srcPath = process.env.SRC_PATH;
const gameTemplatePath = path.resolve(srcPath, 'game/game.html');
const editorTemplatePath = path.resolve(srcPath, 'editor/editor.html');
const configTemplatePath = path.resolve(srcPath, 'config/config.html');

export const gameUrl = makeTemplateUrl(gameTemplatePath);
export const editorUrl = makeTemplateUrl(editorTemplatePath);
export const configUrl = makeTemplateUrl(configTemplatePath);
