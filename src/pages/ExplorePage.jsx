import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiRocket } from "react-icons/bi";

const ExplorePage = () => {
  return (
    <ComingSoonPage
      icon={<BiRocket className="w-12 h-12 text-white" />}
      title="Explore Coming Soon!"
      subtitle="We're working on an Explore feature to help you discover new content and creators from around the world."
      emoji="🔍"
      progress={50}
      accentColor="orange"
      statusCard={{
        icon: <BiRocket className="w-5 h-5 text-orange-600" />,
        text: "Discovery Features Coming Soon",
      }}
    />
  );
};

export default ExplorePage;
