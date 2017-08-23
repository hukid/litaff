/*
 *
 * Header
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { signOut } from 'containers/App/actions';
import makeSelectHeader from './selectors';
import messages from './messages';

const HeaderWrapper = styled.div`
  display: flex;
  height: 50px;
  padding: 5px 0;
  flex-direction: row;
`;

const Button = styled(Link)`
display: inline-flex;
padding: 0.25em 2em;
text-decoration: none;
border-radius: 4px;
-webkit-font-smoothing: antialiased;
-webkit-touch-callout: none;
user-select: none;
cursor: pointer;
outline: 0;
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
font-weight: bold;
font-size: 16px;
border: 2px solid #41ADDD;
color: #41ADDD;

&:active {
  background: #41ADDD;
  color: #FFF;
}
`;

export class Header extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const navButtons = this.props.signedIn ? (
      <div>
        <Button onClick={this.props.onSignOut} >Sign Out</Button>
      </div>
    ) : (
      <div>
        <Button to="#">Sign in</Button>
        <Button to="/signup">Sign up</Button>
      </div>
    );

    return (
      <HeaderWrapper>
        <FormattedMessage {...messages.header} />
        {navButtons}
      </HeaderWrapper>
    );
  }
}

Header.propTypes = {
  signedIn: PropTypes.bool.isRequired,
  onSignOut: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // Header: makeSelectHeader(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSignOut: () => dispatch(signOut()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
