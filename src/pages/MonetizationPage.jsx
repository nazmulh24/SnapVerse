import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiDollar } from "react-icons/bi";

const MonetizationPage = () => {
  return (
    <ComingSoonPage
      icon={<BiDollar className="w-12 h-12 text-white" />}
      title="Monetization Coming Soon!"
      subtitle="We're creating tools to help creators earn from their content through multiple revenue streams and partnerships."
      emoji="💰"
      progress={30}
      accentColor="green"
      statusCard={{
        icon: <BiDollar className="w-5 h-5 text-green-600" />,
        text: "Creator Earnings in Development",
      }}
    />
  );
};

export default MonetizationPage;
