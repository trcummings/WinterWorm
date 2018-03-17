import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';

const cardStyle = {
  content: '',
  display: 'table',
  clear: 'both',
  height: `${window.innerHeight}px`,
  width: `${window.innerWidth}px`,
};

const titleStyle = {
  backgroundColor: grey['500'],
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
        <CardContent>
          <Typography style={titleStyle}>{title}</Typography>
          <Typography style={textStyle}>{ body }</Typography>
        </CardContent>
        <CardActions>{ actions }</CardActions>
      </Card>
    );
  }
}
