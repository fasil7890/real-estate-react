import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import {toast} from "react-toastify";

const Contact = ({userRef,listing}) => {
    const [landlord,setLandlord] = useState(null);
    const [message,setMessage] = useState("")
    useEffect(()=>{
   async function getLandLord(){
     const docRef = doc(db,"users",userRef)
     const docSnap = await getDoc(docRef);
     if(docSnap.exists()){
       setLandlord(docSnap.data())
     }else{
        toast.error("Could not get landlord data")
     }
   }
   getLandLord();
    },[userRef])
   function onChange(e){
    setMessage(e.target.value)
   }
  return (
    <div>{landlord !== null && (
        <div className=''>
            <p className=''>
              Contact {landlord.name} for the {listing.name.toLowerCase()} 
              </p>
            <div className='mt-3 mb-6 '>
                <textarea className='w-[400px] px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 bg-white focus:border-gray-600' name="message" id="message" rows="2" value={message} onChange={onChange}></textarea>
            </div>
            <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}></a>
            <button className='px-7 w-[400px] py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 active:bg-blue-700 active:shadow-lg transition duration-150 ease-in-out mb-10' type="button">Send Message</button>
        </div>
    )}</div>
  )
}

export default Contact