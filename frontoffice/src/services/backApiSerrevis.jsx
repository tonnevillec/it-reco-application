import {BACK_URL_SERREVIS} from "../config.js";

function apiFetch(endpoint) {
    return fetch(BACK_URL_SERREVIS+endpoint, {
        headers: {
            'Accept': 'application/json',
        },
        method: 'GET'
    }).then(r => r.json())
}

export default {
    apiFetch,
}