import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiMessageDetail } from "react-icons/bi";

const MessagesPage = () => {
  return (
    <ComingSoonPage
      icon={<BiMessageDetail className="w-12 h-12 text-white" />}
      title="Messages Coming Soon!"
      subtitle="We're working on a messaging system to help you connect with friends and followers. Stay tuned for better communication!"
      emoji="💬"
      progress={100}
      bgColors={{ from: "blue-50", via: "indigo-50", to: "purple-50" }}
      iconColors={{ from: "blue-400", to: "green-400" }}
      accentColor="indigo"
      statusCard={{
        icon: <BiMessageDetail className="w-5 h-5 text-indigo-600" />,
        text: "Chat Features Coming Soon",
      }}
    />
  );
};

export default MessagesPage;
