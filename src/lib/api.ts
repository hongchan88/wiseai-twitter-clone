import { Post } from '@/types';
import { mockPosts } from './data';

export const fetchPosts = async (page: number = 1, limit: number = 10): Promise<Post[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return mockPosts.slice(startIndex, endIndex);
};

export const toggleLike = async (postId: number): Promise<{ success: boolean; isLiked: boolean; likes: number }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const post = mockPosts.find(p => p.id === postId);
  if (post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    return { success: true, isLiked: post.isLiked, likes: post.likes };
  }
  return { success: false, isLiked: false, likes: 0 };
};

export const toggleRetweet = async (postId: number): Promise<{ success: boolean; isRetweeted: boolean; retweets: number }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const post = mockPosts.find(p => p.id === postId);
  if (post) {
    post.isRetweeted = !post.isRetweeted;
    post.retweets += post.isRetweeted ? 1 : -1;
    return { success: true, isRetweeted: post.isRetweeted, retweets: post.retweets };
  }
  return { success: false, isRetweeted: false, retweets: 0 };
};

export const createPost = async (content: string, images: string[] = []): Promise<{ success: boolean; post?: Post }> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const newPost: Post = {
    id: mockPosts.length + 1,
    author: {
      id: "user123",
      name: "내 이름",
      username: "myusername",
      profileImage: "https://picsum.photos/40/40?random=99",
      verified: false
    },
    content,
    images,
    createdAt: new Date().toISOString(),
    likes: 0,
    retweets: 0,
    comments: 0,
    isLiked: false,
    isRetweeted: false,
  };

  mockPosts.unshift(newPost);
  return { success: true, post: newPost };
};