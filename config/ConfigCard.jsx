import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { grey500 } from 'material-ui/styles/colors';

const cardStyle = {
  content: '',
  display: 'table',
  clear: 'both',
  height: `${window.innerHeight}px`,
  width: `${window.innerWidth}px`,
};

const titleStyle = {
  backgroundColor: grey500,
  padding: '8px',
};

const textStyle = {
  height: '180px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
};

export default class ConfigCard extends PureComponent { // eslint-disable-line
  static propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.node.isRequired,
    actions: PropTypes.arrayOf(PropTypes.node).isRequired,
  };

  render() {
    const { title, actions, body } = this.props;

    return (
      <Card style={cardStyle}>
        <CardHeader title={title} style={titleStyle} />
        <CardText style={textStyle}>{ body }</CardText>
        <CardActions>{ actions }</CardActions>
      </Card>
    );
  }
}
