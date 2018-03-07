import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { grey500 } from 'material-ui/styles/colors';

const ConfigCard = ({ title, actions, body }) => (
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

ConfigCard.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  actions: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default ConfigCard;
