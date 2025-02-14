import DarkModeToggle from "@/app/components/darkModeToggle";

import { FiLogIn } from "react-icons/fi";
import LogoutButton from './logoutButton'
import { getUserId } from "../lib/actions";
import SideNavButtons from "./sideNavButtons";



const SideBar = async () => {

    const userId = await getUserId();

    return (
        <div className="h-screen sticky top-0 flex flex-col w-56 bg-white dark:bg-slate-400 rounded-r-3xl overflow-hidden">
            <div className="flex items-center justify-center h-20 shadow-md">
                <h1 className="text-3xl uppercase text-pink-600 transform hover:text-4xl ease-in duration-200">Blog</h1>
            </div>
            <ul className="flex flex-col py-4">
            <li className="mx-auto h-8 pt-2">
                <a className="hover:cursor-pointer transform hover:translate-x-2 transition-transform ease-in duration-200">
                    <DarkModeToggle/>
                </a>
            </li>
            <SideNavButtons name='Home' url='/' />

            {userId ? (
                <>
                    <SideNavButtons name='New post' url='/addPost' />
                    <SideNavButtons name='Profile' url='/profile' />
                    <SideNavButtons name='Manager' url='/manager' />
                    <li className="ml-6 h-8">
                        <LogoutButton/>
                    </li>
                </>
            ) : (
                <li className="ml-6 h-8">
                    <a href={"/login"} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 dark:text-white hover:text-gray-800">
                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-pink-600"><FiLogIn /></span>
                    <span className="text-sm font-medium">Login</span>
                    </a>
                </li>
            )}
            </ul>
        </div>
    )
}

export default SideBar;