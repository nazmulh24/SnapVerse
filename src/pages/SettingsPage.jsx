import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiCog } from "react-icons/bi";

const SettingsPage = () => {
  return (
    <ComingSoonPage
      icon={<BiCog className="w-12 h-12 text-white" />}
      title="Settings Coming Soon!"
      subtitle="We're building comprehensive settings to help you customize your experience and control all your preferences in one place."
      emoji="⚙️"
      progress={55}
      accentColor="slate"
      statusCard={{
        icon: <BiCog className="w-5 h-5 text-slate-600" />,
        text: "Preference Controls in Development",
      }}
    />
  );
};

export default SettingsPage;
