import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

// ----------------------------------------------------------------------------

function _LogItem(props) {
    // -------------------------------------
    // Props destructuring
    // -------------------------------------

    const { className, log } = props

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

    return <div className={`${className}`}>LogItem works!</div>
}

// ----------------------------------------------------------------------------
// Component PropTypes and default props
// ----------------------------------------------------------------------------

_LogItem.propTypes = {
    className: PropTypes.string.isRequired,
}

_LogItem.defaultProps = {}

// ----------------------------------------------------------------------------

const LogItem = styled(_LogItem)`
    & {
    }
`
// ----------------------------------------------------------------------------

export default LogItem
