// src/components/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AsideBarUser from '../pages/user/AsideBarUser';
const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isScrolled={true} />

      <div className="flex pt-16">
        {/* AsideBar à gauche */}
        <AsideBarUser />

        {/* Contenu principal à droite */}
        <main className="ml-64 p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
