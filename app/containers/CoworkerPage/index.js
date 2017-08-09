/*
 *
 * CoworkerPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import { makeSelectCoworkers } from './selectors';
import { loadCoworkers } from './actions';
import messages from './messages';

const CoworkerCard = styled.div`
  border-bottom: 1px solid grey;
`;


const NewCoworkerButton = styled(Link)`
  border: 1px solid blue;
`;

const EditCoworkerButton = styled(Link)`
  border: 1px solid blue;
`;

export class CoworkerPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onLoadCoworkers();
  }

  render() {
    return (
      <div>
        <NewCoworkerButton to="/createcoworker">New Coworker</NewCoworkerButton>
        {
          this.props.coworkers.map((coworker, index) =>
            (
              <CoworkerCard key={index}>
                <label htmlFor={`"name-${index}"`}>
                  {'Name: '}
                  <span id={`"name-${index}"`}>{coworker.name}</span>
                </label>
                <EditCoworkerButton to={`/updatecoworker/${coworker._id}`}>Edit</EditCoworkerButton>
              </CoworkerCard>
            )
          )
        }
      </div>
    );
  }
}

CoworkerPage.propTypes = {
  coworkers: PropTypes.array.isRequired,
  onLoadCoworkers: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  coworkers: makeSelectCoworkers(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadCoworkers: () => dispatch(loadCoworkers()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoworkerPage);
