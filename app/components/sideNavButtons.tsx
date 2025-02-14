'use client'

import { GetUserById } from "../lib/getUserById";
import { MdManageSearch } from "react-icons/md";

import { MdHomeFilled, MdAccountCircle } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { RiAddCircleFill } from "react-icons/ri";

// Define the props for the ManagerButton component
type ManagerButtonProps = {
    name: string;
    url: string;

};

export default function SideNavButtons({ ...props }: ManagerButtonProps){

    const {userData} = GetUserById();

    
    const icon = () => {
        switch(props.name) {
            case 'Manager':
                return <MdManageSearch />
            case 'Profile':
                return <MdAccountCircle/>
            case 'New post':
                return <RiAddCircleFill/>
            case 'Home':
                return <MdHomeFilled/>
            case 'New post':
                return <RiAddCircleFill/>
            default:
                return null;
        }
    }
    // Determine if the button should be disabled or have a different URL
    if (props.name == 'Manager' && !userData?.is_staff) {
        return
    } else {

        return (
            <li className="ml-6 h-8">
                <a
                    href={props.url}
                    className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 'text-gray-500 dark:text-white hover:text-gray-800'
                    } js-toggle-modal`}
                >
                    <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-pink-600">
                        {icon()}
                    </span>
                    <span className="text-sm font-medium">{props.name}</span>
                </a>
            </li>
        );
    }
   
}