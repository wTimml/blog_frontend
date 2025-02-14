'use client';

import { useRouter } from "next/navigation";
import { resetAuthCookies } from "../lib/actions";
import { FiLogOut  } from "react-icons/fi";

const LogoutButton: React.FC = () => {
    const router = useRouter();

    const handleLogout = async (event: React.MouseEvent) => {
        event.preventDefault();
        
        try {
            await resetAuthCookies();
            router.push('/');

        } catch (error) {
            console.error('Logout failed:', error);
            // Handle error
        }
    }

    return (
        <a onClick={handleLogout} href="#" className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 dark:text-white hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-pink-600"><FiLogOut /></span>
            <span className="text-sm font-medium">Logout</span>
        </a>
    )
}

export default LogoutButton;