import { useState, useEffect, useCallback } from 'react';
import { fetchPosts } from '@/lib/api';
import { Post } from '@/types';

export function useInfiniteScroll() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async (pageNum: number) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const newPosts = await fetchPosts(pageNum, 10);

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
        setHasMore(newPosts.length === 10);
      }
    } catch (err) {
      setError('게시물을 불러오는데 실패했습니다.');
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(nextPage);
    }
  }, [loading, hasMore, page, loadPosts]);

  const refresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    loadPosts(1);
  }, [loadPosts]);

  useEffect(() => {
    loadPosts(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop
          >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return {
    posts,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}