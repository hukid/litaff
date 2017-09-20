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

import { makeSelectTasks, makeSelectFromDate, makeSelectToDate } from './selectors';
import messages from './messages';
import { loadTasks, changeFromDate, changeToDate } from './actions';

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
  headerContainer: {
    marginLeft: 5,
  },
  datePicker: {
    margin: 15,
    width: '45%',
  },
  datePickerLabel: {
  },
  newTaskButton: {
    margin: 15,
  },
  card: {
    margin: '0px 15px 10px 15px',
  },
});

export class SchedulePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    this.props.onLoadTasks();
  }

  render() {
    const { classes, fromDate, toDate, onChangeFromDate, onChangeToDate } = this.props;
    return (
      <Paper>
        <div className={classes.headerContainer}>
          <TextField
            className={classes.datePicker}
            id="from-date"
            type="date"
            margin="normal"
            label="From:"
            value={fromDate.format('YYYY-MM-DD')}
            onChange={onChangeFromDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            className={classes.datePicker}
            id="to-date"
            type="date"
            margin="normal"
            label="To:"
            value={toDate.format('YYYY-MM-DD')}
            onChange={onChangeToDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <Divider />
        <div>
          <Button className={classes.newTaskButton} component={Link} raised to="/createtask">New Task</Button>
        </div>
        {
          this.props.tasks.map((task, index) =>
            (
              <Card
                key={`taskcard-${index}`}
                className={classes.card}
              >
                <CardContent>
                  <Typography type="body1" className={classes.title}>
                    {`${moment(task.time.start).format('MM/DD HH:mm')} - ${moment(task.time.end).format('HH:mm')}`}
                  </Typography>
                  <Typography type="headline" component="h2">
                    {task.subject}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton component={Link} to={`/updatetask/${task._id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="Share">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            )
          )
        }
      </Paper>
    );
  }
}

SchedulePage.propTypes = {
  tasks: PropTypes.array,
  onLoadTasks: PropTypes.func,
  classes: PropTypes.object.isRequired,
  fromDate: PropTypes.object.isRequired,
  toDate: PropTypes.object.isRequired,
  onChangeFromDate: PropTypes.func.isRequired,
  onChangeToDate: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  tasks: makeSelectTasks(),
  fromDate: makeSelectFromDate(),
  toDate: makeSelectToDate(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadTasks: () => dispatch(loadTasks()),
    onChangeFromDate: (event) => { dispatch(changeFromDate(event.target.value)); dispatch(loadTasks()); },
    onChangeToDate: (event) => { dispatch(changeToDate(event.target.value)); dispatch(loadTasks()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SchedulePage));
