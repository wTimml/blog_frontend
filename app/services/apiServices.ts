import { getAccessToken } from "../lib/actions";

const apiService = {
    get: async function (url: string): Promise<any> {
        console.log('get', url);

        const token = await getAccessToken();

        console.log(`${process.env.NEXT_PUBLIC_API_HOST}${url}`)
        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    post: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);

        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    postWithoutToken: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    put: async function(url: string, data: any): Promise<any> {
        console.log('put', url, data);
        const token = await getAccessToken();
    
        return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'PUT',
            body: data,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async (response) => {
            const json = await response.json();
    
            // Check if the response status is in the 200-299 range (success)
            if (response.ok) {
                return json; // Return the response data for successful requests
            } else {
                // Reject the promise for non-2xx responses
                return Promise.reject(json);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            throw error; // Propagate the error to the caller
        });
    }
}

export default apiService;