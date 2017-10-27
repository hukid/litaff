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
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import { makeSelectAppLoaded, makeSelectLoggedIn } from './selectors';
import { signInFromToken, signOut } from './actions';
import messages from './messages';

const drawerWidth = 180;

const styles = (theme) => ({
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'fixed',
    order: 1,
  },
  headerTitle: {
    flex: '1 0 auto',
  },
  drawerPaper: {
    position: 'fixed',
    height: '100hv',
    paddingTop: 56,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64,
    },
    width: drawerWidth,
    zIndex: 1,
  },
  drawerHeader: {
    height: 56,
    [theme.breakpoints.up('sm')]: {
      height: 64,
    },
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: `calc(100vw - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    padding: theme.spacing.unit * 3,
    height: 'calc(100vh - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100vh - 64px)',
      marginTop: 64,
    },
  },
  contentNoDrawer: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});

class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
    classes: React.PropTypes.object,
    loadAppData: React.PropTypes.func,
    loggedIn: React.PropTypes.bool,
    onSignOut: React.PropTypes.func,
  };

  componentDidMount() {
    this.props.loadAppData();
  }

  render() {
    const { loggedIn, classes } = this.props;
    const navButtons = loggedIn ? (
      <div>
        <Button color="contrast" onClick={this.props.onSignOut} >Sign Out</Button>
      </div>
    ) : (
      <div>
        <Button component={Link} to="/signin" color="contrast">Sign in</Button>
        <Button component={Link} to="/signup" color="contrast">Sign up</Button>
      </div>
    );

    return (
      <div className={classes.appFrame}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.headerTitle}>
              <FormattedMessage {...messages.header} />
            </Typography>
            {navButtons}
          </Toolbar>
        </AppBar>
        {!loggedIn ? (
          null
          ) : (
            <Drawer
              type="permanent"
              classes={{ paper: classes.drawerPaper }}
            >
              <div className={classes.drawerHeader} />
              <Divider />
              <List>
                <ListItem button component={Link} to="/schedule">
                  <ListItemText primary="Schedule" />
                </ListItem>
                <Divider />
                <ListItem button component={Link} to="/coworker">
                  <ListItemText primary="Coworker" />
                </ListItem>
                <Divider />
              </List>
            </Drawer>
          )
        }
        <main className={loggedIn ? classes.content : classes.contentNoDrawer}>
          {this.props.children}
        </main>
      </div>
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
    onSignOut: () => dispatch(signOut()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));

