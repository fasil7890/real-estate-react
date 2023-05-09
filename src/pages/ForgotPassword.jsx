import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
 
  const [email,setEmail] = useState("")
  const onChange=(e)=>{
setEmail(e.target.value)
}
async function onSubmit(e){
   e.preventDefault()
   try {
    const auth = getAuth()
    await sendPasswordResetEmail(auth,email)
    toast.success("Email was sent")
   } catch (error) {
    toast.error("Could not send reset password")
   }
  
  }
  return (
<section>
  <h1 className='text-3xl text-center mt-6 font-bold'>Forgot Password</h1>
  <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto '>
    <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
      <img src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?w=2000" alt="sign-in" className='w-full rounded-2xl' />
    </div>
    <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
      <form onSubmit={onSubmit} >
        <input className='w-full mb-6 px-4 py-2 text-xl text-gray-500 bg-white border-gray-400 rounded transition ease-in-out' type="email" id="email" value={email} onChange={onChange} placeholder='Please Enter Your Email' />
       
        <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
          <p className='mb-6'> 
          <Link className='text-red-700 hover:text-red-800 transition duration-200 ease-in-out ml-1' to={"/sign-up"}>Register</Link>
          </p>
          <p>
            <Link className='text-blue-700 hover:text-blue-800 transition duration-200 ease-in-out ml-1' to={"/sign-in"}>Sign In</Link>
          </p>
        </div>
        <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-2xl active:bg-blue-900' type='submit'>Send Reset Password </button>
      <div className='my-4 flex items-center before:border-t before:flex-1 before:border-gray-500 after:border-t after:flex-1 after:border-gray-500'>
        <p className='text-center font-semibold mx-4'>OR</p>
      </div>
      <OAuth/>
      </form>
      
    </div>
    
  </div>
</section>
  )
}

export default ForgotPassword