import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { assets } from "../assets/assets";
import DemarchesSection from "../pages/DemarcheSection";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <div className="flex pt-19"> {/* Adjusted for Navbar height */}
        <Sidebar />
        <div className="flex flex-col flex-1">
          
          {/* Welcome Section */}
          <section className="w-full bg-blue-100  border-b border-blue-200 shadow-sm py-8 px-4 text-center text-2xl font-semibold text-blue-900">
            Bienvenue sur votre tableau de bord 👋
          </section>
         


          <main className="w-full bg-gradient-to-br from-blue-50 to- p-6">
            <Outlet />

            {/* Expert Block */}
            <div className="bg-white shadow-md rounded-2xl ml-10 max-w-xl mx-auto p-6 mt-10">
              <img
                src={assets.person_icon}
                alt="Expert"
                className="w-32 h-32 rounded-full border border-blue-200 mx-auto"
              />
              <div className="text-center mt-4">
                <h2 className="text-xl font-semibold text-gray-800">Jean Dupont</h2>
                <p className="text-blue-700 mt-1">
                  Expert en création d'entreprise, disponible pour vous conseiller.
                </p>
                <a
                  href="tel:+33123456789"
                  className="block mt-2 text-blue-600 hover:underline flex items-center justify-center gap-2"
                >
                  <img src={assets.phone_icone} className="w-6 h-6" alt="Phone Icon" />
                  +33 1 23 45 67 89
                </a>
                <button
                  onClick={() => (window.location.href = "/dashbord/calendrier")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200"
                >
                  Voir disponibilité
                </button>
              </div>
            </div>

            {/* Demarches Section */}
            <DemarchesSection />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
