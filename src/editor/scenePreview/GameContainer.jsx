// // @flow
// import React from 'react';
// import { connect } from 'react-redux';
// import uuidv4 from 'uuid/v4';
//
// import { gameSpecsToSpecs } from 'Game/engine/specUtil';
// import type { State as Store, EntityId } from 'Editor/types';
// import Game from './Game';
//
// export type Props = {
//   data: $PropertyType<Store, 'data'>
// };
//
// const mapStateToProps = state => ({
//   data: state.data,
// });
//
// const GameContainer = ({ data }: Props) => {
//   console.log(data);
//
//   const devCameraId = uuidv4();
//   const dataOptions = gameSpecsToSpecs(data, devCameraId);
//
//   this.devCameraId = devCameraId;
//   return (
//     <Game
//       data={data}
//       devCameraId={devCameraId}
//       dataOptions={dataOptions}
//     />
//   );
// };
//
// export default connect(mapStateToProps)(GameContainer);
