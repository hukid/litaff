/*
 *
 * Header
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import makeSelectHeader from './selectors';
import messages from './messages';

const HeaderWrapper = styled.div`
  display: flex;
  height: 50px;
  padding: 5px 0;
  flex-direction: row;
`;

export class Header extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <HeaderWrapper>
        <FormattedMessage {...messages.header} />
      </HeaderWrapper>
    );
  }
}

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // Header: makeSelectHeader(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
