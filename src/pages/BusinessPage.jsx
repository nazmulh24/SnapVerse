import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiBriefcase } from "react-icons/bi";

const BusinessPage = () => {
  return (
    <ComingSoonPage
      icon={<BiBriefcase className="w-12 h-12 text-white" />}
      title="Business Tools Coming Soon!"
      subtitle="We're building a suite of professional tools to help businesses connect with their audience and grow their presence effectively."
      emoji="💼"
      progress={50}
      accentColor="blue"
      statusCard={{
        icon: <BiBriefcase className="w-5 h-5 text-blue-600" />,
        text: "Business Suite in Development",
      }}
    />
  );
};

export default BusinessPage;
