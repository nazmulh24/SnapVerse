import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiTrendingUp } from "react-icons/bi";

const TrendingPage = () => {
  return (
    <ComingSoonPage
      icon={<BiTrendingUp className="w-12 h-12 text-white" />}
      title="Trending Content Coming Soon!"
      subtitle="Discover what's popular right now. We're building a space to showcase trending topics, hashtags, and viral content."
      emoji="🔥"
      progress={55}
      accentColor="pink"
      statusCard={{
        icon: <BiTrendingUp className="w-5 h-5 text-pink-600" />,
        text: "Discovery Features in Development",
      }}
    />
  );
};

export default TrendingPage;
