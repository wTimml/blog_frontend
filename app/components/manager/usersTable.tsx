'use client'

import { GetUsers } from '@/app/lib/getUsers';
import React, { useEffect, useState } from 'react';
import IsLoading from '../isLoading';
import { UserData } from '@/app/profile/page';
import apiService from '@/app/services/apiServices';
import { GetUserById } from '@/app/lib/getUserById';
import { useRouter } from 'next/navigation';

const UsersTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [isButtonLoading, setIsButtonLoading] = useState(false);

    const {userData} = GetUserById();
    const router = useRouter();

    if (!userData.is_staff) {
       router.push('/')
    }

    const {
        users,
        setUsers,
        isLoadingReturn
    } = GetUsers ();


    console.log(users)
    useEffect(() => {
        if (users.length > 1 && isLoadingReturn === false) {
            setIsLoading(isLoadingReturn);
        }
    }, [users.length]);
    
    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Handle dropdown change
    const handleIsStaffChange = (id: string, value: string) => {
        setUsers((prevUsers: UserData[]) =>
            prevUsers.map((user: UserData) =>
                user.id === id ? { ...user, is_staff: value } : user
            )
        );
    };

    // Handle save button click
    const handleSave = async (id: string) => {
        setIsButtonLoading(true);
        const userToSave = users.find((user) => user.id === id);

        try {
            const formData = new FormData();
            if (id) formData.append('avatar', id);
            if (userToSave) formData.append('is_staff', userToSave.is_staff.charAt(0).toUpperCase() +  userToSave.is_staff.slice(1));

            await apiService.put(`/api/auth/manager/${userToSave?.id}/`, formData)
                .then((data) => {
                    // Handle successful response
                    console.log(`Response: ${JSON.stringify(data)}`);

                })
                .catch((error) => {
                    // Handle error response
                    console.log(`Response else: ${JSON.stringify(error)}`);
                    setErrors(['Failed to update profile']);
                });

            setIsLoading(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors(['An error occurred while updating your profile']);
            setIsLoading(false);
        }

        if (userToSave) {
            console.log('Saving user:', userToSave);
            alert(`Saved: ${userToSave.name} - Is Staff: ${userToSave.is_staff}`);
        }

        setIsButtonLoading(false);

    };

    const filteredUsers = users.filter((user: UserData) => {
        return (
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    if (isLoading) {
        return <IsLoading />;
    }
    return (
        <div className="p-4 mx-auto w-4/5">
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-4 p-2 border border-gray-300 rounded-lg w-full max-w-md"
            />

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border dark:bg-slate-400 border-gray-200 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-slate-600">
                            <th className="px-4 py-2 border border-gray-200 w-2/6">Name</th>
                            <th className="px-4 py-2 border border-gray-200 w-2/6">Email</th>
                            <th className="px-4 py-2 border border-gray-200 w-1/6">Is Staff</th>
                            <th className="px-4 py-2 border border-gray-200 w-1/6">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-slate-500">
                                <td className="px-4 py-2 border border-gray-200">{user.name}</td>
                                <td className="px-4 py-2 border border-gray-200">{user.email}</td>
                                <td className="px-4 py-2 border border-gray-200">
                                    <div className="flex justify-center items-center">
                                        <select
                                            value={user.is_staff ? 'true' : 'false'}
                                            onChange={(e) =>
                                                handleIsStaffChange(user.id, e.target.value)
                                            }
                                            className="p-1 border border-gray-300 rounded-lg"
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </td>
                                <td className="px-4 py-2 border border-gray-200">
                                    <div className="flex justify-center items-center">
                                        {isButtonLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                                                ></path>
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleSave(user.id)}
                                                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-700"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;