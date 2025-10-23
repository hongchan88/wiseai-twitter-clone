'use client';

import { useState } from 'react';
import { Post } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import Image from 'next/image';
import ImageModal from './ImageModal';

interface PostCardProps {
  post: Post;
  onLikeToggle: (postId: number) => Promise<void>;
  onRetweetToggle: (postId: number) => Promise<void>;
}

export default function PostCard({ post, onLikeToggle, onRetweetToggle }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isRetweeted, setIsRetweeted] = useState(post.isRetweeted);
  const [retweetsCount, setRetweetsCount] = useState(post.retweets);
  const [isLiking, setIsLiking] = useState(false);
  const [isRetweeting, setIsRetweeting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;
    const newIsLiked = !isLiked;
    const newLikesCount = likesCount + (newIsLiked ? 1 : -1);

    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);

    try {
      await onLikeToggle(post.id);
    } catch (error) {
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRetweet = async () => {
    if (isRetweeting) return;

    setIsRetweeting(true);
    const originalIsRetweeted = isRetweeted;
    const originalRetweetsCount = retweetsCount;
    const newIsRetweeted = !isRetweeted;
    const newRetweetsCount = retweetsCount + (newIsRetweeted ? 1 : -1);

    setIsRetweeted(newIsRetweeted);
    setRetweetsCount(newRetweetsCount);

    try {
      await onRetweetToggle(post.id);
    } catch (error) {
      setIsRetweeted(originalIsRetweeted);
      setRetweetsCount(originalRetweetsCount);
    } finally {
      setIsRetweeting(false);
    }
  };

  const handleImageClick = (index: number = 0) => {
    setModalInitialIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 p-4">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Image
            src={post.author.profileImage}
            alt={post.author.name}
            width={48}
            height={48}
            className="rounded-full"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-gray-900 hover:underline cursor-pointer">
              {post.author.name}
            </span>
            {post.author.verified && (
              <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
              </svg>
            )}
            <span className="text-gray-500">@{post.author.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{formatRelativeTime(post.createdAt)}</span>
          </div>

          <div className="mt-2 text-gray-900 whitespace-pre-wrap">
            {post.content}
          </div>

          {post.images.length > 0 && (
            <div
              className="mt-3 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => handleImageClick(0)}
            >
              <Image
                src={post.images[0]}
                alt="Post image"
                width={500}
                height={300}
                className="w-full object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-4 max-w-md">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm">{post.comments}</span>
            </button>

            <button
              onClick={handleRetweet}
              disabled={isRetweeting}
              className={`flex items-center space-x-2 transition-colors group ${
                isRetweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
              }`}
            >
              <div className={`p-2 rounded-full transition-colors ${
                isRetweeted ? 'bg-green-50' : 'group-hover:bg-green-50'
              }`}>
                <Repeat2 size={18} />
              </div>
              <span className="text-sm">{retweetsCount}</span>
            </button>

            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-2 transition-colors group ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <div className={`p-2 rounded-full transition-colors ${
                isLiked ? 'bg-red-50' : 'group-hover:bg-red-50'
              }`}>
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              </div>
              <span className="text-sm">{likesCount}</span>
            </button>

            <button className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors">
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={post.images}
        initialIndex={modalInitialIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}