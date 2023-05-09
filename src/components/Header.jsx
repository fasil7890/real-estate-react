import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from "react-router-dom";

const Header = () => {
  const [pageState,setPageState]=useState("Sign in")
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setPageState("Profile")
      }else{
        setPageState("Sign in")
      }
    })
  },[auth])
  const pathMatchRoute=(route)=>{
    if(route === location.pathname){
      return true
    }
  }
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-40'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
        <img src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg' alt='logo'  className='h-10 py-2 px-1 mb-0 cursor-pointer ' onClick={()=>navigate("/")} />
        </div>
        <div>
          <div className='flex space-x-10'>
            <span className={`cursor-pointer py-3 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${pathMatchRoute("/")&& "text-black border-b-red-500"}`} onClick={()=>navigate("/")}>Home</span>
            <span className={`cursor-pointer py-3 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${pathMatchRoute("/offers")&& "text-black border-b-red-500"}`} onClick={()=>navigate("/offers")}>Offers</span>
            <span className={`cursor-pointer py-3 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "text-black border-b-red-500"}`} onClick={()=>navigate("/profile")}>{pageState}</span>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
// src='https://cdn5.vectorstock.com/i/1000x1000/70/94/real-estate-modern-home-design-logo-template-vector-24167094.jpg' alt="logo"