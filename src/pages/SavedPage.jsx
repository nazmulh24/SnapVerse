import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiBookmark } from "react-icons/bi";

const SavedPage = () => {
  return (
    <ComingSoonPage
      icon={<BiBookmark className="w-12 h-12 text-white" />}
      title="Saved Items Coming Soon!"
      subtitle="We're working on a Saved Items feature to help you organize your favorite content for easy access later."
      emoji="🔖"
      progress={40}
      accentColor="purple"
      statusCard={{
        icon: <BiBookmark className="w-5 h-5 text-purple-600" />,
        text: "Collection Features Coming Soon",
      }}
    />
  );
};

export default SavedPage;
