// @flow

import url from 'url';
import path from 'path';

const basePath = process.env.TEMPLATE_PATH;

export opaque type HtmlTemplateUrl: string = string;

function makeTemplateUrl(filepath: string): HtmlTemplateUrl {
  const pathname = path.join(basePath, filepath);
  return url.format({ pathname, protocol: 'file:', slashes: true });
}

export const setupUrl = makeTemplateUrl('./setup.html');
export const preloadUrl = makeTemplateUrl('./preload.html');
export const gameUrl = makeTemplateUrl('./game.html');
