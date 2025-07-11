import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaShieldAlt, FaBolt, FaPiggyBank } from 'react-icons/fa';
import Navbar from './Navbar';

const icons = {
  Simple: <FaCheckCircle className="text-blue-500 text-xl" />,
  Sûr: <FaShieldAlt className="text-blue-500 text-xl" />,
  Rapide: <FaBolt className="text-blue-500 text-xl" />,
  Économique: <FaPiggyBank className="text-blue-500 text-xl" />,
};

const IntroModification = ({ title, bulletPoints, ctaText, ctaLink }) => {
  return (
    <div>
      <Navbar/>
<section className="bg-gradient-to-br from-[#f4d47c] mt-50 via-yellow-200 to-orange-200 text-gray-900 rounded-xl p-8 shadow-lg max-w-6xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-3">{title}</h1>
      <p className="text-lg mb-6">Optez pour une structure adaptée à vos besoins.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {bulletPoints.map((point, index) => (
          <div key={index} className="bg-white text-black rounded-lg p-4 shadow-sm flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1">
              {icons[point.prefix]}
              <span className="font-semibold text-md">{point.prefix}</span>
            </div>
            <p className="text-sm">{point.text}</p>
          </div>
        ))}
      </div>

      <Link
        to={ctaLink}
        className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
      >
        {ctaText} →
      </Link>
    </section>
    </div>
  );
};

export default IntroModification;
