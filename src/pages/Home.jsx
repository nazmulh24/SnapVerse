import StoriesSection from "../components/HomeComponent/StoriesSection";
import PostsFeed from "../components/HomeComponent/PostsFeed";

const Home = () => {
  // Handle post interactions
  const handleLike = (postId, liked) => {
    console.log(`Post ${postId} ${liked ? "liked" : "unliked"}`);
    // In a real app, this would update the backend and state
  };

  const handleComment = (postId) => {
    console.log(`Comment on post ${postId}`);
    // In a real app, this would open comment modal or navigate to post detail
  };

  const handleShare = (postId) => {
    console.log(`Share post ${postId}`);
    // In a real app, this would open share options
  };

  const handleMenuClick = (postId) => {
    console.log(`Menu clicked for post ${postId}`);
    // In a real app, this would show post options menu
  };

  const handleViewComments = (postId) => {
    console.log(`View comments for post ${postId}`);
    // In a real app, this would navigate to comments view
  };

  return (
    <div className="max-w-2xl mx-auto p-2">
      {/* Stories Section */}
      <StoriesSection />

      {/* Posts Feed */}
      <PostsFeed
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onMenuClick={handleMenuClick}
        onViewComments={handleViewComments}
      />
    </div>
  );
};

export default Home;
