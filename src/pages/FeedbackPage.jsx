import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiMessageDetail, BiRocket } from "react-icons/bi";

const FeedbackPage = () => {
  return (
    <ComingSoonPage
      icon={<BiMessageDetail className="w-12 h-12 text-white" />}
      title="Feedback Coming Soon!"
      subtitle="We're building a space for you to share your thoughts and suggestions to help us make SnapVerse even better."
      emoji="💬"
      progress={80}
      accentColor="green"
      statusCard={{
        icon: <BiRocket className="w-5 h-5 text-green-600" />,
        text: "Launching Very Soon",
      }}
    />
  );
};

export default FeedbackPage;
