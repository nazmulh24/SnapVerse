import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiShield } from "react-icons/bi";

const SecurityPage = () => {
  return (
    <ComingSoonPage
      icon={<BiShield className="w-12 h-12 text-white" />}
      title="Security Center Coming Soon!"
      subtitle="We're building advanced security features to protect your account, data, and privacy with the latest security measures."
      emoji="🔒"
      progress={70}
      accentColor="red"
      statusCard={{
        icon: <BiShield className="w-5 h-5 text-red-600" />,
        text: "Security Features Coming Soon",
      }}
    />
  );
};

export default SecurityPage;
