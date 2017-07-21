/*
 *
 * CoworkerPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectCoworkerPage from './selectors';
import messages from './messages';

export class CoworkerPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

CoworkerPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // CoworkerPage: makeSelectCoworkerPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoworkerPage);
