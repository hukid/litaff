/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';

import Header from 'containers/Header';
import SideNav from 'components/SideNav';

import { makeSelectAppLoaded, makeSelectLoggedIn } from './selectors';
import { signInFromToken } from './actions';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

const MainBody = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100%;
`;

const Content = styled.div`
  flex: 1 1 auto;
`;

class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
    appLoaded: React.PropTypes.bool,
    loadAppData: React.PropTypes.func,
    loggedIn: React.PropTypes.bool,
  };

  componentDidMount() {
    this.props.loadAppData();
  }

  render() {
    const { appLoaded, loggedIn } = this.props;
    const sideNav = loggedIn ? <SideNav /> : null;
    return (
      <AppWrapper>
        <Header signedIn={loggedIn} />
        { !appLoaded ? (
          <MainBody>
            loading
          </MainBody>
          ) : (
            <MainBody>
              {sideNav}
              <Content>
                {React.Children.toArray(this.props.children)}
              </Content>
            </MainBody>
          )
        }
      </AppWrapper>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  appLoaded: makeSelectAppLoaded(),
  loggedIn: makeSelectLoggedIn(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadAppData: () => dispatch(signInFromToken()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

