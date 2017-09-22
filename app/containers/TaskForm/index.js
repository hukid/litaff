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
  makeSelectIsLoadingAvailableCoworkers,
  makeSelectAllAvailableCoworkers,
} from './selectors';
import {
  createTask,
  updateTask,
  addCoworker,
  loadAvailableCoworkers,
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

const FormTextSingleLine = ({ id, classes, input: { value, onChange, onBlur }, label, type, meta: { touched, error } }) => {
  const helperText = touched && error && `${error}`;
  const blurHandler = () => {
    onBlur();
  };

  return (<TextField
    className={classes.textField}
    id={id}
    label={label}
    type={type}
    margin="normal"
    helperText={helperText}
    error={touched && !!error}
    fullWidth
    value={value}
    inputProps={{
      onChange,
      onBlur: blurHandler,
    }}
  />);
};

FormTextSingleLine.propTypes = {
  id: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object.isRequired,
};

const FormDateTimeInput = ({ id, classes, input: { value, onChange }, label, type, meta: { touched, error } }) =>
  <TextField
    inputClassName={classes.dateTimeInput}
    id={id}
    label={label}
    type={type}
    margin="normal"
    helperText={touched && error && `${error}`}
    error={!!error && touched}
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

const validate = (values) => {
  const errors = {};
  // Validate subject
  const subject = values.get('subject');
  if (!subject) {
    errors.subject = 'Required';
  }

  return errors;
};

export class TaskForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.onLoadAvailableCoworkers();
  }

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
    if (duration.asMinutes() < 30) {
      return previousValue;
    }
    return newValue;
  }

  render() {
    const { classes, availableCoworkers, isLoadingAvailableCoworkers, valid } = this.props;
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
          suggestions={availableCoworkers}
          onSelect={this.props.onAddCoworker}
          onKeyPress={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
          overrideClasses={classes}
          disabled={isLoadingAvailableCoworkers}
          placeholder={'Type a name'}
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
        <Button type="submit" raised color="primary" disabled={!valid}>{this.props.isUpdate ? 'Update' : 'Create'}</Button>
        <Button onClick={this.props.onCancel(this.props.router)}>{'Cancel'}</Button>
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
  onLoadAvailableCoworkers: PropTypes.func.isRequired,
  isLoadingAvailableCoworkers: PropTypes.bool.isRequired,
  availableCoworkers: PropTypes.array.isRequired,
  valid: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isUpdate: (state, ownProps) => ownProps.route.path.startsWith('/updatetask'),
  initialValues: makeSelectTaskFormData(),
  duration: makeSelectFormDuration(),
  isLoadingAvailableCoworkers: makeSelectIsLoadingAvailableCoworkers(),
  availableCoworkers: makeSelectAllAvailableCoworkers(),
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
    onLoadAvailableCoworkers: () => dispatch(loadAvailableCoworkers()),
    onCancel: (router) => () => router.goBack(),
  };
}

const TaskReduxForm = reduxForm({
  form: 'taskForm',
  validate,
})(withStyles(styles)(TaskForm));

export default connect(mapStateToProps, mapDispatchToProps)(TaskReduxForm);
