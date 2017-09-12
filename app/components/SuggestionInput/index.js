/**
*
* SuggestionInput
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';
import messages from './messages';

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginBottom: theme.spacing.unit,
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    left: 0,
    right: 0,
    zIndex: 1,
    'max-height': '250px',
    'overflow-y': 'auto',
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
  },
  createButton: {
    width: '100%',
    'justify-content': 'left',
  },
});

function renderInput(inputProps) {
  const { classes, value, ref, label, ...other } = inputProps;

  return (
    <TextField
      className={classes.textField}
      value={value}
      label={label}
      inputRef={ref}
      fullWidth
      margin="normal"
      InputProps={{
        ...other,
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = [];
  const queryIndex = suggestion.name.toLowerCase().indexOf(query.toLowerCase());
  matches.push([queryIndex, queryIndex + query.length]);

  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {
          parts.map((part, index) =>
            !part.highlight ? (
              <span key={index} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
              <strong key={index} style={{ fontWeight: 700 }}>
                {part.text}
              </strong>
            )
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function getSuggestions(value, suggestions) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : suggestions.filter((suggestion) => {
      // const keep =
      //   suggestion.name.toLowerCase().slice(0, inputLength) === inputValue;

      const keep =
        suggestion.name.toLowerCase().indexOf(inputValue) >= 0;

      return keep;
    });
}

class SuggestionInput extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = {
    value: '',
    suggestions: [],
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    const { suggestions } = this.props;
    this.setState({
      suggestions: getSuggestions(value, suggestions),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  handleSuggestionSelected = (event, { suggestion }) => {
    const { onSelect } = this.props;
    onSelect(suggestion.name);
    this.setState({
      value: '',
    });
  };

  renderSuggestionsContainerLocal = (options) => {
    const { containerProps, children, query } = options;
    const { classes, onSelect } = this.props;

    return (
      <Paper {...containerProps} square>
        { !query ? null : <Button className={classes.createButton} onClick={() => { onSelect(query); this.setState({ value: '' }); }} >{`Create "${query}"`}</Button> }
        {children}
      </Paper>
    );
  }

  render() {
    const { classes, label, onKeyPress, disabled, placeholder } = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        renderSuggestionsContainer={this.renderSuggestionsContainerLocal}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          autoFocus: false,
          classes,
          placeholder,
          value: this.state.value,
          label,
          onChange: this.handleChange,
          onKeyPress,
          disabled,
        }}
      />
    );
  }
}

SuggestionInput.propTypes = {
  classes: React.PropTypes.object.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  suggestions: React.PropTypes.array.isRequired,
  label: React.PropTypes.string,
  onKeyPress: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  disabled: React.PropTypes.bool,
};

export default withStyles(styles)(SuggestionInput);
