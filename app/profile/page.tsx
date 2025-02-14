'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiService from "../services/apiServices";
import { getUserId } from "../lib/actions";
import Image from "next/image";
import IsLoading from "../components/isLoading";
import { GetUserById } from "../lib/getUserById";

export interface UserData {
    id: string,
    name: string;
    email: string;
    avatar_url: string;
    is_staff: string;
}

const Profile = () => {
    const router = useRouter();

    const [success, setSuccess] = useState<string>();
    const [dataImage, setDataImage] = useState<File | null>(null);

    const {
        userData,
        setUserData,
        errors,
        setErrors,
        isLoading,
        setIsLoading
    } = GetUserById();


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allowed file types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        // Check file type
        if (e.target.files && !allowedTypes.includes(e.target.files[0].type)) {
            setErrors(['Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.']);
            return;
        }

        // Check file extension (optional, for additional validation)
        if(e.target.files) {
            const fileExtension = e.target.files[0].name.split('.').pop()?.toLowerCase();
            if (!fileExtension || !allowedExtensions.includes(`.${fileExtension}`)) {
                setErrors(['Invalid file extension. Only .jpg, .jpeg, .png, and .gif are allowed.']);
                return;
            }
        }

        // If validation passes, proceed with the file
        setErrors([]); // Clear any previous errors
        console.log('Valid file selected:', e.target.files);

        if (e.target.files && e.target.files[0] && errors.length<1) {
            setDataImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        setIsLoading(true);

        try {
            const userId = await getUserId();
            if (!userId) {
                router.push('/login');
                return;
            }

            const formData = new FormData();
            if (userData.name) formData.append('name', userData.name);
            if (dataImage) formData.append('avatar', dataImage);

            await apiService.put(`/api/auth/profile/${userId}/`, formData)
                .then((data) => {
                    // Handle successful response
                    console.log(`Response: ${JSON.stringify(data)}`);

                    // Refresh user data after successful update
                    return apiService.get(`/api/auth/${userId}`);
                })
                .then((updatedUser) => {
                    setUserData({
                        id: userData.id,
                        name: updatedUser.name || '',
                        email: userData.email,
                        avatar_url: updatedUser.avatar_url || '',
                        is_staff: updatedUser.is_staff || ''
                    });
                })
                .catch((error) => {
                    // Handle error response
                    console.log(`Response else: ${JSON.stringify(error)}`);
                    setErrors(['Failed to update profile']);
                });

            setIsLoading(false);
            setSuccess('Profile updated successfuly!');
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors(['An error occurred while updating your profile']);
            setIsLoading(false);
        }


    };

    if (isLoading) {
        return (
            <IsLoading/>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.length > 0 && (
                    <div className="bg-red-100 text-red-700 p-3 rounded">
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
                {success && success.length > 0 && (
                    <div className="bg-green-100 text-green-700 p-3 rounded">
                        <p>{success}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {userData.avatar_url && (
                        <div className="relative w-32 h-32 m-auto">
                            <Image
                                src={userData.avatar_url}
                                alt="Profile"
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-50 file:text-green-700
                                hover:file:bg-green-100"
                            accept="image/*"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Name
                        </label>
                        <input
                            type="text"
                            value={userData.name}
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                            className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm
                                focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                        shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default Profile;