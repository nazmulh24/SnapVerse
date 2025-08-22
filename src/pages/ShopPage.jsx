import ComingSoonPage from "../components/shared/ComingSoonPage";
import { BiStore } from "react-icons/bi";

const ShopPage = () => {
  return (
    <ComingSoonPage
      icon={<BiStore className="w-12 h-12 text-white" />}
      title="Shop Coming Soon!"
      subtitle="We're building a vibrant marketplace where you can buy, sell, and discover unique digital and physical items."
      emoji="🛒"
      progress={35}
      accentColor="orange"
      statusCard={{
        icon: <BiStore className="w-5 h-5 text-orange-600" />,
        text: "Commerce Features in Development",
      }}
    />
  );
};

export default ShopPage;
