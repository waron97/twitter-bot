import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { getLogs } from '../../../_shared/api'

const seconds = (n) => n * 1000

export default function useLogs() {
    const [logs, setLogs] = useState([])
    const [defaultSince] = useState(dayjs())

    useEffect(() => {
        const interval = setInterval(async () => {
            const since = logs?.length
                ? dayjs(logs[0].date).toISOString()
                : defaultSince.toISOString()
            const newLogs = await getLogs({ since })

            if (newLogs?.data?.length) {
                setLogs([...newLogs.data, ...logs])
            }
        }, seconds(5))

        return () => {
            clearInterval(interval)
        }
    }, [logs])

    return logs
}
