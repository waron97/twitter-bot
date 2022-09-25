import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'

import Filters, { LogLevels } from './components/Filters'
import Terminal from './components/Terminal'
import useLogs from './hooks/useLogs'

// ----------------------------------------------------------------------------

function _Home(props) {
    // -------------------------------------
    // Props destructuring
    // -------------------------------------

    const { className } = props

    // -------------------------------------
    // Hooks (e.g. useState, ...)
    // -------------------------------------

    const [filters, setFilters] = useState({
        appId: undefined,
        levels: Object.values(LogLevels),
    })

    const logs = useLogs(filters)

    // -------------------------------------
    // Memoized values
    // -------------------------------------

    // -------------------------------------
    // Effects
    // -------------------------------------

    // -------------------------------------
    // Component functions
    // -------------------------------------

    function handleChange(field) {
        return (v) => {
            const value = v?.target?.value !== undefined ? v.target.value : v
            setFilters({ ...filters, [field]: value })
        }
    }

    // -------------------------------------
    // Component local variables
    // -------------------------------------

    return (
        <div className={`${className}`}>
            <div className="terminal-wrapper">
                <Filters values={filters} onChange={handleChange} />
                <div className="terminal-wrapper-inner">
                    <Terminal logs={logs} />
                </div>
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------------
// Component PropTypes and default props
// ----------------------------------------------------------------------------

_Home.propTypes = {
    className: PropTypes.string.isRequired,
}

_Home.defaultProps = {}

// ----------------------------------------------------------------------------

const Home = styled(_Home)`
    & {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        flex: 1;
        .terminal-wrapper {
            width: 70%;
            flex: 1;
            min-height: 0;

            display: flex;
            flex-direction: column;
            position: relative;

            .terminal-wrapper-inner {
                flex: 1;
                display: flex;
                flex-direction: column;
                position: relative;
            }
        }
    }
`
// ----------------------------------------------------------------------------

export default Home
