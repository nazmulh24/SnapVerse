import React, { useEffect, useRef, useCallback } from "react";

const InfiniteScrollTrigger = ({
  onLoadMore,
  hasNextPage,
  isLoading,
  threshold = 200,
  children,
  className = "",
}) => {
  const triggerRef = useRef(null);
  const observerRef = useRef(null);

  const handleIntersect = useCallback(
    (entries) => {
      const [entry] = entries;

      if (entry.isIntersecting && hasNextPage && !isLoading) {
        onLoadMore();
      }
    },
    [hasNextPage, isLoading, onLoadMore]
  );

  useEffect(() => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    // Create intersection observer with threshold
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0.1,
    });

    observerRef.current.observe(trigger);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect, threshold]);

  return (
    <div ref={triggerRef} className={className}>
      {children}
    </div>
  );
};

export default InfiniteScrollTrigger;
