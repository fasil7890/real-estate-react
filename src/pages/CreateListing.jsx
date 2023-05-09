import React, { useState } from 'react';
import Spinner from "../components/Spinner";
import {getStorage,ref,uploadBytesResumable,getDownloadURL} from "firebase/storage";
import {getAuth} from "firebase/auth";
import {toast} from "react-toastify";
import  { v4 as uuidV4} from "uuid";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "../firebase";
import {useNavigate} from "react-router-dom";

const CreateListing = () => {
  const auth = getAuth()
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false)
    const [formData,setFormData]=useState({
        type:"rent",
        name:"",
        bedrooms:1,
        bathrooms:1,
        parking:false,
        furnished:false,
        address:"",
        description:"",
        offer:true,
        regularPrice:0,
        discountedPrice:0,
        latitude:0,
        longitude:0,
        images:{}

    })
    const {type,name,bedrooms,bathrooms,furnished,parking,address,description,offer,regularPrice,discountedPrice,latitude,longitude,images  } = formData;
    function onChange(e){
      let boolean = null; 
      if(e.target.value==="true"){
        boolean = true;
      }
      if(e.target.value==="false"){
        boolean = false;
      }
      // files
      if(e.target.files){
        setFormData((prevState)=>({
            ...prevState,
            images:e.target.files
        }))
      }
      // number/boolean/text
      if(!e.target.files){
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]:boolean ?? e.target.value,
        }))
      }
    }
    async function onSubmit(e){
     e.preventDefault();
     setLoading (true)
     if(+discountedPrice >= +regularPrice){
      setLoading(false)
      toast.error("Discounted price needs to be less than regular price")
      return;
     }
     if(images.length > 6){
      setLoading(false);
      toast.error("maximum 6 images allowed")
      return;
     }
     async function storeImage(image){
      return new Promise((resolve,reject)=>{
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${images.name}-${uuidV4()}`;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,image);
        uploadTask.on(
          "state_changed",
          (snapshot)=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
            console.log("Upload is" + progress + "% done");
            switch(snapshot.state){
              case "paused":
                console.log("Upload is paused");
                break;
                case "running":
                  console.log("Upload is running");
                  break;
            }
          },(error)=>{
            reject(error)
          },
          ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
              resolve(downloadURL);
            });
          }
        );

      });
     }

     const imgUrls = await Promise.all(
      [...images].map((image)=>storeImage(image))).catch((error)=>{
        setLoading(false)
        toast.error("Images not Uploaded");
        return
      })
     const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp:serverTimestamp(),
      userRef : auth.currentUser.uid
     };
     delete formDataCopy.images;
     !formDataCopy.offer && delete formDataCopy.discountedPrice;
     delete formDataCopy.latitude;
     delete formDataCopy.longitude;
     const docRef = await addDoc(collection(db,"listings"),formDataCopy);
     setLoading(false)
     toast.success("Listing created")
     navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }
    

    if(loading){
      return <Spinner/>
    }
  return (
    
        <main className='max-w-md px-2 bg-slate-300 mx-auto border border-gray-500 border-solid border-1 mt-8 rounded-lg'>
            <h1 className='text-3xl text-center mt-6 font-bold '>Create a Listing</h1>
            <form onSubmit={onSubmit}>
                <p className='text-lg mt-6 font-semibold '>Sell / Rent</p>
                <div className='flex '>
                    <button type="button" id="type" value="sale" onClick={onChange}
                     className={`px-7 mr-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-xl focus:shadow-xl active:shadow-xl transition duration-150 ease-in-out w-full ${ type==="rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    Sell</button>
                    <button type="button" id="type" value="rent" onClick={onChange}
                     className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-xl focus:shadow-xl active:shadow-xl transition duration-150 ease-in-out w-full ${ type==="sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    Rent</button>
                </div>
                <p className='text-lg mt-6 font-semibold '>Name</p>
                <input type="text" value={name} id="name" onChange={onChange} placeholder='Name' maxLength="32" minLength="10" className='w-full px-4 py-2 text-xl text-gray-600 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 '/>

                <div className='flex space-x-6 mb-6'>
                    <div >
                      <p className='text-lg font-semibold '>Beds</p>
                      <input type="number"  id="bedrooms" value={bedrooms} onChange={onChange} min="1" max="50" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                    </div>
                    <div >
                      <p className='text-lg font-semibold '>Baths</p>
                      <input type="number"  id="bathrooms" value={bathrooms} onChange={onChange} min="1" max="50" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                    </div>
                </div>
                <p className='text-lg mt-6 font-semibold '>Parking Spot</p>
                <div className='flex '>
                    <button type="button" id="parking" value={true} onClick={onChange}
                     className={`px-7 mr-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-xl focus:shadow-xl active:shadow-xl transition duration-150 ease-in-out w-full ${ !parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    Yes</button>
                    <button type="button" id="parking" value={false} onClick={onChange}
                     className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-xl focus:shadow-xl active:shadow-xl transition duration-150 ease-in-out w-full ${ parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    No</button>
                </div>
                <p className='text-lg mt-6 font-semibold '>Furnished</p>
                <div className='flex '>
                    <button type="button" id="furnished" value={true} onClick={onChange}
                     className={`px-7 mr-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-xl focus:shadow-xl active:shadow-xl transition duration-150 ease-in-out w-full ${ !furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    Yes</button>
                    <button type="button" id="furnished" value={false} onClick={onChange}
                     className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-xl focus:shadow-xl active:shadow-xl transition duration-150 ease-in-out w-full ${ furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    No</button>
                </div>
                <p className='text-lg mt-6 font-semibold '>Address</p>
                <textarea type="text" value={address} id="address" onChange={onChange} placeholder='Address' className='w-full px-4 py-2 text-xl text-gray-600 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 '/>
                
                <p className='text-lg  font-semibold '>Description</p>
                <textarea type="text" value={description} id="description" onChange={onChange} placeholder='Description' className='w-full px-4 py-2 text-xl text-gray-600 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 '/>
                <p className='text-lg  font-semibold '>Offer</p>
                <div className='flex mb-6'>
                    <button type="button" id="offer" value={true} onClick={onChange}
                     className={`px-7 mr-3 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-xl focus:shadow-xl active:shadow-xl transition duration-150 ease-in-out w-full ${ !offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    Yes</button>
                    <button type="button" id="offer" value={false} onClick={onChange}
                     className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-xl focus:shadow-xl active:shadow-xl transition duration-150 ease-in-out w-full ${ offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
                    No</button>
                </div> 
                <div className="flex items-center mb-6">
          <div className="">
            <p className="text-lg font-semibold">Regular price</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Discounted price</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className='mb-6'>
            <p className='text-lg font-semibold '>Images</p>
             <p className='text-gray-600 text-sm'>The first image will be  the cover (max 6) </p>
             <input className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600 ' type="file" id='images' multiple required onChange={onChange} accept='.jpg,.png,.jpeg' />
        </div>
        <button type="submit" className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>Create Listing</button>
            </form>
        </main>
    
  )
}

export default CreateListing