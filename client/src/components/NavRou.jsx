import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaHome } from 'react-icons/fa';

const NavRou = () => {
  const navigate = useNavigate();

  return (
    <div className='w-full flex justify-between items-center p-4 sm:px-12 shadow-md bg-white border-b border-white fixed top-0 z-50'>
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='Logo'
        className='w-36 sm:w-40 cursor-pointer'
      />

      <div className='flex items-center gap-4'>

        {/* Phone Button */}
        <a
          href='tel:0758421138'
          className='bg-sky-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-sky-900 '
        >
          <FaPhoneAlt className='text-white text-lg' />
          <span className='font-semibold text-sm'>07 58 42 11 38</span>
        </a>

        {/* Home Button */}
        <div
          className='bg-sky-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-sky-900 '
         
        >
          <FaHome size={20} className='text-white' />
          <span className='text-sm font-semibold'>Accueil</span>

         
        </div>
      </div>
    </div>
  );
};

export default NavRou;
