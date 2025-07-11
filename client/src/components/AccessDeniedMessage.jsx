import { assets } from "../assets/assets";

const AccessDeniedMessage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <img src={assets.error} alt="Page non trouvée" className="w-64 sm:w-80 md:w-200 object-contain" />
    </div>
  );
};

export default AccessDeniedMessage;
