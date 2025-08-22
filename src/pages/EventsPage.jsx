import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiCalendarEvent } from "react-icons/bi";

const EventsPage = () => {
  return (
    <ComingSoonPage
      icon={<BiCalendarEvent className="w-12 h-12 text-white" />}
      title="Events Feature Coming Soon!"
      subtitle="We're building a powerful events platform to help you discover and organize social gatherings seamlessly."
      emoji="🎉"
      progress={45}
      accentColor="emerald"
      statusCard={{
        icon: <BiCalendarEvent className="w-5 h-5 text-emerald-600" />,
        text: "Event Planning Tools in Development",
      }}
    />
  );
};

export default EventsPage;
