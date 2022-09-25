import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import LogItem from './LogItem'

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
            <div className="logs-wrapper">
                {logs?.map((log) => {
                    return <LogItem key={log.id} log={log} />
                })}
            </div>
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
        flex: 1;
        min-height: 0;
        display: flex;

        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        overflow: auto;

        min-height: 0;

        .logs-wrapper {
            height: 1200px;
            width: 100%;
            background: #212121;
        }
    }
`
// ----------------------------------------------------------------------------

export default Terminal
