'use client'
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const Page = () => {
  const router= useRouter();
    const { data: session} = useSession();
  
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    dob: "",
    // photo: null,
    fatherName: "",
    // signImage: null,
    mobile: "",
        status: "",
    remark: "",
    createdBy: session?.user?.id || ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async(e)=>{
    // console.log(formData); 
    // e.preventDefault();
    // setError(null);
    // setSuccess(null);

    try {
      const response = await fetch('http://localhost:3000/api/docupload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      setSuccess('Signup successful! You can now log in.');
      // setFormData({ mobileNumber: '', password: '', name: '', referal: '' });
      router.push('/documentlist');
    } catch (err) {
      // setError(err.message);
    }
  }
  return (
      
    <div className="grid sm:grid-cols-12 gap-4 m-4 overflow-hidden">
      {/* Left Side - Form Section */}
      <div className="sm:col-span-9  p-6">
        <h2 className="text-xl font-semibold mb-4 text-start">Add Documents</h2>

        {/* Form */}
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
        <label className="block text-gray-600 mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Category</option>
          <option value="Pan">Pan</option>
          <option value="Aadhar">Aadhar</option>
        </select>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-gray-600 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-gray-600 mb-1">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Photo */}
      <div>
        <label className="block text-gray-600 mb-1">Upload Photo</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Father Name */}
      <div>
        <label className="block text-gray-600 mb-1">Father&apos; Name</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          placeholder="Enter Father's Name"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Signature Image */}
      <div>
        <label className="block text-gray-600 mb-1">Upload Signature</label>
        <input
          type="file"
          name="signImage"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Mobile Number */}
      <div>
        <label className="block text-gray-600 mb-1">Mobile Number</label>
        <input
          type="number"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Enter your mobile number"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-gray-600 mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-600 mb-1">Remark</label>
        <textarea
          name="remark"
          value={formData.remark}
          onChange={handleChange}
          placeholder="Enter any remarks"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
        </form>
      </div>

      {/* Right Side - Actions */}
      <div className="sm:col-span-3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Actions</h2>
        <div className="flex flex-col gap-3">
          <button className="w-full p-2 rounded border-2 border-green-500 bg-transparent hover:bg-green-500 hover:text-white" onClick={()=>handleSave()}>
            Save
          </button>
          <button className="w-full p-2 rounded border-2 border-green-500 bg-transparent hover:bg-green-500 hover:text-white">
            Edit
          </button>
          <button className="w-full p-2 rounded border-2 border-blue-500 bg-transparent hover:bg-blue-500 hover:text-white">
            Update
          </button>
          <button className="w-full p-2 rounded border-2 border-red-500 bg-transparent hover:bg-red-500 hover:text-white">
            Delete
          </button>
        </div>
      </div>
    </div>

  )
}

export default Page
