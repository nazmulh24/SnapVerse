import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiLock } from "react-icons/bi";

const PrivacyPage = () => {
  return (
    <ComingSoonPage
      icon={<BiLock className="w-12 h-12 text-white" />}
      title="Privacy Center Coming Soon!"
      subtitle="We're building comprehensive privacy controls to help you manage your data and privacy preferences with full transparency."
      emoji="🔑"
      progress={65}
      accentColor="gray"
      statusCard={{
        icon: <BiLock className="w-5 h-5 text-gray-600" />,
        text: "Privacy Controls in Development",
      }}
    />
  );
};

export default PrivacyPage;
