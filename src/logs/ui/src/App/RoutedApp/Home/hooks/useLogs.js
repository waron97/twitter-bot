import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { getLogs } from '../../../_shared/api'
import { useAuth } from '../../../_shared/stores'

const seconds = (n) => n * 1000

export default function useLogs() {
    const [logs, setLogs] = useState([])
    const [defaultSince] = useState(dayjs())
    const { apiKey } = useAuth()

    useEffect(() => {
        if (!apiKey) {
            return
        }

        const interval = setInterval(async () => {
            const since = logs?.length
                ? dayjs(logs[0].date).toISOString()
                : defaultSince.toISOString()
            const newLogs = await getLogs({ since }, apiKey)

            if (newLogs?.data?.length) {
                setLogs([...newLogs.data, ...logs])
            }
        }, seconds(5))

        return () => {
            clearInterval(interval)
        }
    }, [logs, apiKey])

    return logs
}
