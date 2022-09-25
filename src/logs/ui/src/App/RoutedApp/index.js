import PropTypes from 'prop-types';
import React from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import styled from 'styled-components';

import Home from './Home';

// ----------------------------------------------------------------------------

const router = createHashRouter([{ path: '/', element: <Home /> }]);

function _RoutedApp(props) {
  // -------------------------------------
  // Props destructuring
  // -------------------------------------

  const { className } = props;

  // -------------------------------------
  // Hooks (e.g. useState, ...)
  // -------------------------------------

  // -------------------------------------
  // Memoized values
  // -------------------------------------

  // -------------------------------------
  // Effects
  // -------------------------------------

  // -------------------------------------
  // Component functions
  // -------------------------------------

  // -------------------------------------
  // Component local variables
  // -------------------------------------

  return (
    <div className={`${className}`}>
      <RouterProvider router={router} />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Component PropTypes and default props
// ----------------------------------------------------------------------------

_RoutedApp.propTypes = {
  className: PropTypes.string.isRequired,
};

_RoutedApp.defaultProps = {};

// ----------------------------------------------------------------------------

const RoutedApp = styled(_RoutedApp)`
  & {
  }
`;
// ----------------------------------------------------------------------------

export default RoutedApp;
