import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiHelpCircle, BiRocket } from "react-icons/bi";

const HelpCenterPage = () => {
  return (
    <ComingSoonPage
      icon={<BiHelpCircle className="w-12 h-12 text-white" />}
      title="Help Center Coming Soon!"
      subtitle="We're building a comprehensive Help Center with FAQs, tutorials, and support resources to assist you with all your questions."
      emoji="?"
      progress={75}
      accentColor="blue"
      statusCard={{
        icon: <BiRocket className="w-5 h-5 text-blue-600" />,
        text: "Launching Very Soon",
      }}
    />
  );
};

export default HelpCenterPage;
