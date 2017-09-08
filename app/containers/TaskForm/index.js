/*
 *
 * TaskForm
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Field, FieldArray, reduxForm } from 'redux-form/immutable';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';

import SuggestionInput from 'components/SuggestionInput';

import {
  makeSelectTaskFormData,
  makeSelectFormDuration,
} from './selectors';
import {
  createTask,
  updateTask,
  addCoworker,
} from './actions';
import messages from './messages';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    'flex-direction': 'column',
    'max-width': '800px',
    margin: '0 auto',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  textField: {
  },
  coworkersWrapper: {
    display: 'flex',
    'flex-direction': 'row',
  },
  coworkersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    'flex-direction': 'row',
    flexGrow: 1,
  },
  coworkerLabel: {
    lineHeight: '40px',
  },
  coworkerChip: {
    margin: theme.spacing.unit / 1.5,
  },
});

const suggestions = [
  { label: 'Afghanistan' },
  { label: 'Aland Islands' },
  { label: 'Albania' },
  { label: 'Algeria' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' },
];

const FormTextSingleLine = ({ id, classes, input: { value, onChange }, label, type, meta: { touched, error } }) =>
  <TextField
    className={classes.textField}
    id={id}
    label={label}
    type={type}
    margin="normal"
    helperText={touched && error && `${error}`}
    error={!!error}
    fullWidth
    value={value}
    onChange={onChange}
  />
;

const FormDateTimeInput = ({ id, classes, input: { value, onChange }, label, type, meta: { touched, error } }) =>
  <TextField
    className={classes.textField}
    id={id}
    label={label}
    type={type}
    margin="normal"
    helperText={touched && error && `${error}`}
    error={!!error}
    fullWidth
    value={value}
    onChange={onChange}
  />
;

const FormTextMultiLine = ({ id, classes, input: { value, onChange }, label, type, meta: { touched, error } }) =>
  <TextField
    className={classes.textField}
    id={id}
    label={label}
    type={type}
    margin="normal"
    multiline
    fullWidth
    rows={8}
    helperText={touched && error && `${error}`}
    error={!!error}
    value={value}
    onChange={onChange}
  />
;

const TaskFormCoworkers = ({ classes, fields, meta: { error, submitFailed } }) =>
  <div className={classes.coworkersWrapper}>
    <div className={classes.coworkerLabel}>
      Coworkers:
    </div>
    <div className={classes.coworkersContainer}>
      {
        fields.getAll() && fields.getAll().map((coworker, index) =>
          <Chip
            label={coworker.get('name')}
            className={classes.coworkerChip}
            key={`coworker-${index}`}
            onRequestDelete={() => fields.remove(index)}
          />)
      }
    </div>
  </div>
;

export class TaskForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // componentWillMount() {
  //   if (this.props.route.path.startsWith('/updatetask') && this.props.params.taskId) {
  //     // TODO: when selected Task is null
  //     this.props.onFillTaskInfo(this.props.selectedTask);
  //   } else {
  //     this.props.onInitCreateForm();
  //   }
  // }

  handleStartTimeChange = (event, newValue) => {
    if (!newValue) {
      event.preventDefault();
      return;
    }
    const { change, duration } = this.props;
    const newEndTime = moment(newValue).add(duration, 'minutes').format('YYYY-MM-DDTHH:mm');
    change('endTime', newEndTime);
  }

  beforeStartTime = (newValue, previousValue, allValues) => {
    if (!newValue) {
      return previousValue;
    }
    const newEnd = moment(newValue);
    const startTime = allValues.get('startTime');
    const start = moment(startTime);
    const duration = moment.duration(newEnd.diff(start));
    return duration.asMinutes() >= 30 ? newValue : previousValue;
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper component="form" onSubmit={this.props.handleSubmit} className={classes.container}>
        <Field
          name="subject"
          type="text"
          id="subject"
          component={FormTextSingleLine}
          label="Subject"
          classes={classes}
        />
        <Field
          name="startTime"
          type="datetime-local"
          id="startTime"
          component={FormDateTimeInput}
          onChange={this.handleStartTimeChange}
          label="Start Time"
          classes={classes}
        />
        <Field
          name="endTime"
          type="datetime-local"
          id="endTime"
          component={FormDateTimeInput}
          normalize={this.beforeStartTime}
          label="End Time"
          classes={classes}
        />
        <SuggestionInput
          id="coworkerInput"
          label="Add a coworker"
          suggestions={suggestions}
          onSelect={this.props.onAddCoworker}
          onKeyPress={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
          overrideClasses={classes}
        />
        <FieldArray
          name="coworkers"
          component={TaskFormCoworkers}
          classes={classes}
        />
        <Field
          name="content"
          type="text"
          id="content"
          component={FormTextMultiLine}
          label="Content"
          classes={classes}
        />
        <Button type="submit">{this.props.isUpdate ? 'Update' : 'Create'}</Button>
      </Paper>
    );
  }
}

TaskForm.propTypes = {
  isUpdate: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onAddCoworker: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  change: PropTypes.func,
  duration: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isUpdate: (state, ownProps) => ownProps.route.path.startsWith('/updatetask'),
  initialValues: makeSelectTaskFormData(),
  duration: makeSelectFormDuration(),
});

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSubmit: (task) => {
      if (ownProps.route.path.startsWith('/updatetask')) {
        dispatch(updateTask(task));
      } else {
        dispatch(createTask(task));
      }
    },
    onAddCoworker: (coworker) => dispatch(addCoworker(coworker)),
  };
}

const TaskReduxForm = reduxForm({
  form: 'taskForm',
})(withStyles(styles)(TaskForm));

export default connect(mapStateToProps, mapDispatchToProps)(TaskReduxForm);
