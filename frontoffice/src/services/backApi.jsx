import { BACK_URL } from "../config.js";

function apiFetch(endpoint) {
    return fetch(BACK_URL + endpoint, {
        headers: {
            'Accept': 'application/ld+json',
        },
        method: 'GET'
    }).then(r => r.json())
}

export default {
    apiFetch,
}