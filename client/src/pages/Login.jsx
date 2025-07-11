import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData,setShowLoginModal  } = useContext(AppContent);

  const [state, setState] = useState("Se connecter");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      if (state === "S'inscrire") {
        const res = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
          phone,
        });

        if (res.data.success) {
          toast.success("Inscription réussie. Vous pouvez maintenant vous connecter.");
          setState("Se connecter");
        } else {
          toast.error(res.data.message);
        }
        return;
      }

      const res = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

      if (res.data.success) {
        setIsLoggedin(true);
        await getUserData();
        setShowLoginModal(false);
        const role = res.data.user.role;

        if (role === "admin") {
          navigate('/admin/dashboard1');
        } else if (role === "BO") {
          navigate('/bo/dashboard');
        } else  if (role === "user") {
          navigate('/dashboarduser');
        } else {
          navigate('/');
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la connexion");
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-white'>
      <img onClick={() => navigate('/')} src={assets.logotopjuridique} alt="logo" className='absolute left-5 sm:left-20 top-5 w-35 sm:w-42 cursor-pointer' />

      <div className='bg-slate-900 p-10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full sm:w-100 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === "S'inscrire" ? "Créez votre compte" : "Se connecter"}
        </h2>

        <p className='text-center text-sm mb-6'>
          {state === "S'inscrire" ? "Créer un compte" : "Connectez-vous à votre compte!"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "S'inscrire" && (
            <div className='mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt='' />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none'
                type='text'
                placeholder='Nom et prénom'
                required
              />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='' />
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none'
              type='email'
              placeholder="Identifiant de courrier électronique"
              required
            />
          </div>

          <div className='mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='' />
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none'
              type='password'
              placeholder='Mot de passe'
              required
            />
          </div>

          {state === "S'inscrire" && (
            <div className='mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img className='w-4' src={assets.phone_icone} alt='' />
              <input
                onChange={e => setPhone(e.target.value)}
                value={phone}
                className='bg-transparent outline-none'
                type='text'
                placeholder='Numéro de téléphone'
                required
              />
            </div>
          )}

          <p
            onClick={() => navigate('/reset-password')}
            className='mb-4 text-blue-500 cursor-pointer'
          >
            Mot de passe oublié
          </p>

          <button
            type='submit'
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-800 text-white font-medium'
          >
            {state}
          </button>
        </form>

        <p className='text-gray-400 text-center text-xs mt-4'>
          {state === "S'inscrire" ? (
            <>
              Vous avez déjà un compte ?{' '}
              <span
                onClick={() => setState('Se connecter')}
                className='text-blue-400 cursor-pointer underline'
              >
                Connectez-vous ici
              </span>
            </>
          ) : (
            <>
              Vous n'avez pas de compte ?{' '}
              <span
                onClick={() => setState("S'inscrire")}
                className='text-blue-400 cursor-pointer underline'
              >
                S'inscrire ici
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
