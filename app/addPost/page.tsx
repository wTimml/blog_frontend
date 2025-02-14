'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import apiService from "../services/apiServices";
import { getUserId } from "../lib/actions";

export default function AddPost() {

    const router = useRouter();
    const [formData, setFormData] = useState({ text: "" });
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    
    useEffect(() => {
        let isMounted = true;

        const initializeProfile = async () => {
            try {
                const userId = await getUserId();
                
                setUserId(userId);
        
                if (!userId) {
                    router.push('/login');
                    return
                }

                const userResponse = await apiService.get(`/api/auth/${userId}`)

                if (isMounted && (!userResponse.name || userResponse.name === "Unnamed User" || !userResponse.avatar_url)) {

                    alert('Please complete your profile')

                    router.push('/profile');
                }
                
            } catch (error) {
                if (isMounted) {
                    console.error('Error initializing profile:', error);
                    setErrors(['Failed to get user ID']);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        initializeProfile();

        // Cleanup function to prevent setting state on unmounted component
        return () => {
            isMounted = false;
        };
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData)
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        
        const response = await apiService.post('/api/posts/create/', JSON.stringify(formData));

        if (response.success) {
            console.log('SUCCESS');

            router.push('/');

        } else {
            console.log('Error');

            const tmpErrors: string[] = Object.values(response).map((error: any) => {
                return error;
            })

            setErrors(tmpErrors)
        }

        setIsLoading(false); // Stop loading
    };

    return (
        <div className="mx-auto py-16 flex justify-center">

            {errors.length > 0 && (
                <div className="bg-red-100 text-red-700 p-3 rounded">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}

            <form onSubmit={ handleSubmit } className="w-full max-w-4xl">
                <div className="max-w-4xl min-w-96 px-10 my-4 py-6 bg-white rounded-lg shadow-md dark:bg-slate-400" style={{ width: "50rem" }}>
                <textarea
                    name="text"
                    value={formData.text}
                    className="w-full h-40 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-200  text-black"
                    placeholder="Write your post here..."
                    onChange={handleChange}
                    required
                ></textarea>
                <button
                    className="mt-4 bg-white text-gray-800 font-bold rounded border-b-2 border-green-500 hover:border-green-600 hover:bg-green-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
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
                        <>
                          <span className="mr-2">Create Post</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                          </svg>
                        </>
                      )}
                </button>
                </div>
            </form>
        </div>
    )
}