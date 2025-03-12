"use client";
import { useState } from "react";

const UserFormPage = () => {


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    password:"",
    referalcode:"",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const SubmitForm = async (e) => {
    e.preventDefault(); // Prevent page reload
  
    try {
      const response = await fetch("http://localhost:3000/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("✅ Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          gender: "",
          referalcode:"",
        }); // Reset form fields
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Error submitting form");
    }
  };



  return (
    <div className="grid sm:grid-cols-12 gap-4 m-4 overflow-hidden">
      {/* Left Side - Form Section */}
      <div className="sm:col-span-9 bg-green-200 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-start">User Form</h2>

        {/* Form */}
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-600 mb-1">Mobile</label>
            <input
              type="number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Class  */}

          {/* Gender */}
          <div>
            <label className="block text-gray-600 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Referal Code</label>
            <input
              type="number"
              name="mobile"
              value={formData.referalcode}
              onChange={handleChange}
              placeholder="Enter Referal Code"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </form>
      </div>

      {/* Right Side - Actions */}
      <div className="sm:col-span-3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Actions</h2>
        <div className="flex flex-col gap-3">
          <button className="w-full p-2 rounded border-2 border-green-500 bg-transparent hover:bg-green-500 hover:text-white" onClick={SubmitForm}>
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
  );
};

export default UserFormPage;
