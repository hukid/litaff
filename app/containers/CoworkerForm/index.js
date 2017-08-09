/*
 *
 * CoworkerForm
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Field, FieldArray, reduxForm } from 'redux-form/immutable';
import { makeSelectCoworker, selectUpdateStatus } from './selectors';
import messages from './messages';
import { fillCoworker, initialCreateCoworkerForm, createCoworker, updateCoworker } from './actions';

const CoworkerFormField = ({ input, label, type, meta: { touched, error } }) =>
  <div>
    <label>
      {label}
    </label>
    <div>
      <input {...input} type={type} placeholder={label} />
      {touched &&
        error &&
        <span>
          {error}
        </span>}
    </div>
  </div>
  ;

CoworkerFormField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
};

const CoworkerContactFields = ({ fields, meta: { error, submitFailed } }) =>
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>
        Add Contact
      </button>
      {submitFailed &&
        error &&
        <span>
          {error}
        </span>}
    </li>
    {fields.map((contact, index) =>
      <li key={index}>
        <h4>
          contact #{index + 1}
        </h4>
        <Field
          name={`${contact}.value`}
          type="text"
          component={CoworkerFormField}
          label="Email Address"
        />
        <button
          type="button"
          onClick={() => fields.remove(index)}
        >
        Delete
        </button>
      </li>

    )}
  </ul>
  ;

CoworkerContactFields.propTypes = {
  fields: PropTypes.object,
  meta: PropTypes.object,
};

class CoworkerForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          name="name"
          type="text"
          component={CoworkerFormField}
          label="Name"
        />
        <FieldArray name="contacts" component={CoworkerContactFields} />
        <button type="submit">{this.props.isUpdate ? 'Update' : 'Create'}</button>
      </form>
    );
  }
}

CoworkerForm.propTypes = {
  isUpdate: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  initialValues: makeSelectCoworker(),
  isUpdate: (state, ownProps) => ownProps.route.path.startsWith('/updatecoworker'),
});

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSubmit: (coworker) => {
      if (ownProps.route.path.startsWith('/updatecoworker')) {
        dispatch(updateCoworker(coworker));
      } else {
        dispatch(createCoworker(coworker));
      }
    },
  };
}

const CoworkerReduxForm = reduxForm({
  form: 'coworkerForm', // a unique identifier for this form
})(CoworkerForm);

export default connect(mapStateToProps, mapDispatchToProps)(CoworkerReduxForm);
