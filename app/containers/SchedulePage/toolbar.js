import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
// import Calendar from 'rc-calendar';
// import DatePicker from 'rc-calendar/lib/Picker';
import { withStyles } from 'material-ui/styles';
import 'material-ui-icons/Delete';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation';
import GridOn from 'material-ui-icons/GridOn';
import ViewWeek from 'material-ui-icons/ViewWeek';
import ViewList from 'material-ui-icons/ViewList';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import Dialog, {
  DialogActions,
  DialogTitle,
} from 'material-ui/Dialog';

import { makeSelectSelectedEvent, makeSelectDeleteConfirmDialogOpen } from './selectors';
import { deleteTask, eventSelected, openDeleteConfirmDialog, closeDeleteConfirmDialog } from './actions';

const navigate = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE',
};

const styles = {
  toolbarContainer: {
    display: 'flex',
    'justify-content': 'space-between',
    'flex-direction': 'row',
    'align-items': 'center',
    'margin-bottom': '10px',
    'font-size': '16px',
  },
  editGroup: {
  },
  editButton: {
    'font-size': 13,
  },
  navigationGroup: {
    display: 'flex',
    'align-items': 'center',
    'text-align': 'center',
  },
  dateLabel: {
    'min-width': '150px',
    'font-size': '15px',
  },
  viewGroup: {
  },
};

class Toolbar extends React.Component {
  static propTypes = {
    view: PropTypes.string.isRequired,
    views: PropTypes.arrayOf(
      PropTypes.string,
    ).isRequired,
    label: PropTypes.node.isRequired,
    messages: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    onClearSelected: PropTypes.func.isRequired,
    selectedEvent: PropTypes.object,
    onDeleteTask: PropTypes.func.isRequired,
    deleteConfirmDialogOpen: PropTypes.bool.isRequired,
    onDeleteConfirmDialogClose: PropTypes.func.isRequired,
  }

  navigate = (action) => {
    this.props.onNavigate(action);
    this.props.onClearSelected();
  }

  view = (view) => {
    this.props.onViewChange(view);
    this.props.onClearSelected();
  }

  editingGroup() {
    const { classes, selectedEvent, onDeleteTask } = this.props;
    const taskId = selectedEvent && selectedEvent.task._id;
    return (
      <div className={classes.editGroup}>
        <Button color="primary" dense className={classes.editButton} component={Link} to="/createtask">New</Button>
        <Button color="primary" dense className={classes.editButton} disabled={!selectedEvent} component={Link} to={`/updatetask/${taskId}`}>Edit</Button>
        <Button color="primary" dense className={classes.editButton} disabled={!selectedEvent} component={Link} to={`/copytask/${taskId}`}>Copy</Button>
        <Button color="accent" dense className={classes.editButton} disabled={!selectedEvent} aria-label="Delete" onClick={() => { onDeleteTask(taskId); }}>Delete</Button>

      </div>
    );
  }

  navigationGroup() {
    const { messages, label, classes } = this.props;

    return (
      <div className={classes.navigationGroup}>
        <Button
          dense
          onClick={() => this.navigate(navigate.TODAY)}
        >
          {messages.today}
        </Button>
        <IconButton onClick={() => this.navigate(navigate.PREVIOUS)}>
          <KeyboardArrowLeft />
        </IconButton>
        <div className={classes.dateLabel}>
          <strong>{ label }</strong>
        </div>
        <IconButton onClick={() => this.navigate(navigate.NEXT)}>
          <KeyboardArrowRight />
        </IconButton>
      </div>
    );
  }

  viewNamesGroup() {
    const { classes } = this.props;
    const viewNames = this.props.views;
    const view = this.props.view;

    if (viewNames.length > 1) {
      return (
        <BottomNavigation className={classes.viewGroup} onChange={(event, value) => this.view(value)} showLabels value={view}>
          <BottomNavigationButton label="Month" value="month" icon={<GridOn />} />
          <BottomNavigationButton label="Week" value="week" icon={<ViewWeek />} />
          {/* <BottomNavigationButton label="Day" value="day" icon={<ViewDay />} /> */}
          <BottomNavigationButton label="Agenda" value="agenda" icon={<ViewList />} />
        </BottomNavigation>
      );
    }

    return null;
  }


  render() {
    const { classes, selectedEvent, deleteConfirmDialogOpen, onDeleteConfirmDialogClose } = this.props;
    const taskId = selectedEvent && selectedEvent.task._id;
    return (
      <div className={classes.toolbarContainer}>
        {this.editingGroup()}
        {this.navigationGroup()}
        {this.viewNamesGroup()}
        <Dialog open={deleteConfirmDialogOpen} onRequestClose={() => onDeleteConfirmDialogClose(false)}>
          <DialogTitle>Do you want to delete the task - {selectedEvent && selectedEvent.title}?</DialogTitle>
          <DialogActions>
            <Button onClick={() => onDeleteConfirmDialogClose(false)} color="primary">
              No
            </Button>
            <Button onClick={() => onDeleteConfirmDialogClose(true, taskId)} raised color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  selectedEvent: makeSelectSelectedEvent(),
  deleteConfirmDialogOpen: makeSelectDeleteConfirmDialogOpen(),
});

function mapDispatchToProps(dispatch) {
  return {
    onDeleteTask: () => {
      dispatch(openDeleteConfirmDialog());
    },
    onClearSelected: () => { dispatch(eventSelected(null)); },
    onDeleteConfirmDialogClose: (deleteConfirmed, taskId) => {
      dispatch(closeDeleteConfirmDialog());
      if (deleteConfirmed) {
        dispatch(deleteTask(taskId));
        dispatch(eventSelected(null));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Toolbar));
