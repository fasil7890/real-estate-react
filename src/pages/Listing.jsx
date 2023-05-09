import React, { useEffect, useState } from 'react';
import { doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";
import {useParams} from "react-router-dom";
import Spinner from "../components/Spinner";
import {Swiper,SwiperSlide} from "swiper/react";
import SwiperCore ,{EffectFade,Autoplay,Navigation,Pagination} from "swiper";
import "swiper/css/bundle";
import {FaMapMarkerAlt,FaBed,FaBath,FaParking,FaChair} from "react-icons/fa";
import {getAuth} from "firebase/auth";
import Contact from '../components/Contact';


const Listing = () => {
    const params = useParams();
    const auth = getAuth();
    const [listing,setListing]= useState(null)
    const [loading,setLoading]=useState(true)
    const [contactLandlord,setContactLandLord]=useState(false)
    SwiperCore.use([Autoplay,Navigation,Pagination])
    useEffect(()=>{
      async function fetchListing(){
        const docRef = doc(db,"listings",params.listingId)
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()){
         setListing(docSnap.data())
         setLoading(false) 
       
        }  
      }
      fetchListing()
     
    },[params.listingId])
    if(loading){
      return <Spinner />
    }
  return <main>
    <Swiper slidesPerView={1} navigation pagination={{type:"progressbar"}} effect='fade' modules={[EffectFade]} autoplay={{delay:3000}}>
      {listing.imgUrls.map((url,index)=>(
        <SwiperSlide key={index}>
           <div className='w-full overflow-hidden h-[300px]'
           style={{background:`url(${listing.imgUrls[index]}) center no-repeat`,width:"100%",backgroundSize:"cover"}}>

           </div>
        </SwiperSlide>
      ))}
    </Swiper>
    <div className='bg-white mb-6'>
    <div className=' w-full  lg-[400px]   border-gray-300  rounded-xl mt-3 mb-3'>
     <p className='text-2xl font-bold mb-3 text-slate-700 '>{listing.name} -  ${listing.offer ? listing.discoutedPrice : listing.regularPrice}
     {listing.type === "rent" ? "/ month" : ""}
     </p>
        <p className='flex items-center mt-6 mb-3 font-bold text-slate-700 '><FaMapMarkerAlt className='text-slate-700 mr-1'/>{listing.address}</p> 
    </div>
 <div className=' justify-start items-center space-x-4 w-[75%]'>
  <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md '>
    {listing.type === "rent" ?" Rent" : "Sale"}</p>
 <p className='mt-3 mb-3'> 
  <span className='font-semibold '>Description :-</span>
 {listing.description}
 </p>
 <ul className='flex items-center space-x-4 gap-4 text-sm font-semibold mb-3 pb-3'>
  <li className='flex items-center whitespace-nowrap '>
    <FaBed className='text-lg mr-1'/>
    {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
    </li>
    <li className='flex items-center whitespace-nowrap '>
    <FaBath className='text-lg mr-1'/>
    {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
    </li>
    <li className='flex items-center whitespace-nowrap '>
    <FaBath className='text-lg mr-1'/>
    {listing.parking ? "Parking Spot" : "No Parking"}
    </li>
    <li className='flex items-center whitespace-nowrap '>
    <FaChair className='text-lg mr-1'/>
    {listing.furnished ? "Furnished" : "Not Furnished"}
    </li>
 </ul>
 </div>
 </div>
 {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
  <div className=''>
 <button onClick={()=>setContactLandLord(true)} className='px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg text-center transition duration-150 ease-in-out '>Contact Landlord</button>
 </div>
 )}
 {contactLandlord && (<Contact userRef={listing.userRef} listing={listing}/>)}
 

  </main>
}

export default Listing