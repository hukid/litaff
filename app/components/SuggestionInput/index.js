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
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

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

function renderSuggestionsContainer(options) {
  const { containerProps, children, query } = options;

  return (
    <Paper {...containerProps} square>
      { !query ? null : <div > create </div> }
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

function getSuggestions(value, suggestions) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter((suggestion) => {
      const keep =
        count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

      if (keep) {
        count += 1;
      }

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
    onSelect(suggestion.label);
    this.setState({
      value: '',
    });
  };

  renderSuggestionsContainerLocal = (options) => {
    const { containerProps, children, query } = options;
    const { onSelect } = this.props;

    return (
      <Paper {...containerProps} square>
        { !query ? null : <div type="button" onClick={() => { onSelect(query); this.setState({ value: '' }); }} >{`Create "${query}"`}</div> }
        {children}
      </Paper>
    );
  }

  render() {
    const { classes, label, onKeyPress } = this.props;

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
          placeholder: 'Search a country (start with a)',
          value: this.state.value,
          label,
          onChange: this.handleChange,
          onKeyPress,
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
};

export default withStyles(styles)(SuggestionInput);
