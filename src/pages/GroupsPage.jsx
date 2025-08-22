import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiGroup } from "react-icons/bi";

const GroupsPage = () => {
  return (
    <ComingSoonPage
      icon={<BiGroup className="w-12 h-12 text-white" />}
      title="Groups Coming Soon!"
      subtitle="Connect with like-minded people in communities built around shared interests, hobbies, and goals."
      emoji="👥"
      progress={55}
      accentColor="cyan"
      statusCard={{
        icon: <BiGroup className="w-5 h-5 text-cyan-600" />,
        text: "Community Features in Development",
      }}
    />
  );
};

export default GroupsPage;
