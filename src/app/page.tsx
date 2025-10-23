'use client';

import { useState, useRef, useEffect } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import PostCard from '@/components/PostCard';
import PostSkeleton from '@/components/PostSkeleton';
import { toggleLike, toggleRetweet, createPost } from '@/lib/api';
import { Post } from '@/types';
import { Image as ImageIcon, RefreshCw } from 'lucide-react';
import ImagePreview from '@/components/ImagePreview';

export default function Home() {
  const { posts, loading, hasMore, error, loadMore, refresh } = useInfiniteScroll();
  const [showCompose, setShowCompose] = useState(false);
  const [composeContent, setComposeContent] = useState('');
  const [composeImages, setComposeImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleLikeToggle = async (postId: number) => {
    await toggleLike(postId);
  };

  const handleRetweetToggle = async (postId: number) => {
    await toggleRetweet(postId);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (result && typeof result === 'string') {
            setComposeImages(prev => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setComposeImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitPost = async () => {
    if (!composeContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPost(composeContent, composeImages);
      setComposeContent('');
      setComposeImages([]);
      setShowCompose(false);
      refresh();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;

    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;

    // Only allow pull to refresh when at the top of the page
    if (window.scrollY === 0 && distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance * 0.5, 100)); // Cap at 100px with resistance
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await refresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setIsPulling(false);
    setPullDistance(0);
  };

  useEffect(() => {
    const handleGlobalTouchEnd = () => {
      if (isPulling) {
        handleTouchEnd();
      }
    };

    window.addEventListener('touchend', handleGlobalTouchEnd);
    return () => window.removeEventListener('touchend', handleGlobalTouchEnd);
  }, [isPulling, pullDistance, isRefreshing]);

  return (
    <div
      className="min-h-screen bg-white max-w-2xl mx-auto border-x border-gray-200"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center bg-white border-b border-gray-200 transition-transform duration-200"
        style={{
          transform: `translateY(${Math.max(0, pullDistance - 60)}px)`,
          height: `${Math.max(0, pullDistance)}px`,
        }}
      >
        {pullDistance > 0 && (
          <div className="flex items-center space-x-2 text-gray-600">
            <RefreshCw
              className={`transition-transform duration-200 ${
                isRefreshing ? 'animate-spin' : pullDistance > 60 ? 'rotate-180' : ''
              }`}
              size={20}
            />
            <span className="text-sm">
              {isRefreshing ? '새로고침 중...' : pullDistance > 60 ? '새로고침' : '당겨서 새로고침'}
            </span>
          </div>
        )}
      </div>

      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold">홈</h1>
        </div>
      </header>

      <main>
        <div className="border-b border-gray-200 p-4">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex-1">
              <textarea
                value={composeContent}
                onChange={(e) => setComposeContent(e.target.value)}
                placeholder="무슨 일이 일어나고 있나요?"
                className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 min-h-[56px]"
                maxLength={280}
                rows={2}
              />

              <ImagePreview
                images={composeImages}
                onRemove={handleRemoveImage}
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-3">
                  <label className="text-blue-500 hover:bg-blue-50 p-2 rounded-full cursor-pointer transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <ImageIcon size={20} />
                  </label>
                  <span className={`text-sm ${composeContent.length > 280 ? 'text-red-500' : 'text-gray-500'}`}>
                    {composeContent.length}/280
                  </span>
                </div>
                <button
                  onClick={handleSubmitPost}
                  disabled={!composeContent.trim() || composeContent.length > 280 || isSubmitting}
                  className="bg-blue-500 text-white px-4 py-1.5 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  {isSubmitting ? '게시 중...' : '게시하기'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 text-red-500 text-center">
            {error}
            <button onClick={refresh} className="ml-2 text-blue-500 hover:underline">
              다시 시도
            </button>
          </div>
        )}

        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLikeToggle={handleLikeToggle}
              onRetweetToggle={handleRetweetToggle}
            />
          ))}

          {loading && (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="p-8 text-center text-gray-500">
              더 이상 게시물이 없습니다
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
