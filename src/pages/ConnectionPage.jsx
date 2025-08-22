import { BiUserPlus } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi";
import ComingSoonPage from "../components/shared/ComingSoonPage";

const ConnectionPage = () => {
  return (
    <ComingSoonPage
      icon={<BiUserPlus className="w-12 h-12 text-white" />}
      title="Connections Coming Soon!"
      subtitle="We're building amazing networking features to help you connect with more people and grow your professional network."
      emoji="🤝"
      progress={65}
      bgColors={{ from: "blue-50", via: "indigo-50", to: "purple-50" }}
      iconColors={{ from: "blue-500", to: "purple-500" }}
      titleColors={{ from: "blue-600", to: "purple-600" }}
      accentColor="blue"
      statusCard={{
        icon: <HiOutlineUsers className="w-5 h-5 text-blue-500" />,
        text: "Networking Hub",
      }}
    />
  );
};

export default ConnectionPage;
