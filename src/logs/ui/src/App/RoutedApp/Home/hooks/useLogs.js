import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'

import { getLogs } from '../../../_shared/api'
import { useAuth } from '../../../_shared/stores'

const seconds = (n) => n * 1000

export default function useLogs() {
    const [logs, setLogs] = useState([])
    const [defaultSince] = useState(dayjs().subtract(5, 'minutes'))
    const { apiKey } = useAuth()

    const intervalRef = useRef(null)

    useEffect(() => {
        if (!apiKey) {
            return
        }

        async function setup() {
            if (!logs || !logs.length) {
                setLogs(
                    (
                        await getLogs(
                            { since: defaultSince.toISOString() },
                            apiKey
                        )
                    ).data
                )
            } else {
                intervalRef.current = setInterval(async () => {
                    const since = logs?.length
                        ? dayjs(logs[0].date).toISOString()
                        : defaultSince.toISOString()
                    const newLogs = await getLogs({ since }, apiKey)

                    if (newLogs?.data?.length) {
                        setLogs([...newLogs.data, ...logs])
                    }
                }, seconds(5))
            }
        }

        setup()

        return () => {
            intervalRef.current && clearInterval(intervalRef.current)
        }
    }, [logs, apiKey])

    return logs
}
