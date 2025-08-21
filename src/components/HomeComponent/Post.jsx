import React from "react";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostActions from "./PostActions";
import PostContent from "./PostContent";

const Post = ({
  post,
  onLike,
  onComment,
  onShare,
  onMenuClick,
  onViewComments,
}) => {
  const handleDoubleClickLike = () => {
    if (onLike && !post.isLiked) {
      onLike(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      {/* Post Header */}
      <PostHeader
        user={post.user}
        timeAgo={post.timeAgo}
        onMenuClick={() => onMenuClick && onMenuClick(post.id)}
      />

      {/* Post Image */}
      <PostImage
        src={post.image}
        alt={`Post by ${post.user.username}`}
        onDoubleClick={handleDoubleClickLike}
      />

      {/* Post Actions */}
      <PostActions
        initialLikes={post.likesCount}
        isLiked={post.isLiked}
        onLike={(liked) => onLike && onLike(post.id, liked)}
        onComment={() => onComment && onComment(post.id)}
        onShare={() => onShare && onShare(post.id)}
      />

      {/* Post Content */}
      <PostContent
        caption={post.caption}
        username={post.user.username}
        commentsCount={post.commentsCount}
        onViewComments={() => onViewComments && onViewComments(post.id)}
      />
    </div>
  );
};

export default Post;
