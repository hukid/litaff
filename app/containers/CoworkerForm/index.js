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
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import { indigo } from 'material-ui/colors';

import { makeSelectCoworker, selectUpdateStatus } from './selectors';
import messages from './messages';
import { fillCoworker, initialCreateCoworkerForm, createCoworker, updateCoworker } from './actions';

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
  contactContainer: {
    display: 'flex',
  },
  contactTypeSelect: {
    backgroundColor: indigo[200],
    margin: 15,
  },
  contactInput: {
    marginLeft: 10,
    flexGrow: 1,
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

const CoworkerContactFields = ({ classes, fields, meta: { error, submitFailed } }) =>
  <div>
    {fields.map((contact, index) =>
      <div key={index} className={classes.contactContainer}>
        <Field
          name={`${contact}.type`}
          component="select"
          className={classes.contactTypeSelect}
        >
          <option value="1">Email</option>
          <option value="2">Mobile</option>
        </Field>
        <Field
          name={`${contact}.value`}
          type="text"
          id={`contact-${index}`}
          placeholder={index === 0 ? 'Default Contact' : `Contact Value #${index + 1}`}
          component={FormTextSingleLine}
          className={classes.contactInput}
        />
        <IconButton onClick={() => fields.remove(index)} className={classes.deleteButton} aria-label="Delete">
          <DeleteIcon />
        </IconButton>
      </div>
    )}
    <Button raised color="primary" onClick={() => fields.push({})}>
      Add new contact
    </Button>
  </div>
  ;

CoworkerContactFields.propTypes = {
  fields: PropTypes.object,
  meta: PropTypes.object,
};

const validate = (values) => {
  const errors = {};
  // Validate name
  const name = values.get('name');
  if (!name) {
    errors.name = 'Required';
  }

  return errors;
};

class CoworkerForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = {
    type: 1,
    age: 'hai',
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper component="form" className={classes.container} onSubmit={this.props.handleSubmit}>
        <Field
          name="name"
          type="text"
          id="name"
          component={FormTextSingleLine}
          label="Name"
          className={classes.nameInput}
        />
        <FieldArray name="contacts" component={CoworkerContactFields} classes={classes} />
        <button type="submit">{this.props.isUpdate ? 'Update' : 'Create'}</button>
      </Paper>
    );
  }
}

CoworkerForm.propTypes = {
  isUpdate: PropTypes.bool,
  handleSubmit: PropTypes.func,
  classes: PropTypes.object.isRequired,
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
  validate,
})(withStyles(styles)(CoworkerForm));

export default connect(mapStateToProps, mapDispatchToProps)(CoworkerReduxForm);
