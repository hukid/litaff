/*
 *
 * SchedulePage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Dialog, {
  DialogActions,
  DialogTitle,
} from 'material-ui/Dialog';

import { makeSelectTasks, makeSelectEvents, makeSelectSelectedEvent, makeSelectCreateDialogOpen, makeSelectSelectedSlotTime, makeSelectView, makeSelectViewDate } from './selectors';
import { loadTasks, deleteTask, eventSelected, slotSelected, closeCreateDialog, changeView, changeDate } from './actions';
import CalendarView from './calendarView';

const styles = (theme) => ({
  pageContainer: {
    padding: theme.spacing.unit,
    margin: '0 auto',
    height: '100%',
    minWidth: '680px',
  },
  headerContainer: {
    marginLeft: 5,
    display: 'flex',
    alignItems: 'center',
  },
  datePicker: {
    margin: 15,
    flex: '1 0 0',
  },
  dateTimeInput: {
    font: 'inherit',
    color: 'currentColor',
    width: '100%',
    border: 0,
    margin: 0,
    padding: '7px 0',
    display: 'block',
    'box-sizing': 'content-box',
    background: 'none',
    'vertical-align': 'middle',
    height: '1em',
    '-webkit-appearance': 'textfield',
    '&::-webkit-clear-button': { /* Removes blue cross */
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  datePickerLabel: {
  },
  newTaskButton: {
    margin: 15,
  },
  card: {
    margin: '0px 15px 10px 15px',
  },
  coworkersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    'flex-direction': 'row',
    flexGrow: 1,
    marginTop: theme.spacing.unit,
  },
  coworkerChip: {
    marginRight: theme.spacing.unit,
  },
});

export class SchedulePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    this.props.onLoadTasks();
  }

  render() {
    const { classes, events, selectedEvent, view, date,
      onSelectEvent, onDoubleClickEvent, onSelectSlot, onView, onNavigate,
      createDialogOpen, onCreateDialogClose, selectedSlotTime } = this.props;


    return (
      <Paper className={classes.pageContainer}>
        <CalendarView
          view={view}
          date={date}
          selected={selectedEvent}
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          onDoubleClickEvent={onDoubleClickEvent}
          onNavigate={onNavigate}
          onView={onView}
          events={events}
        />
        <Dialog open={createDialogOpen} onRequestClose={() => onCreateDialogClose(false)}>
          <DialogTitle>Do you want to create a task at this time?</DialogTitle>
          <DialogActions>
            <Button onClick={() => onCreateDialogClose(false)} color="primary">
              No
            </Button>
            <Button onClick={() => onCreateDialogClose(true, selectedSlotTime)} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

SchedulePage.propTypes = {
  events: PropTypes.array.isRequired,
  selectedEvent: PropTypes.object,
  view: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onLoadTasks: PropTypes.func,
  onSelectEvent: PropTypes.func,
  onSelectSlot: PropTypes.func,
  onDoubleClickEvent: PropTypes.func,
  onView: PropTypes.func,
  onNavigate: PropTypes.func.isRequired,
  createDialogOpen: PropTypes.bool.isRequired,
  onCreateDialogClose: PropTypes.func.isRequired,
  selectedSlotTime: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  tasks: makeSelectTasks(),
  events: makeSelectEvents(),
  selectedEvent: makeSelectSelectedEvent(),
  createDialogOpen: makeSelectCreateDialogOpen(),
  selectedSlotTime: makeSelectSelectedSlotTime(),
  view: makeSelectView(),
  date: makeSelectViewDate(),
});

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onLoadTasks: () => dispatch(loadTasks()),
    onDeleteTask: (taskId) => dispatch(deleteTask(taskId)),
    onSelectEvent: (event) => { dispatch(eventSelected(event)); },
    onDoubleClickEvent: (event) => {
      ownProps.router.push(`/updatetask/${event.task._id}`);
    },
    onSelectSlot: (slotInfo) => { dispatch(slotSelected(slotInfo)); },
    onView: (view) => {
      dispatch(changeView(view));
    },
    onNavigate: (date) => {
      dispatch(changeDate(date));
      dispatch(loadTasks());
    },
    onCreateDialogClose: (needCreate, selectedSlotTime) => {
      dispatch(closeCreateDialog());
      if (needCreate) {
        ownProps.router.push(`/createtask/${selectedSlotTime.start.toISOString()}/${selectedSlotTime.end.toISOString()}`);
      }
    },
    onChangeView: (view) => { dispatch(changeView(view)); },
    onChangeDate: (date) => dispatch(changeDate(date)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SchedulePage));
