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

export function getLogs(params) {}
