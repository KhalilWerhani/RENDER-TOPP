import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const handleStart = () => {
    if (userData?.user === 'admin') {
      navigate('/admin/dashboard1');
    } else {
      navigate('/homepage');
    }
  };

  return (
    <div className='flex flex-col items-center mt-25 px-4 text-center text-gray-800'>
      <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6 animate-bounce-custom' />

      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
        Salut {userData ? userData.name : 'tout le monde'}!
        <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
      </h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
        Bienvenue sur notre application
      </h2>

      <p className='mb-8 max-w-md'>
        Commençons par une visite rapide du service et nous vous mettrons en service en un rien de temps !
      </p>

      <button
        onClick={handleStart}
        className='bg-[#E0F2FE] border border-gray-500 rounded-full px-8 py-2.5 hover:bg-blue-100 transition-all'
      >
        Commencer
      </button>
    </div>
  );
};

export default Header;
