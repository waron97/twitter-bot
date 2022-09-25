import axios from 'axios'
import formUrlEncoded from 'form-urlencoded'

const apiKey = 'logs-api-key'

function getBaseUrl() {
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8090'
    } else {
        return ''
    }
}

export function getApiUrl(endpoint, params) {
    let url = getBaseUrl() + endpoint
    if (params) {
        url += `?${formUrlEncoded(params)}`
    }
    return url
}

export function getLogs(params) {
    const url = getApiUrl('/logs', { ...params })
    return sendRequest(url, 'GET')
}

async function sendRequest(url, method, body) {
    const { data } = await axios({
        method,
        url,
        data: body,
        headers: { Authorization: `apiKey ${apiKey}` },
    })

    return data
}
