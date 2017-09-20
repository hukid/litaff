/*
 *
 * CoworkerForm
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { fromJS } from 'immutable';
import { Field, FieldArray, reduxForm } from 'redux-form/immutable';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import Divider from 'material-ui/Divider';
import { indigo } from 'material-ui/colors';

import { makeSelectCoworker } from './selectors';
import messages from './messages';
import { createCoworker, updateCoworker } from './actions';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    'flex-direction': 'column',
    'max-width': '800px',
    margin: '0 auto',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  updateButton: {
    margin: theme.spacing.unit,
  },
  contactContainer: {
    display: 'flex',
  },
  contactsWrapper: {
    marginBottom: 15,
  },
  contactTypeSelect: {
    backgroundColor: indigo[200],
    margin: 15,
  },
  contactInput: {
    marginLeft: 10,
    flexGrow: 1,
  },
  addButton: {
    marginLeft: 15,
  },
  nameInput: {
  },
  deleteButton: {
    margin: theme.spacing.unit,
  },
});

const FormTextSingleLine = ({ id, className, placeholder, input: { value, onChange, onBlur }, label, type, meta: { touched, error } }) => {
  const helperText = touched && error && `${error}`;
  const blurHandler = () => {
    onBlur();
  };

  return (<TextField
    className={className}
    id={id}
    label={label}
    type={type}
    margin="normal"
    helperText={helperText}
    error={touched && !!error}
    value={value}
    inputProps={{
      onChange,
      onBlur: blurHandler,
      placeholder,
    }}
  />);
};

const required = (value) => (value ? undefined : 'Required');

const emailFormat = (value) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

const CoworkerContactFields = ({ classes, fields, meta: { error, submitFailed } }) =>
  <div className={classes.contactsWrapper}>
    {fields.map((contact, index) =>
      <div key={index} className={classes.contactContainer}>
        <Field
          name={`${contact}.contactType`}
          component="select"
          className={classes.contactTypeSelect}
        >
          <option value="1">Email</option>
          {/* <option value="2">Mobile</option> */}
        </Field>
        <Field
          name={`${contact}.value`}
          type="text"
          id={`contact-${index}`}
          placeholder={index === 0 ? 'Default Contact' : `Contact Value #${index + 1}`}
          component={FormTextSingleLine}
          validate={[required, emailFormat]}
          className={classes.contactInput}
        />
        <IconButton onClick={() => fields.remove(index)} className={classes.deleteButton} aria-label="Delete">
          <DeleteIcon />
        </IconButton>
      </div>
    )}
    <Button raised className={classes.addButton} onClick={() => fields.push(fromJS({ contactType: 1 }))}>
      Add new contact
    </Button>
  </div>
  ;

CoworkerContactFields.propTypes = {
  fields: PropTypes.object,
  meta: PropTypes.object,
  classes: PropTypes.object,
};

class CoworkerForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { classes, valid } = this.props;
    return (
      <Paper component="form" className={classes.container} onSubmit={this.props.handleSubmit}>
        <Field
          name="name"
          type="text"
          id="name"
          component={FormTextSingleLine}
          label="Name"
          className={classes.nameInput}
          validate={[required]}
        />
        <FieldArray name="contacts" component={CoworkerContactFields} classes={classes} />
        <Divider />
        <Button raised type="submit" color="primary" className={classes.updateButton} disabled={!valid}>{this.props.isUpdate ? 'Update' : 'Create'}</Button>
      </Paper>
    );
  }
}

CoworkerForm.propTypes = {
  isUpdate: PropTypes.bool,
  handleSubmit: PropTypes.func,
  classes: PropTypes.object.isRequired,
  valid: PropTypes.bool.isRequired,
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
})(withStyles(styles)(CoworkerForm));

export default connect(mapStateToProps, mapDispatchToProps)(CoworkerReduxForm);
