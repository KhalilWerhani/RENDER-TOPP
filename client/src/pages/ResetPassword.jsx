import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'


const ResetPassword = () => {

  const {backendUrl} = useContext(AppContent)
  axios.default.withCredentials = true 

  const navigate = useNavigate()
  const [email , setEmail ] = useState('')
  const [newPassword , setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setisOtpSubmited] = useState(false) 



   const inputRefs = React.useRef([])
    const handleInput = (e , index) => {
      if (e.target.value.length > 0 && index < inputRefs.current.length -1){
        inputRefs.current[index + 1].focus();
      }
    }
    const handleKeyDown = (e , index) =>{
      if(e.key === 'Backspace' &&  e.target.value === '' &&  index > 0){
        inputRefs.current[index - 1].focus();
  
      }
    }
  
    const handlePaste = (e)=> {
      const paste = e.clipboardData.getData('text')
      const pasteArray = paste.split('');
      pasteArray.forEach((char , index)=> {
        if(inputRefs.current[index]){
          inputRefs.current[index].value = char;
        }
      })
    }

    const onSubmitEmail = async (e)=>{
      e.preventDefault();
      try{
        const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp',{email})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success &&  setIsEmailSent(true)
      } catch(error) {
        toast.error(error.message)
      }
    } 

    const onSubmitOTP = async (e)=>{
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      setOtp(otpArray.join(''))
      setisOtpSubmited(true)

    }

    const onSubmitNewPassword = async (e) =>{
      e.preventDefault();
      try {
        const {data} = await axios.post(backendUrl + '/api/auth/reset-password' ,
        {email ,otp , newPassword})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && navigate('/login')
      } catch (error) {
        toast.error(data.message)
      }
    }
  


  return (
    <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-white-200 to-blue-500'>
       <img onClick={()=> navigate('/')} src={assets.logotopjuridique} alt="" className='absolute left-5 sm:left-20 top-5 w-35 sm:w-42 cursor-pointer'/>
       

  {/* Enter email id */}

  {!isEmailSent && 

    <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-100 text-sm'>
    <h1 className='text-white text-2xl font-semibold text-center mb-4'>Réinitialiser le mot de passe</h1>
    <p className='text-center mb-6 text-indigo-300'>Entrez votre adresse e-mail enregistrée</p>

    <div className='mb-5 flex items-center gap-3 w-full px-6 py-2.5 rounded-full bg-[#333A5C]'>
      <img src={assets.mail_icon} alt="" className='w-3 h-3' />
      <input type='email' placeholder='Identifiant de courrier électronique' 
      className='bg-transparent outline-none text-white'
      value={email} onChange={e => setEmail(e.target.value)} required/>
    </div>
    <button className='w-full py-3 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-full font-medium'>Soumettre</button>
    </form>
    
}
   {/*  otp input form */} {/* bg-gradient-to-r from-indigo-500 to-indigo-900 */}

   {!isOtpSubmited && isEmailSent && 
   <form onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-100 text-sm'>
              <h1 className='text-white text-2xl font-seminold text-center mb-4'>Réinitialiser le mot de passe OTP</h1>
              <p className='text-center mb-6 text-indigo-300'>Saisissez le code à 6 chiffres envoyé à votre adresse e-mail</p>

              <div className='flex justify-between mb-8' onPaste={handlePaste}>
                {Array(6).fill(0).map((_, index )=> (
                  <input type="text" maxLength={'1'} key={index} required 
                  className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' 
                  ref={e => inputRefs.current[index] = e} 
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e)=> handleKeyDown(e , index )}
                  />
                ))}
              </div>
              <button className='w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-full font-medium'>Soumettre</button>
             </form>
}
             { /* enter new pass */ }
  {isOtpSubmited && isEmailSent &&  
             <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-100 text-sm'>
    <h1 className='text-white text-2xl font-seminold text-center mb-4'>Nouveau mot de passe</h1>
    <p className='text-center mb-6 text-indigo-300'>Entrez le nouveau mot de passe ci-dessous</p>

    <div className='mb-5 flex items-center gap-3 w-full px-6 py-2.5 rounded-full bg-[#333A5C]'>
      <img src={assets.lock_icon} alt="" className='w-3 h-3' />
      <input type='password' placeholder='Nouveau mot de passe' 
      className='bg-transparent outline-none text-white'
      value={newPassword} onChange={e => setNewPassword(e.target.value)} required/>
    </div>
    <button className='w-full py-3 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-full font-medium'>Soumettre</button>
    </form>
}
    </div>
    
  )
}

export default ResetPassword
