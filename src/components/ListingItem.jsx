import React from 'react';
import {Link} from "react-router-dom";
import Moment from "react-moment";
import {MdLocationOn} from "react-icons/md"
import {FaTrash} from "react-icons/fa";
import {MdEdit} from "react-icons/md";

const ListingItem = ({listing,id,onEdit,onDelete}) => {
  return <li className='m-[10px] relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-2xl rounded-lg overflow-hidden transition-shadow duration-150  '>
    <Link className='contents'  to={`/category/${listing.type}/${id}`}>
      <img loading='lazy' className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in-out ' src={listing.imgUrls[0]} alt="" />
      <Moment className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded px-2 py-1 shadow-lg ' fromNow>{listing.timestamp?.toDate()}</Moment>
      <div className='w-full p-[10px] '>
        <div className='flex item-center space-x-1  '>
          <MdLocationOn className='h-4 w-4 text-green-600 '/>
          <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate '>{listing.address}</p>
        </div>
        <p className='font-semibold mt-2 text-xl m-0 truncate'>{listing.name}</p>
        <p className=' text-[#457b9d] mt-2 font-semibold  '>₹ {listing.offer ? listing.discountedPrice : listing.regularPrice} /- Rupees</p>
        
      </div>
    </Link>
    {onDelete && (
      <FaTrash className='absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500' onClick={()=>onDelete(listing.id)}/>
    )}
    {onEdit && (
      <MdEdit className='absolute bottom-2 right-7 h-4 cursor-pointer text-black' onClick={()=>onEdit(listing.id)}/>
    )}
    
  </li>
}

export default ListingItem