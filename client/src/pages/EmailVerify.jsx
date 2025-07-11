import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


const EmailVerify = () => {

axios.defaults.withCredentials = true; 
const {backendUrl , isLoggedin , userData , getUserData}= useContext(AppContent)
const navigate = useNavigate() 

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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')
      const {data} = await axios.post( backendUrl + '/api/auth/verify-account', {otp})             
      if(data.succes){
        toast.success(data.message)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  } 

  
  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedin , userData])

  return (
    <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-white-200 to-blue-500'>
             <img onClick={()=> navigate('/')} src={assets.logotopjuridique} alt="" className='absolute left-5 sm:left-20 top-5 w-35 sm:w-42 cursor-pointer'/>
             <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-100 text-sm'>
              <h1 className='text-white text-2xl font-seminold text-center mb-4'>Vérification de l'OTP par e-mail</h1>
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
              <button className='w-full py-3 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-full font-medium'>Verify email</button>
             </form>
      

    </div>
  )
}

export default EmailVerify
