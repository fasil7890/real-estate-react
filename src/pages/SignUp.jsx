import React, { useState } from 'react';
import {AiFillEyeInvisible,AiFillEye} from "react-icons/ai";
import { Link,useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import {getAuth,createUserWithEmailAndPassword,updateProfile} from "firebase/auth";
import {db} from "../firebase";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate()
  const [showPassword,setShowPassword] = useState(false)
  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:"",
  })
  const onChange=(e)=>{
setFormData((prevState)=>({
  ...prevState,
  [e.target.id]:e.target.value
}))
  }
  const {name,email,password} = formData;
async function onSubmit(e){
   e.preventDefault()

   try {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth,email,password)
    updateProfile(auth.currentUser,{
      displayName:name
    })
    const user = userCredential.user
    const formDataCopy = {...formData}
    delete formDataCopy.password;
    formDataCopy.timestamp =serverTimestamp();
    await setDoc(doc(db,"users",user.uid),formDataCopy)
    toast.success("Sign Up was successfull");
    navigate("/")
   } catch (error) {
    toast.error("Something went wrong with the registration")
   }
  }
  return (
<section>
  <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
  <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto '>
    <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
      <img src="https://scribie.com/assets/front/illustrations/Welcome-to-scribie-512x391.svg" alt="sign-in" className='w-full rounded-2xl' />
    </div>
    <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
      <form  onSubmit={onSubmit}>
      <input className='w-full mb-6 px-4 py-2 text-xl text-gray-500 bg-white border-gray-400 rounded transition ease-in-out' type="text" id="name" value={name} onChange={onChange} placeholder='Enter Your Name' />
        <input className='w-full mb-6 px-4 py-2 text-xl text-gray-500 bg-white border-gray-400 rounded transition ease-in-out' type="email" id="email" value={email} onChange={onChange} placeholder='Enter Your Email' />
        <div className='relative mb-6'>
        <input className='w-full px-4 py-2 text-xl text-gray-500 bg-white border-gray-400 rounded transition ease-in-out' type={showPassword ? "text":"password"} id="password" value={password} onChange={onChange} placeholder='Enter Your Password' />
        {showPassword ? (
          <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setShowPassword((prevState)=>!prevState)}/>
        ) : (<AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer'onClick={()=>setShowPassword((prevState)=>!prevState)}/>)}
        </div>
        <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
          <p className='mb-6'>Already have an account ? 
          <Link className='text-red-700 hover:text-red-800 transition duration-200 ease-in-out ml-1' to={"/sign-in"}>Sign In</Link>
          </p>
          <p>
            <Link className='text-blue-700 hover:text-blue-800 transition duration-200 ease-in-out ml-1' to={"/forgot-password"}>Forgot Password?</Link>
          </p>
        </div>
        <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-2xl active:bg-blue-900' type='submit'>Sign In </button>
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

export default SignUp