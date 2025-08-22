import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiLineChart } from "react-icons/bi";

const AnalyticsPage = () => {
  return (
    <ComingSoonPage
      icon={<BiLineChart className="w-12 h-12 text-white" />}
      title="Analytics Dashboard Coming Soon!"
      subtitle="We're building powerful analytics tools to help you understand your audience and track your growth metrics comprehensively."
      emoji="📊"
      progress={70}
      accentColor="blue"
      statusCard={{
        icon: <BiLineChart className="w-5 h-5 text-blue-600" />,
        text: "Analytics Tools in Development",
      }}
    />
  );
};

export default AnalyticsPage;
