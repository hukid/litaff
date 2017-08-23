/*
 *
 * SignInForm
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Field, reduxForm } from 'redux-form/immutable';
import { signIn } from 'containers/App/actions';
import makeSelectSignInForm from './selectors';
import messages from './messages';

const renderField = ({ id, input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <div>
      <input id={id} {...input} placeholder={label} type={type} />
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export class SignInForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <FormattedMessage {...messages.header} />
        <Field
          name="name"
          type="text"
          id="name"
          component={renderField} label="Name"
        />
        <Field
          name="password"
          type="text"
          id="password"
          component={renderField} label="Password"
        />
        <button type="submit">Sign In</button>

      </form>
    );
  }
}

SignInForm.propTypes = {
  handleSubmit: PropTypes.func,
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
})(SignInForm);

export default connect(mapStateToProps, mapDispatchToProps)(SignInReduxForm);
