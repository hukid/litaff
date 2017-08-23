/**
*
* Button
*
*/

import React from 'react';
import styled from 'styled-components';

const DefaultButton = styled.div`
padding: 0.5em 1.5em;
color: #6CC0E5;
border: 1px solid #6CC0E5;
border-radius: 3px;
text-decoration: none;
user-select: none;
display: inline-block;
`;

function Button(props) {
  return (
    <DefaultButton>
      {props}
    </DefaultButton>
  );
}

Button.propTypes = {

};

export default Button;
