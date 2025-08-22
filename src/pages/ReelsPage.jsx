import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiMovie } from "react-icons/bi";

const ReelsPage = () => {
  return (
    <ComingSoonPage
      icon={<BiMovie className="w-12 h-12 text-white" />}
      title="Reels Coming Soon!"
      subtitle="We're creating a space for short, engaging video content. Create and discover entertaining clips from creators you love."
      emoji="🎬"
      progress={50}
      accentColor="rose"
      statusCard={{
        icon: <BiMovie className="w-5 h-5 text-rose-600" />,
        text: "Video Features in Development",
      }}
    />
  );
};

export default ReelsPage;
