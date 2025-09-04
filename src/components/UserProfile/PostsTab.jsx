import React from "react";
import Post from "../HomeComponent/Post";
import InfiniteScrollTrigger from "../shared/InfiniteScrollTrigger";
import LoadingSpinner from "../shared/LoadingSpinner";

const PostsTab = ({
  userPosts,
  loading,
  isLoadingProfile,
  loadingUserPosts,
  hasNextPage,
  isOwnProfile,
  fullName,
  handleLike,
  handleComment,
  handleShare,
  loadMorePosts,
}) => {
  return (
    // <div className="px-8 py-6">
    //   <h3 className="text-lg font-semibold text-slate-900 mb-4">
    //     {isOwnProfile ? "My Posts" : `${fullName}'s Posts`}
    //   </h3>
    //   {(loading || isLoadingProfile || loadingUserPosts) &&
    //   (!userPosts || userPosts.length === 0) ? (
    //     <div className="flex justify-center py-12">
    //       <LoadingSpinner />
    //     </div>
    //   ) : userPosts && userPosts.length > 0 ? (
    //     <div className="space-y-6">
    //       {userPosts.map((post) => (
    //         <Post
    //           key={post.id}
    //           post={post}
    //           onLike={onLike}
    //           onComment={onComment}
    //           onShare={onShare}
    //         />
    //       ))}
    //       {hasNextPage && (
    //         <InfiniteScrollTrigger loading={loading} onLoadMore={onLoadMore} />
    //       )}
    //     </div>
    //   ) : (
    //     <div className="text-center py-12">
    //       <div className="text-gray-400 text-lg mb-2">No posts yet</div>
    //       <p className="text-gray-500">
    //         {isOwnProfile
    //           ? "Share your first post to get started!"
    //           : `${fullName} hasn't shared any posts yet.`}
    //       </p>
    //     </div>
    //   )}
    //   </div>
    //--> Posts activeTab
    <div className="px-8 py-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        {isOwnProfile ? "My Posts" : `${fullName}'s Posts`}
      </h3>
      {(loading || isLoadingProfile || loadingUserPosts) &&
      (!userPosts || userPosts.length === 0) ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : userPosts && userPosts.length > 0 ? (
        <div className="space-y-6">
          {userPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}
          {hasNextPage && (
            <InfiniteScrollTrigger
              loading={loading}
              onLoadMore={loadMorePosts}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No posts yet</div>
          <p className="text-gray-500">
            {isOwnProfile
              ? "Share your first post to get started!"
              : `${fullName} hasn't shared any posts yet.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PostsTab;
