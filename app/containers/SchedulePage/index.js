/*
 *
 * SchedulePage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import styled from 'styled-components';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import red from 'material-ui/colors/red';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Chip from 'material-ui/Chip';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import { makeSelectTasks, makeSelectFromDate, makeSelectToDate, makeSelectDurationDays,
  makeSelectEvents, makeSelectSelectedEvent, makeSelectCreateDialogOpen, makeSelectSelectedSlotTime, makeSelectView, makeSelectViewDate } from './selectors';
import messages from './messages';
import { loadTasks, changeFromDate, changeToDate, deleteTask, eventSelected, slotSelected, closeCreateDialog, changeView, changeDate } from './actions';
import CalendarView from './calendarView';

const TaskCard = styled.div`
  border-bottom: 1px solid grey;
  margin-bottom: 1em;
`;

const NewTaskButton = styled(Link)`
  border: 1px solid blue;
`;

const EditTaskButton = styled(Link)`
  border: 1px solid blue;
`;

const styles = (theme) => ({
  pageContainer: {
    padding: theme.spacing.unit,
    margin: '0 auto',
    height: '100%',
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
    const { classes, fromDate, toDate, duration, 
      onChangeFromDate, onChangeToDate, onDeleteTask,
      events, onSelectEvent, selectedEvent,
      onSelectSlot, onView, onNavigate,
      createDialogOpen, onCreateDialogClose, selectedSlotTime, view, date } = this.props;

    return (
      <Paper className={classes.pageContainer}>
        <CalendarView
          view={view}
          date={date}
          selected={selectedEvent}
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          onNavigate={onNavigate}
          onView={onView}
          events={events}
        />
        <Dialog open={createDialogOpen} onRequestClose={onCreateDialogClose}>
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

  // render() {
  //   const { classes, fromDate, toDate, duration, onChangeFromDate, onChangeToDate, onDeleteTask } = this.props;
  //   return (
  //     <Paper className={classes.pageContainer}>
  //       <div className={classes.headerContainer}>
  //         <TextField
  //           className={classes.datePicker}
  //           inputClassName={classes.dateTimeInput}
  //           id="from-date"
  //           type="date"
  //           margin="normal"
  //           label="From:"
  //           value={fromDate.format('YYYY-MM-DD')}
  //           onChange={onChangeFromDate}
  //           InputLabelProps={{
  //             shrink: true,
  //           }}
  //         />
  //         <TextField
  //           className={classes.datePicker}
  //           inputClassName={classes.dateTimeInput}
  //           id="to-date"
  //           type="date"
  //           margin="normal"
  //           label={`To: (${Math.ceil(duration.asDays())} days)`}
  //           value={toDate.format('YYYY-MM-DD')}
  //           onChange={onChangeToDate}
  //           InputLabelProps={{
  //             shrink: true,
  //           }}
  //         />
  //       </div>
  //       <Divider />
  //       <div>
  //         <Button className={classes.newTaskButton} component={Link} raised to="/createtask">New Task</Button>
  //       </div>
  //       {
  //         this.props.tasks.map((task, index) =>
  //           (
  //             <Card
  //               key={`taskcard-${index}`}
  //               className={classes.card}
  //             >
  //               <CardContent>
  //                 <Typography type="body1" className={classes.title}>
  //                   {`${moment(task.time.start).format('MM/DD HH:mm')} - ${moment(task.time.end).format('HH:mm')}`}
  //                 </Typography>
  //                 <Typography type="headline" component="h2">
  //                   {task.subject}
  //                 </Typography>
  //                 <div className={classes.coworkersContainer}>
  //                   {
  //                     task.resources.map((coworker, coworkIndex) =>
  //                       <Chip
  //                         label={coworker.name}
  //                         className={classes.coworkerChip}
  //                         key={`coworker-${coworkIndex}`}
  //                       />)
  //                   }
  //                 </div>
  //               </CardContent>
  //               <CardActions>
  //                 <IconButton component={Link} to={`/updatetask/${task._id}`}>
  //                   <EditIcon />
  //                 </IconButton>
  //                 <IconButton aria-label="Delete" onClick={() => onDeleteTask(task._id)}>
  //                   <DeleteIcon />
  //                 </IconButton>
  //               </CardActions>
  //             </Card>
  //           )
  //         )
  //       }
  //     </Paper>
  //   );
  // }
}

SchedulePage.propTypes = {
  tasks: PropTypes.array,
  events: PropTypes.array,
  onLoadTasks: PropTypes.func,
  classes: PropTypes.object.isRequired,
  fromDate: PropTypes.object.isRequired,
  toDate: PropTypes.object.isRequired,
  onChangeFromDate: PropTypes.func.isRequired,
  onChangeToDate: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  duration: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  tasks: makeSelectTasks(),
  events: makeSelectEvents(),
  fromDate: makeSelectFromDate(),
  toDate: makeSelectToDate(),
  duration: makeSelectDurationDays(),
  selectedEvent: makeSelectSelectedEvent(),
  createDialogOpen: makeSelectCreateDialogOpen(),
  selectedSlotTime: makeSelectSelectedSlotTime(),
  view: makeSelectView(),
  date: makeSelectViewDate(),
});

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onLoadTasks: () => dispatch(loadTasks()),
    onChangeFromDate: (event) => { dispatch(changeFromDate(event.target.value)); dispatch(loadTasks()); },
    onChangeToDate: (event) => { dispatch(changeToDate(event.target.value)); dispatch(loadTasks()); },
    onDeleteTask: (taskId) => dispatch(deleteTask(taskId)),
    onSelectEvent: (event) => { dispatch(eventSelected(event)); },
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
    //onSelectTask: (event) => { },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SchedulePage));
