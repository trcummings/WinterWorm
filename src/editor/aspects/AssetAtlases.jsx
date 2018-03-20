// @flow

import { PureComponent } from 'react';
import fs from 'fs';

type AssetsPath = string;

type FrameKey = string;

export type ResourceName = string;

type AtlasName = string;
type ImgName = string;

export type AnimName = string;

type ResourceFolderPath = string;
type AtlasPath = string;

type ResourceFolder = Array<ImgName | AtlasName>;
type AssetFolder = Array<ResourceFolderPath>;

type SourceSize = {
  h: number,
  w: number,
};

export type RawAtlas = { frames: { [FrameKey]: { sourceSize: SourceSize } } };

type Animation = {
  animName: AnimName,
  numFrames: number,
};
type Animations = { [AnimName]: Animation };
type Atlas = {
  atlas: RawAtlas,
  atlasPath: AtlasPath,
  resourceName: ResourceName,
  frameSpecs: Animations
};

export type Atlases = { [ResourceName]: Atlas };

const makeResourcePath = (
  assetsPath: AssetsPath,
  resourceName: ResourceName
): ResourceFolderPath => `${assetsPath}/${resourceName}`;

const makeAtlasPath = (
  resourceFolderPath: ResourceFolderPath,
  atlasName: AtlasName
): AtlasPath => `${resourceFolderPath}/${atlasName}`;

const getAssetFolders = (assetsPath: AssetsPath): AssetFolder => (
  fs.readdirSync(assetsPath)
);

const getResourceFolder = (resourceFolderPath: ResourceFolderPath): ResourceFolder => (
  fs.readdirSync(resourceFolderPath)
);

const getRawAtlas = (atlasPath: AtlasPath): RawAtlas => (
  JSON.parse(fs.readFileSync(atlasPath, 'utf8'))
);

const isResource = (resourceFolderPath: ResourceFolderPath): boolean => {
  const stats = fs.lstatSync(resourceFolderPath);
  return stats.isDirectory();
};

const getAtlasPath = (resourceFolderPath: ResourceFolderPath): ?AtlasName => {
  const assetFiles = getResourceFolder(resourceFolderPath);
  return assetFiles.find(fPath => fPath.includes('.json'));
};

const getAnimNames = (
  rawAtlas: RawAtlas,
  resourceName: ResourceName
): Animations => (
  Object.keys(rawAtlas.frames).reduce((total, imgPath) => {
    const [_, imgName] = imgPath.split(`${resourceName}/`); // eslint-disable-line
    const [name] = imgName.split('.png');
    const splitName = name.split(/_\d+/);
    const [animName] = splitName;

    if (!total[animName]) {
      total[animName] = { numFrames: 1, animName }; // eslint-disable-line
    }
    else if (splitName.length > 1) total[animName].numFrames += 1; // eslint-disable-line

    return total;
  }, {})
);

const reduceAtlas =
  (assetsPath: AssetsPath) =>
    (total: Atlases, resourceName: ResourceName): Atlases => {
      const resourcePath = makeResourcePath(assetsPath, resourceName);
      if (!isResource(resourcePath)) return total;

      const atlasName = getAtlasPath(resourcePath);
      if (!atlasName) {
        console.warning(`no atlas found in ${resourcePath}`);
        return total;
      }

      const atlasPath = makeAtlasPath(resourcePath, atlasName);
      const rawAtlas = getRawAtlas(atlasPath);

      return Object.assign(total, {
        [resourceName]: {
          atlasPath,
          resourceName,
          atlas: rawAtlas,
          frameSpecs: getAnimNames(rawAtlas, resourceName),
        },
      });
    };

const getAllAtlases = (assetsPath: AssetsPath): Atlases => {
  const assetFolders = getAssetFolders(assetsPath);
  return assetFolders.reduce(reduceAtlas(assetsPath), {});
};

const assetsPath = (process.env.ASSET_PATH: AssetsPath);

export const getAssetPathAtlases = () => getAllAtlases(assetsPath);

type Props = {
  children: Atlases => mixed
};

export default class AssetAtlases extends PureComponent<Props> {
  props: Props;

  render() {
    return this.props.children(getAssetPathAtlases());
  }
}
