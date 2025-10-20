export interface User {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  verified: boolean;
}

export interface Post {
  id: number;
  author: User;
  content: string;
  images: string[];
  createdAt: string;
  likes: number;
  retweets: number;
  comments: number;
  isLiked: boolean;
  isRetweeted: boolean;
}