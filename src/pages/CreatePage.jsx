import { BiPlusCircle } from "react-icons/bi";
import { HiOutlinePencil } from "react-icons/hi";
import ComingSoonPage from "../components/shared/ComingSoonPage";

const CreatePage = () => {
  return (
    <ComingSoonPage
      icon={<BiPlusCircle className="w-12 h-12 text-white" />}
      title="Create Coming Soon!"
      subtitle="We're building amazing creation tools to help you share your ideas and content with the world."
      emoji="✏️"
      progress={78}
      accentColor="purple"
      statusCard={{
        icon: <HiOutlinePencil className="w-5 h-5 text-purple-500" />,
        text: "Creative Studio",
      }}
    />
  );
};

export default CreatePage;
