import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiPieChartAlt } from "react-icons/bi";

const AdsManagerPage = () => {
  return (
    <ComingSoonPage
      icon={<BiPieChartAlt className="w-12 h-12 text-white" />}
      title="Ads Manager Coming Soon!"
      subtitle="We're building powerful advertising tools to help you reach your target audience and grow your business effectively."
      emoji="📣"
      progress={45}
      accentColor="yellow"
      statusCard={{
        icon: <BiPieChartAlt className="w-5 h-5 text-yellow-600" />,
        text: "Ad Campaign Tools in Development",
      }}
    />
  );
};

export default AdsManagerPage;
