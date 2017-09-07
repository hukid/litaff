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

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';

import SuggestionInput from 'components/SuggestionInput';

import {
  makeSelectTaskFormData,
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

const FormTextSingleLine = ({ id, classes, input, label, type, meta: { touched, error } }) =>
  <TextField
    className={classes.textField}
    id={id}
    label={label}
    type={type}
    margin="normal"
    helperText={touched && error && `${error}`}
    error={!!error}
    fullWidth
    {...input}
  />
;

const FormTextMultiLine = ({ id, classes, input, label, type, meta: { touched, error } }) =>
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
    {...input}
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
          component={FormTextSingleLine}
          label="Start Time"
          classes={classes}
        />
        <Field
          name="endTime"
          type="datetime-local"
          id="endTime"
          component={FormTextSingleLine}
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
        {/* <Field
          name="newcoworker"
          type="text"
          id="newcoworker"
          component={FormAddWorkerInput}
          label="New Coworker:"
          classes={classes}
          suggestions={suggestions}
        /> */}
        {/* <Button type="button" onClick={this.props.onAddCoworker}>Add</Button> */}
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
};

const mapStateToProps = createStructuredSelector({
  isUpdate: (state, ownProps) => ownProps.route.path.startsWith('/updatetask'),
  initialValues: makeSelectTaskFormData(),
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
