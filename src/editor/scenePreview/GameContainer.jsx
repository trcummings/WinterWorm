// @flow
import React from 'react';
import { connect } from 'react-redux';

import Game, { type Props } from './Game';

const mapStateToProps = state => ({
  data: state.data,
});

const GameContainer = ({ data }: Props) => {
  console.log(data);
  return <Game data={data} />;
};

export default connect(mapStateToProps)(GameContainer);
