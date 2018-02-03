// @flow
// import React, { PureComponent, Fragment } from 'react';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import DropDownMenu from 'material-ui/DropDownMenu';
// import MenuItem from 'material-ui/MenuItem';
// import {
//   Toolbar,
//   ToolbarGroup,
//   ToolbarSeparator,
//   ToolbarTitle,
// } from 'material-ui/Toolbar';

import { default as WindowFrame } from './containers/WindowFrame';

// import { default as SceneControl } from './sceneComposer/SceneControl';
// import SceneComposerContainer from './sceneComposer/SceneComposerContainer';
// import AddSceneButton from './sceneComposer/AddSceneButton';

import { default as Control } from './control/Control';
import { default as InspectorSwitch } from './inspector/InspectorSwitch';
import { default as Library } from './library/Library';

import { CONTROL, LIBRARY, INSPECTOR } from './modules/windows';

export default class Main extends PureComponent { // eslint-disable-line
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        <WindowFrame windowType={CONTROL}>
          <Control />
        </WindowFrame>
        <WindowFrame windowType={LIBRARY}>
          <Library />
        </WindowFrame>
        <WindowFrame windowType={INSPECTOR}>
          <InspectorSwitch />
        </WindowFrame>
      </div>
    );
  }
}

// <SceneControl>
//   {({ scenes, currentScene, setCurrentScene, setScene }) => (
//     <Fragment>
//       <Toolbar>
//         <ToolbarGroup firstChild>
//           <ToolbarTitle text="Scenes" />
//           { Object.keys(scenes).length && (
//             <DropDownMenu
//               value={currentScene}
//               onChange={(event, _, value) => setCurrentScene(value)}
//             >
//               { Object.keys(scenes).map(id => (
//                 <MenuItem key={id} primaryText={scenes[id].label} value={id} />
//               )) }
//             </DropDownMenu>
//           ) }
//         </ToolbarGroup>
//         <ToolbarGroup>
//           <ToolbarSeparator />
//           <AddSceneButton
//             numScenes={Object.keys(scenes).length}
//             setCurrentScene={setCurrentScene}
//             setScene={setScene}
//           />
//         </ToolbarGroup>
//       </Toolbar>
//       <div>
//         { currentScene && scenes[currentScene] && (
//           <SceneComposerContainer
//             scene={scenes[currentScene]}
//             setScene={setScene}
//           />
//         ) }
//       </div>
//     </Fragment>
//   )}
// </SceneControl>
