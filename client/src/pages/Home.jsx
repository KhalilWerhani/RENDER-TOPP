import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import NavbarAdmin from './admin/NavbarAdmin';
import Header from '../components/Header';
import LoadingPage from '../components/LoadingPage';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [loading, setLoading] = useState(true);
  const { userData, setuserData, backendUrl } = useContext(AppContent);
  const navigate = useNavigate();


  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data', {
        withCredentials: true,
      });
      console.log("getUserData", data);
      if (data.success) {
        setuserData(data.userData);

      } else {
       // toast.error(data.message);
      }

       

    } catch (error) {
      toast.error("Erreur lors de la récupération des données");
    }
  };

    useEffect(() => {
    getUserData();
    const timer = setTimeout(() => {
      setLoading(false);
      navigate('/home'); // Redirect after loading
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);


  if (loading) return <LoadingPage />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white bg-cover bg-center">
      {userData?.user === 'admin' ? <NavbarAdmin /> : <Navbar />}
      <Header />
    </div>
  );
};

export default Home;
