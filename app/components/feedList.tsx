'use client';

import { useEffect, useState } from "react";
import PostCard from "./postCard"
import apiService from "../services/apiServices";
import Loading from "../loading";

export type PostType = {
    id: string;
    text: string
    author: string
    author_name: string
    author_avatar: string
    date: string
}

export default function PostList() {

    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const posts = await apiService.get(`/api/posts/`);
          setPosts(posts.data);
        } catch (error) {
          console.error('Error fetching post:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPosts();
    }, []);
    
    if (loading) return <Loading/>;
    if (!posts) return <div></div>;
    
    return (

        <>
            {posts
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort posts by date (newest first)
            .map((post) => {
                return (
                    <PostCard 
                        key={post.id}
                        post={post}
                        show_detail_link={true}
                    />
                )
            })
            }
        </>


    );
}
