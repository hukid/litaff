/**
*
* SideNav
*
*/

import React from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import NavButton from './NavButton';

const SideNavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

function SideNav() {
  return (
    <SideNavWrapper>
      <FormattedMessage {...messages.header} />
      <NavButton to="/schedule">
        <FormattedMessage {...messages.schedule} />
      </ NavButton>
      <NavButton to="/coworker">
        <FormattedMessage {...messages.coworker} />
      </ NavButton>
    </SideNavWrapper>
  );
}

SideNav.propTypes = {

};

export default SideNav;
