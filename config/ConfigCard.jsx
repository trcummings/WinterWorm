import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { grey500 } from 'material-ui/styles/colors';

export default class ConfigCard extends PureComponent { // eslint-disable-line
  static propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.node.isRequired,
    actions: PropTypes.arrayOf(PropTypes.node).isRequired,
  };

  render() {
    const { title, actions, body } = this.props;

    return (
      <Card style={{ content: '', display: 'table', clear: 'both' }}>
        <CardHeader title={title} style={{ backgroundColor: grey500, padding: '8px' }} />
        <CardText>
          { body }
        </CardText>
        <CardActions>
          { actions }
        </CardActions>
      </Card>
    );
  }
}
