import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

// ----------------------------------------------------------------------------

function _LogItem(props) {
    // -------------------------------------
    // Props destructuring
    // -------------------------------------

    const { className, log, onClick } = props

    const { location, message, level, date, isFirstBatch } = log

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

    function getColor() {
        switch (level) {
            case 'debug':
                return '#B0DDFF'
            case 'info':
                return '#3BABFF'
            case 'warning':
                return '#FFC13B'
            case 'error':
                return '#FD572A'
            case 'critical':
                return '#FF0000'
            default:
                return 'white'
        }
    }

    // -------------------------------------
    // Component local variables
    // -------------------------------------

    return (
        <div
            onClick={onClick}
            className={`${className} ${
                isFirstBatch ? 'first-batch' : 'fade-in'
            }`}
        >
            <span className="date">{dayjs(date).format('HH:mm')}</span>
            <span style={{ color: getColor() }} className="level">
                {level}
            </span>
            <span className="location text-ellipsis overflow-hidden whitespace-nowrap">
                {location}
            </span>
            <span className="message">{message}</span>
        </div>
    )
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
        font-family: JetBrains;
        color: white;

        display: flex;
        gap: 12px;
        align-items: center;
        overflow: hidden;

        transform: scale(0%);

        > span {
            display: block;
            font-size: 11px;
        }

        .date {
            width: 40px;
        }

        .level {
            width: 60px;
            font-weight: 700;
        }

        .location {
            width: 100px;
            color: #abff40;
        }

        .message {
            flex: 1;
        }

        &.fade-in {
            animation: fadein 200ms 1 forwards linear;
        }

        &.first-batch {
            transform: scale(100%);
        }

        @keyframes fadein {
            0% {
                transform: scale(0%);
            }
            100% {
                transform: scale(100%);
            }
        }
    }
`
// ----------------------------------------------------------------------------

export default LogItem
