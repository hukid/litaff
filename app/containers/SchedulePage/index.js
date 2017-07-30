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

import { makeSelectTasks, makeSelectStartTime, makeSelectEndTime } from './selectors';
import messages from './messages';
import { loadTasks } from './actions';

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

export class SchedulePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    this.props.onLoadTasks();
  }

  render() {
    return (
      <div>
        <NewTaskButton to="/createtask">New Task</NewTaskButton>
        {
          this.props.tasks.map((task, index) =>
            (
              <TaskCard key={index}>
                <div>
                  {'Subject: '}
                  <span id={`"subject-${index}"`}>{task.subject}</span>
                </div>
                <div htmlFor={`"start-${index}"`}>
                  {'Start: '}
                  <span id={`"start-${index}"`}>{task.time.start.toString()}</span>
                </div>
                <div htmlFor={`"end-${index}"`}>
                  {'End: '}
                  <span id={`"end-${index}"`}>{task.time.end.toString()}</span>
                </div>
                <EditTaskButton to={`/updatetask/${task._id}`}>Edit</EditTaskButton>
              </TaskCard>
            )
          )
        }
      </div>
    );
  }
}

SchedulePage.propTypes = {
  tasks: PropTypes.array,
  onLoadTasks: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tasks: makeSelectTasks(),
  startTime: makeSelectStartTime(),
  endTime: makeSelectEndTime(),
  // SchedulePage: makeSelectSchedulePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadTasks: () => dispatch(loadTasks()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);
