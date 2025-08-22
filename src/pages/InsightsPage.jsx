import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiLineChart } from "react-icons/bi";

const InsightsPage = () => {
  return (
    <ComingSoonPage
      icon={<BiLineChart className="w-12 h-12 text-white" />}
      title="Insights Coming Soon!"
      subtitle="We're building advanced analytics and insights tools to help you understand your audience and content performance better."
      emoji="📈"
      progress={60}
      accentColor="teal"
      statusCard={{
        icon: <BiLineChart className="w-5 h-5 text-teal-600" />,
        text: "Data Insights in Development",
      }}
    />
  );
};

export default InsightsPage;
