/*
 *
 * SignInForm
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Field, reduxForm } from 'redux-form/immutable';

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import { signIn } from 'containers/App/actions';
import makeSelectSignInForm from './selectors';
// import messages from './messages';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    'flex-direction': 'column',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  signInButton: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

const renderField = ({ classes, id, input, label, type, autoFocus, meta: { touched, error, warning } }) => (
  <TextField
    className={classes.textField}
    id={id}
    label={label}
    type={type}
    autoFocus={autoFocus}
    margin="normal"
    helperText={touched && ((error && `${error}`) || (warning && `${warning}`))}
    error={!!error}
    {...input}
  />
);

renderField.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  autoFocus: PropTypes.bool,
};

export class SignInForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.props.handleSubmit} className={classes.container}>
        <Field
          name="name"
          type="text"
          id="name"
          autoFocus
          component={renderField} label="Name"
          classes={classes}
        />
        <Field
          name="password"
          type="password"
          id="password"
          component={renderField} label="Password"
          classes={classes}
        />
        <Button raised color="primary" className={classes.signInButton} type="submit">Sign In</Button>
      </form>
    );
  }
}

SignInForm.propTypes = {
  handleSubmit: PropTypes.func,
  classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  SignInForm: makeSelectSignInForm(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (userInfo) => dispatch(signIn(userInfo)),
  };
}

const SignInReduxForm = reduxForm({
  form: 'signInForm', // a unique identifier for this form
})(withStyles(styles)(SignInForm));

export default connect(mapStateToProps, mapDispatchToProps)(SignInReduxForm);
