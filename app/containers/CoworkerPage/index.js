/*
 *
 * CoworkerPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import blue from 'material-ui/colors/blue';

import { makeSelectFilteredCoworkers, makeSelectNameFilter, makeSelectShowEmptyEmailOnly } from './selectors';
import { loadCoworkers, changeFilterText, toggleEmptyEmailOnly, deleteCoworker } from './actions';
import messages from './messages';

const styles = (theme) => ({
  container: {
    width: '800px',
    margin: '0 auto',
  },
  toolbarContainer: {
    margin: '0 24px 16px 24px',
    display: 'flex',
    'justify-content': 'space-between',
    'align-items': 'flex-end',
  },
  filterInput: {
    width: 300,
  },
  swtich: {
    marginTop: 16,
  },
  tableHeader: {
    backgroundColor: blue[300],
    color: 'white',
  },
  nameColumn: {
    width: '20%',
  },
  actionColumn: {
    width: '10%',
  },
});

export class CoworkerPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onLoadCoworkers();
  }

  render() {
    const { classes, showEmptyEmailOnly, nameFilter, onChangeNameFilter, onToggleShowEmptyEmailOnly, onDeleteCoworker } = this.props;
    return (
      <Paper className={classes.container}>
        <div className={classes.toolbarContainer}>
          <TextField
            className={classes.filterInput}
            id="name-filter"
            type="text"
            margin="normal"
            label="Name Filter"
            value={nameFilter}
            onChange={onChangeNameFilter}
            placeholder="Add Name Filter"
          />
          <div className={classes.swtich}>
            <FormControlLabel
              control={
                <Switch
                  checked={showEmptyEmailOnly}
                  onChange={onToggleShowEmptyEmailOnly}
                />
              }
              label="Show Empty Email"
            />
          </div>
        </div>
        <Table>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.nameColumn}>
                <Typography type="title" color="inherit">
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography type="title" color="inherit">
                  Email
                </Typography>
              </TableCell>
              <TableCell className={classes.actionColumn} />
            </TableRow>
          </TableHead>
          <TableBody>
            {
              this.props.coworkers.map((coworker, index) =>
                (
                  <TableRow key={`resource-${index}`}>
                    <TableCell key={`name-${index}`}>
                      {coworker.name}
                    </TableCell>
                    <TableCell key={`contact-${index}`}>
                      {coworker.contacts.length > 0 ? coworker.contacts[0].value : ''}
                    </TableCell>
                    <TableCell key={`operation-${index}`} numeric>
                      <IconButton component={Link} to={`/updatecoworker/${coworker._id}`}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="Delete" onClick={() => onDeleteCoworker(coworker._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

CoworkerPage.propTypes = {
  coworkers: PropTypes.array.isRequired,
  onLoadCoworkers: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  showEmptyEmailOnly: PropTypes.bool.isRequired,
  nameFilter: PropTypes.string.isRequired,
  onChangeNameFilter: PropTypes.func.isRequired,
  onToggleShowEmptyEmailOnly: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  coworkers: makeSelectFilteredCoworkers(),
  nameFilter: makeSelectNameFilter(),
  showEmptyEmailOnly: makeSelectShowEmptyEmailOnly(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadCoworkers: () => dispatch(loadCoworkers()),
    onChangeNameFilter: (event) => dispatch(changeFilterText(event.target.value)),
    onToggleShowEmptyEmailOnly: (event, checked) => dispatch(toggleEmptyEmailOnly(checked)),
    onDeleteCoworker: (coworker) => dispatch(deleteCoworker(coworker)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CoworkerPage));
