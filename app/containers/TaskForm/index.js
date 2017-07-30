/*
 *
 * TaskForm
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import {
  makeSelectSubject,
  makeSelectStartTime,
  makeSelectEndTime,
  makeSelectCoworkers,
  makeSelectContent,
  makeSelectNewCoworker,
  makeSelectTask,
  makeSelectUpdateMode,
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

export class TaskForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    if (this.props.route.path.startsWith('/updatetask') && this.props.params.taskId) {
      // TODO: when selected Task is null
      this.props.onFillTaskInfo(this.props.selectedTask);
    } else {
      this.props.onInitCreateForm();
    }
  }

  render() {
    return (
      <form onSubmit={this.props.isUpdate ? this.props.onUpdate : this.props.onCreate}>
        <div>
          <label htmlFor="subject" >
            Subject:
            <input
              id="subject"
              type="text"
              value={this.props.subject}
              onChange={this.props.onChangeSubject}
            />
          </label>
        </div>

        <div>
          <label htmlFor="startTime" >
            Start Time:
          <input
            id="startTime"
            type="text"
            value={this.props.startTime}
            onChange={this.props.onChangeStartTime}
          />
          </label>
        </div>

        <div>
          <label htmlFor="endTime" >
            End Time:
          <input
            id="endTime"
            type="text"
            value={this.props.endTime}
            onChange={this.props.onChangeEndTime}
          />
          </label>
        </div>

        <div>
          <label htmlFor="newcoworker" >
            New Coworker:
            <input
              id="newcoworker"
              type="text"
              value={this.props.newCoworker}
              onChange={this.props.onChangeNewCoworker}
            />
            <span onClick={this.props.onAddCoworker}>Add</span>
          </label>
        </div>

        <div>
          <label htmlFor="coworkers" >
            Coworkers:
          </label>
          <ul>
            {
              this.props.coworkers.map((coworker, index) => <li key={index}>{coworker.toString()}</li>)
            }
          </ul>
        </div>
        <div>
          <label htmlFor="content" >
            Content:
          </label>
          <div>
            <textarea
              id="content"
              rows="4"
              cols="50"
              value={this.props.content}
              onChange={this.props.onChangeContent}
            />
          </div>
        </div>
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
};

const mapStateToProps = createStructuredSelector({
  subject: makeSelectSubject(),
  startTime: makeSelectStartTime(),
  endTime: makeSelectEndTime(),
  coworkers: makeSelectCoworkers(),
  content: makeSelectContent(),
  newCoworker: makeSelectNewCoworker(),
  selectedTask: makeSelectTask(),
  isUpdate: makeSelectUpdateMode(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeSubject: (evt) => dispatch(changeSubject(evt.target.value)),
    onChangeStartTime: (evt) => dispatch(changeStartTime(evt.target.value)),
    onChangeEndTime: (evt) => dispatch(changeEndTime(evt.target.value)),
    onChangeContent: (evt) => dispatch(changeContent(evt.target.value)),
    onChangeNewCoworker: (evt) => dispatch(changeNewCoworker(evt.target.value)),
    onCreate: (evt) => {
      evt.preventDefault();
      dispatch(createTask());
    },
    onUpdate: (evt) => {
      evt.preventDefault();
      dispatch(updateTask());
    },
    onAddCoworker: () => dispatch(addCoworker()),
    onFillTaskInfo: (selectedTask) => dispatch(fillTaskInfo(selectedTask)),
    onInitCreateForm: () => dispatch(initCreateForm()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskForm);
