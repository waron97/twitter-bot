import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

// ----------------------------------------------------------------------------

function _Terminal(props) {
    // -------------------------------------
    // Props destructuring
    // -------------------------------------

    const { className, logs } = props

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
            <div className="logs-wrapper"></div>
        </div>
    )
}

// ----------------------------------------------------------------------------
// Component PropTypes and default props
// ----------------------------------------------------------------------------

_Terminal.propTypes = {
    className: PropTypes.string.isRequired,
}

_Terminal.defaultProps = {}

// ----------------------------------------------------------------------------

const Terminal = styled(_Terminal)`
    & {
        margin-top: 12px;
        flex: 1;
        min-height: 0;
        display: flex;

        position: absolute;
        top: 30px;
        bottom: 0;
        left: 0;
        right: 0;

        overflow: auto;

        min-height: 0;

        .logs-wrapper {
            height: 1200px;
            width: 100%;
            background: rgba(20, 100, 60, 0.2);
        }
    }
`
// ----------------------------------------------------------------------------

export default Terminal
