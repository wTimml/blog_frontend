'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from './actions';
import apiService from '../services/apiServices';
import { UserData } from '../profile/page';

export function GetUserById() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData>({
        id: '',
        name: '',
        email: '',
        avatar_url: '',
        is_staff: ''
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const initializeProfile = async () => {
            try {
                const userId = await getUserId();
                
                if (!userId) {
                    router.push('/login');
                    return;
                }

                const userResponse = await apiService.get(`/api/auth/${userId}`);
                
                if (isMounted) {
                    setUserData({
                        id: userResponse.id,
                        name: userResponse.name || '',
                        email: userResponse.email,
                        avatar_url: userResponse.avatar_url || '',
                        is_staff: userResponse.is_staff || ''
                    });
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error initializing profile:', error);
                    setErrors(['Failed to load profile data']);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        initializeProfile();

        return () => {
            isMounted = false;
        };
    }, [router]);

    return {
        userData,
        setUserData,
        errors,
        setErrors,
        isLoading,
        setIsLoading,
    };
}