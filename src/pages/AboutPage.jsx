import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiInfoCircle, BiRocket, BiHistory, BiGroup } from "react-icons/bi";

const AboutPage = () => {
  return (
    <ComingSoonPage
      icon={<BiInfoCircle className="w-12 h-12 text-white" />}
      title="About Coming Soon!"
      subtitle="We're crafting a beautiful page to share our journey, mission, values, and the amazing team behind SnapVerse."
      emoji="📜"
      progress={90}
      accentColor="blue"
      statusCard={{
        icon: <BiRocket className="w-5 h-5 text-blue-600" />,
        text: "Launching Very Soon",
      }}
    />
  );
};

export default AboutPage;
