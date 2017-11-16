/*
 *
 * SharingAgenda
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { makeSelectEvents, makeSelectStartTime, makeSelectEndTime } from './selectors';
import { loadSharingTasks } from './actions';
import messages from './messages';

const styles = (theme) => ({
  pageContainer: {
    padding: theme.spacing.unit,
    margin: '0 auto',
    height: '100%',
    width: '100vw',
    fontSize: '12px',
    display: 'flex',
    'flex-direction': 'column',
  },
  toolbar: {
    textAlign: 'center',
    fontSize: '15px',
    margin: '5px 0 5px 0',
  },
  calendarWrapper: {
    flex: '1 0 auto',
    height: '10px',
  },
});

function SharingToolBar(props) {
  const { label, className } = props;
  return (
    <div className={className}>
      <strong>{ label }</strong>
    </div>
  );
}

SharingToolBar.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export class SharingAgenda extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    const sharingId = this.props.params.sharingId;
    this.props.loadSharingTasks(sharingId);
  }

  render() {
    const { events, classes, startTime, endTime } = this.props;
    const label = `${moment(startTime).format('ll')} - ${moment(endTime).format('ll')}`;

    return (
      <Paper className={classes.pageContainer}>
        <SharingToolBar label={label} className={classes.toolbar} />
        <div className={classes.calendarWrapper}>
          <BigCalendar
            defaultView={'agenda'}
            views={['agenda']}
            toolbar={false}
            events={events}
            length={60}
            defaultDate={new Date(2017, 9, 1)}
          />
        </div>
      </Paper>
    );
  }
}

SharingAgenda.propTypes = {
  loadSharingTasks: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
  params: PropTypes.object,
  classes: PropTypes.object.isRequired,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  events: makeSelectEvents(),
  startTime: makeSelectStartTime(),
  endTime: makeSelectEndTime(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadSharingTasks: (sharingId) => dispatch(loadSharingTasks(sharingId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SharingAgenda));
