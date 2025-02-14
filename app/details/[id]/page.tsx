'use client'

import { use, useEffect, useState } from 'react';
import { PostType } from "@/app/components/feedList";
import PostCard from "@/app/components/postCard"
import apiService from "@/app/services/apiServices";
import Loading from '../../loading';

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = use(params);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiService.get(`/api/posts/${id}`);
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <Loading/>;
  if (!post) return <div></div>;

  return (
    <div className="mx-auto py-16">
      <div>
        <PostCard 
          post={post}
          show_detail_link={false}
        />
      </div>
    </div>
  );
}