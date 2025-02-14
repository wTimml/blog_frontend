'use server';

import { cookies } from 'next/headers';
import apiService from '../services/apiServices';

export async function handleRefresh() {
    console.log('handleRefresh');

    try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
            await resetAuthCookies();
            return null;
        }

        const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
            method: 'POST',
            body: JSON.stringify({
                refresh: refreshToken
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        console.log('Response - Refresh:', json);

        if (json.access) {
            const cookieStore = await cookies();
            cookieStore.set('session_access_token', json.access, {
                httpOnly: true,
                secure: false,
                maxAge: 60 * 60, // 60 minutes
                path: '/'
            });

            return json.access;
        } else {
            await resetAuthCookies();
            return null;
        }
    } catch (error) {
        console.log('error', error);
        await resetAuthCookies();
        return null;
    }
}

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();
    cookieStore.set('session_userid', userId, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });

    cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60, // 60 minutes
        path: '/'
    });

    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });
}

export async function resetAuthCookies() {
    const cookieStore = await cookies();
    
    // Set each cookie with maxAge: 0 to expire them immediately
    cookieStore.set('session_userid', '', {
        httpOnly: true,
        secure: false,
        maxAge: 0, // This makes the cookie expire immediately
        path: '/'
    });

    cookieStore.set('session_access_token', '', {
        httpOnly: true,
        secure: false,
        maxAge: 0,
        path: '/'
    });

    cookieStore.set('session_refresh_token', '', {
        httpOnly: true,
        secure: false,
        maxAge: 0,
        path: '/'
    });
}

//
// Get data

export async function getUserId() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_userid')?.value
    return userId ? userId : null
}

export async function getAccessToken() {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('session_access_token')?.value;

    if (!accessToken) {
        accessToken = await handleRefresh();
    }

    return accessToken;
}

export async function getRefreshToken() {
    const cookieStore = await cookies();
    let refreshToken = cookieStore.get('session_refresh_token')?.value;

    return refreshToken;
}