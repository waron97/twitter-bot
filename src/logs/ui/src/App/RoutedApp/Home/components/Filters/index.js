import { Input, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

// ----------------------------------------------------------------------------

function _Filters(props) {
    // -------------------------------------
    // Props destructuring
    // -------------------------------------

    const { className, values, onChange } = props

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
            <Input
                value={values.since}
                onChange={onChange('since')}
                className="app-id"
                placeholder="ID app"
            ></Input>
        </div>
    )
}

// ----------------------------------------------------------------------------
// Component PropTypes and default props
// ----------------------------------------------------------------------------

_Filters.propTypes = {
    className: PropTypes.string.isRequired,
}

_Filters.defaultProps = {}

// ----------------------------------------------------------------------------

const Filters = styled(_Filters)`
    & {
        width: 100%;
        height: 30px;
        border-bottom: 1px solid #c1c1c1;
        display: flex;
        align-items: center;

        .app-id {
        }
    }
`
// ----------------------------------------------------------------------------

export default Filters
