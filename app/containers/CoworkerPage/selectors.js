import { createSelector } from 'reselect';

/**
 * Direct selector to the coworkerPage state domain
 */
const selectCoworkerPageDomain = () => (state) => state.get('coworkerPage');

/**
 * Other specific selectors
 */

const makeSelectNameFilter = () => createSelector(
  selectCoworkerPageDomain(),
  (substate) => substate.get('nameFilter'),
);

const makeSelectShowEmptyEmailOnly = () => createSelector(
  selectCoworkerPageDomain(),
  (substate) => substate.get('showEmptyEmailOnly'),
);

const makeSelectAllCoworkers = () => createSelector(
  selectCoworkerPageDomain(),
  (substate) => substate.get('coworkers').toJS(),
);

const makeSelectShowDeleteConfirmDialog = () => createSelector(
  selectCoworkerPageDomain(),
  (substate) => substate.get('showDeleteDialog'),
);

const makeSelectCoworkerToDelete = () => createSelector(
  selectCoworkerPageDomain(),
  (substate) => substate.get('coworkerToDelete'),
);

const makeSelectFilteredCoworkers = () => createSelector(
  makeSelectAllCoworkers(),
  makeSelectNameFilter(),
  makeSelectShowEmptyEmailOnly(),
  (coworkers, nameFilter, showEmptyEmailOnly) => {
    let filteredCoworkers = coworkers;
    if (nameFilter !== '') {
      filteredCoworkers = coworkers.filter((coworker) => coworker.name.toLowerCase().indexOf(nameFilter.toLowerCase()) >= 0);
    }

    if (showEmptyEmailOnly) {
      filteredCoworkers = filteredCoworkers.filter((coworker) => coworker.contacts == null || coworker.contacts.length === 0);
    }

    return filteredCoworkers;
  },
);

/**
 * Default selector used by CoworkerPage
 */

const makeSelectCoworkerPage = () => createSelector(
  selectCoworkerPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectCoworkerPage;
export {
  selectCoworkerPageDomain,
  makeSelectAllCoworkers,
  makeSelectFilteredCoworkers,
  makeSelectNameFilter,
  makeSelectShowEmptyEmailOnly,
  makeSelectShowDeleteConfirmDialog,
  makeSelectCoworkerToDelete,
};
