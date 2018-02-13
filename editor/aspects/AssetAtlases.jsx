// @flow
import { PureComponent } from 'react';
import fs from 'fs';
import PropTypes from 'prop-types';

const assetPath = process.env.ASSET_PATH;

const getAnimNames = (frames, resourceName) => (
  Object.keys(frames).reduce((total, imgPath) => {
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

const getAllAtlases = () => {
  const assetFolders = fs.readdirSync(assetPath);
  return assetFolders.reduce((total, assetFolderPath) => {
    const stats = fs.lstatSync(`${assetPath}/${assetFolderPath}`);
    if (!stats.isDirectory()) return total;
    const assetFiles = fs.readdirSync(`${assetPath}/${assetFolderPath}`);
    const atlasPath = assetFiles.find(fPath => fPath.includes('.json'));
    if (!atlasPath) {
      console.warning(`no atlas found in ${assetPath}/${assetFolderPath}`);
      return total;
    }
    const fullAtlasPath = `${assetPath}/${assetFolderPath}/${atlasPath}`;
    const [resourceName] = atlasPath.split('.json');
    const atlas = JSON.parse(fs.readFileSync(fullAtlasPath, 'utf8'));

    return {
      ...total,
      [resourceName]: {
        atlas,
        resourceName,
        atlasPath: fullAtlasPath,
        frameSpecs: getAnimNames(atlas.frames, resourceName),
      },
    };
  }, {});
};

export default class AssetAtlases extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }
  render() {
    return this.props.children({ atlases: getAllAtlases() });
  }
}
