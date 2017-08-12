/*
 *
 * TaskForm
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Field, FieldArray, reduxForm, change } from 'redux-form/immutable';

import {
  makeSelectSubject,
  makeSelectStartTime,
  makeSelectEndTime,
  makeSelectCoworkers,
  makeSelectContent,
  makeSelectNewCoworker,
  makeSelectTask,
  makeSelectUpdateMode,
  makeSelectTaskFormData,
} from './selectors';
import {
  changeSubject,
  changeStartTime,
  changeEndTime,
  changeContent,
  changeNewCoworker,
  createTask,
  updateTask,
  addCoworker,
  fillTaskInfo,
  initCreateForm,
} from './actions';

import messages from './messages';

const TaskFormFiled = ({ input, label, type, meta: { touched, error }, id}) =>
  <div>
    <label htmlFor={id}>
      {label}
    </label>
    <div>
      <input id={id} {...input} type={type} placeholder={label} />
      {touched &&
        error &&
        <span>
          {error}
        </span>}
    </div>
  </div>
  ;

TaskFormFiled.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
  id: PropTypes.string,
};

const ResourceFields = ({ fields, meta: { error, submitFailed } }) =>
  <ul>
    <label>
      Coworkers:
    </label>
    {
      fields.map((coworker, index) => <li key={`coworker-${index}`}>{coworker.toString()}</li>)
    }
  </ul>
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
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          name="subject"
          type="text"
          id="subject"
          component={TaskFormFiled}
          label="Subject"
        />
        <Field
          name="startTime"
          type="text"
          id="startTime"
          component={TaskFormFiled}
          label="Start Time"
        />
        <Field
          name="endTime"
          type="text"
          id="endTime"
          component={TaskFormFiled}
          label="End Time"
        />
        <Field
          name="content"
          type="text"
          id="content"
          component={TaskFormFiled}
          label="Content"
        />
        <Field
          name="newcoworker"
          onChange={this.props.onChangeNewCoworker}
          type="text"
          id="newcoworker"
          component={TaskFormFiled}
          label="New Coworker:"
        />
        <button type="button" onClick={this.props.onAddCoworker}>Add</button>
        <FieldArray name="coworkers" component={ResourceFields} />
        <button type="submit">{this.props.isUpdate ? 'Update' : 'Create'}</button>
      </form>
    );
  }
}

TaskForm.propTypes = {
  params: PropTypes.object,
  route: PropTypes.object,
  subject: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  coworkers: PropTypes.object,
  content: PropTypes.string,
  newCoworker: PropTypes.string,
  selectedTask: PropTypes.object,
  isUpdate: PropTypes.bool.isRequired,
  onChangeSubject: PropTypes.func.isRequired,
  onChangeStartTime: PropTypes.func.isRequired,
  onChangeEndTime: PropTypes.func.isRequired,
  onChangeContent: PropTypes.func.isRequired,
  onChangeNewCoworker: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAddCoworker: PropTypes.func.isRequired,
  onFillTaskInfo: PropTypes.func.isRequired,
  onInitCreateForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  subject: makeSelectSubject(),
  startTime: makeSelectStartTime(),
  endTime: makeSelectEndTime(),
  coworkers: makeSelectCoworkers(),
  content: makeSelectContent(),
  newCoworker: makeSelectNewCoworker(),
  selectedTask: makeSelectTask(),
  isUpdate: (state, ownProps) => ownProps.route.path.startsWith('/updatetask'),
  initialValues: makeSelectTaskFormData(),
});

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onChangeSubject: (evt) => dispatch(changeSubject(evt.target.value)),
    onChangeStartTime: (evt) => dispatch(changeStartTime(evt.target.value)),
    onChangeEndTime: (evt) => dispatch(changeEndTime(evt.target.value)),
    onChangeContent: (evt) => dispatch(changeContent(evt.target.value)),
    onChangeNewCoworker: (evt, newValue) => dispatch(changeNewCoworker(newValue)),
    onCreate: (evt) => {
      evt.preventDefault();
      dispatch(createTask());
    },
    onUpdate: (evt) => {
      evt.preventDefault();
      dispatch(updateTask());
    },
    onSubmit: (task) => {
      if (ownProps.route.path.startsWith('/updatetask')) {
        dispatch(updateTask(task));
      } else {
        dispatch(createTask(task));
      }
    },
    onAddCoworker: () => dispatch(addCoworker()),
    // onAddCoworker: () => dispatch(change('taskForm', 'newcoworker', '')),
    onFillTaskInfo: (selectedTask) => dispatch(fillTaskInfo(selectedTask)),
    onInitCreateForm: () => dispatch(initCreateForm()),
  };
}

const TaskReduxForm = reduxForm({
  form: 'taskForm',
})(TaskForm);

export default connect(mapStateToProps, mapDispatchToProps)(TaskReduxForm);
