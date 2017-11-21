/**
*
* AgendaEvent
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function AgendaEvent(props) {
  const { event } = props;
  const resources = event.task.resources;
  const coworkers = resources.map((resource) => resource.name);
  return (
    <div>
      <div>
        <Typography type={'body2'} color={'primary'}>{event.title}</Typography>
      </div>
      <Divider />
      <div>
        <Typography type={'caption'}>{coworkers.join(',')}</Typography>
      </div>
    </div>
  );
}

AgendaEvent.propTypes = {
  event: PropTypes.object.isRequired,
};

export default AgendaEvent;
