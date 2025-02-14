'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from './actions';
import apiService from '../services/apiServices';
import { UserData } from '../profile/page';


export function GetUsers() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoadingReturn, setIsLoadingReturn] = useState<boolean>();
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const initializeProfile = async () => {
            try {
                const userId = await getUserId();
                
                if (!userId) {
                    router.push('/login');
                    return;
                }

                const userResponse = await apiService.get(`/api/auth/users/`);

                console.log(`getUsers: ${userResponse}`)
                
                if (isMounted) {
                    setUsers(userResponse.data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error initializing profile:', error);
                    setErrors(['Failed to load profile data']);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingReturn(false);
                }
            }
        };

        initializeProfile();

        return () => {
            isMounted = false;
        };
    }, [router]);

    return {
        users,
        setUsers,
        errors,
        setErrors,
        isLoadingReturn
    };
}