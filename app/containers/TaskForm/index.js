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
} from './selectors';
import {
  changeSubject,
  changeStartTime,
  changeEndTime,
  changeCoworkers,
  changeContent,
  createTask,
} from './actions';

import messages from './messages';

export class TaskForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
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
          <label htmlFor="coworkers" >
            Coworkers:
          <input
            id="coworkers"
            type="text"
            value={this.props.coworkers.toString()}
            onChange={this.props.onChangeCoworkers}
          />
          </label>
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


        <button type="submit">Add</button>
      </form>
    );
  }
}

TaskForm.propTypes = {
  subject: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  coworkers: PropTypes.array,
  content: PropTypes.string,
  onChangeSubject: PropTypes.func.isRequired,
  onChangeStartTime: PropTypes.func.isRequired,
  onChangeEndTime: PropTypes.func.isRequired,
  onChangeCoworkers: PropTypes.func.isRequired,
  onChangeContent: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  subject: makeSelectSubject(),
  startTime: makeSelectStartTime(),
  endTime: makeSelectEndTime(),
  coworkers: makeSelectCoworkers(),
  content: makeSelectContent(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeSubject: (evt) => dispatch(changeSubject(evt.target.value)),
    onChangeStartTime: (evt) => dispatch(changeStartTime(evt.target.value)),
    onChangeEndTime: (evt) => dispatch(changeEndTime(evt.target.value)),
    onChangeCoworkers: (evt) => {
      const coworkersArray = evt.target.value ? evt.target.value.split(',') : [];
      
      dispatch(changeCoworkers(coworkers));
    },
    onChangeContent: (evt) => dispatch(changeContent(evt.target.value)),
    onSubmit: (evt) => {
      evt.preventDefault();
      dispatch(createTask());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskForm);
