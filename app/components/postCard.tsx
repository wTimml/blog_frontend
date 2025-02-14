import Link from "next/link";
import Image from "next/image";

import { PostType } from "./feedList"; 

interface PostCardProps {
    show_detail_link?: boolean;
}

interface PostProps {
    post: PostType
}

type CombinedProps = PostProps & PostCardProps;

const PostCard: React.FC<CombinedProps> = ({
    post,
    show_detail_link = false
}) => {

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    let urlToUse = post.author_avatar;
    if (!urlToUse.includes('localhost')) { 
        urlToUse = 'http://localhost:8000' + urlToUse
    }

    return(
        <div className="max-w-4xl min-w-96 px-10 my-4 py-6 bg-white rounded-lg shadow-md dark:bg-slate-400" style={{width:"50rem"}}>
            <div className="flex justify-end items-center">
                <span className="font-light text-gray-600 dark:text-white">{formatDate(post.date)}</span>
            </div>
            <div className="mt-2">
                {/* <p className="mt-2 text-gray-600 dark:text-white">{{ post.text }}</p> */}
                <p className="mt-2 text-gray-600 dark:text-white">{post.text}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
                {show_detail_link ? (
                    <Link className="text-blue-600 hover:underline" href={`/details/${post.id}`}>
                        Read more
                    </Link>
                ) : (
                    <span>&nbsp;</span>
                )}
                <div>
                    <a className="flex items-center" href="{% url 'profiles:detail' post.author.username %}">
                            <Image 
                                className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block"
                                width={"373"}
                                height={"373"}
                                src={`${urlToUse}`}
                                alt="avatar"
                            />
                        {/* <h1 className="text-gray-700 font-bold">{{ post.author.username }}</h1> */}
                        <h1 className="text-gray-700 font-bold">{post.author_name}</h1>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default PostCard;
