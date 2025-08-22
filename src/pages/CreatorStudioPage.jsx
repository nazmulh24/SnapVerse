import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiMoviePlay } from "react-icons/bi";

const CreatorStudioPage = () => {
  return (
    <ComingSoonPage
      icon={<BiMoviePlay className="w-12 h-12 text-white" />}
      title="Creator Studio Coming Soon!"
      subtitle="We're building powerful tools for content creators to manage, edit, and analyze their content all in one place."
      emoji="🎬"
      progress={60}
      accentColor="purple"
      statusCard={{
        icon: <BiMoviePlay className="w-5 h-5 text-purple-600" />,
        text: "Creator Tools in Development",
      }}
    />
  );
};

export default CreatorStudioPage;
