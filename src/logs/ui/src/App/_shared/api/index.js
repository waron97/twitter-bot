import axios from 'axios'
import formUrlEncoded from 'form-urlencoded'

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

export function getLogs(params, apiKey) {
    const url = getApiUrl('/logs', { ...params })
    return sendRequest(url, 'GET', null, apiKey)
}

export function getAppIds(apiKey) {
    const url = getApiUrl('/logs/app-ids')
    return sendRequest(url, 'GET', null, apiKey)
}

export function validateApiKey(apiKey) {
    const url = getApiUrl('/validate-key')
    return sendRequest(url, 'GET', null, apiKey)
}

async function sendRequest(url, method, body, apiKey) {
    const { data } = await axios({
        method,
        url,
        data: body,
        headers: { Authorization: `apiKey ${apiKey}` },
    })

    return data
}
