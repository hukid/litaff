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
} from './selectors';
import {
  changeSubject,
  changeStartTime,
  changeEndTime,
  changeCoworkers,
  changeContent,
  changeNewCoworker,
  createTask,
  addCoworker,
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


        <button type="submit">Add</button>
      </form>
    );
  }
}

TaskForm.propTypes = {
  subject: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  coworkers: PropTypes.object,
  content: PropTypes.string,
  newCoworker: PropTypes.string,
  onChangeSubject: PropTypes.func.isRequired,
  onChangeStartTime: PropTypes.func.isRequired,
  onChangeEndTime: PropTypes.func.isRequired,
  onChangeCoworkers: PropTypes.func.isRequired,
  onChangeContent: PropTypes.func.isRequired,
  onChangeNewCoworker: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onAddCoworker: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  subject: makeSelectSubject(),
  startTime: makeSelectStartTime(),
  endTime: makeSelectEndTime(),
  coworkers: makeSelectCoworkers(),
  content: makeSelectContent(),
  newCoworker: makeSelectNewCoworker(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeSubject: (evt) => dispatch(changeSubject(evt.target.value)),
    onChangeStartTime: (evt) => dispatch(changeStartTime(evt.target.value)),
    onChangeEndTime: (evt) => dispatch(changeEndTime(evt.target.value)),
    onChangeCoworkers: (evt) => {
      const coworkers = evt.target.value ? evt.target.value.split(',') : [];
      dispatch(changeCoworkers(coworkers));
    },
    onChangeContent: (evt) => dispatch(changeContent(evt.target.value)),
    onChangeNewCoworker: (evt) => dispatch(changeNewCoworker(evt.target.value)),
    onSubmit: (evt) => {
      evt.preventDefault();
      dispatch(createTask());
    },
    onAddCoworker: () => dispatch(addCoworker()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskForm);
