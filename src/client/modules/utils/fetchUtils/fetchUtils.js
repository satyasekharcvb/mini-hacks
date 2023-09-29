async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url = '', params = {}) {
    // Default options are marked with *
    let paramString = '';
    for (let key in params) {
        if (paramString !== '') {
            paramString += '&';
        }
        paramString += key + '=' + encodeURIComponent(params[key]);
    }

    if (paramString !== '') {
        url = url + '?' + paramString;
    }

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });

    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json(); // parses JSON response into native JavaScript objects
}

export { postData, getData };
