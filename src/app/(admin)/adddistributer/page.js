"use client";
import { useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

const UserFormPage = () => {
  const { data: session } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
const router= useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    password: "",
    address: "",
    status: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const SubmitForm = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (formData.mobileNumber.length !== 10) {
      setError("Mobile Number should be 10 digits");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/distributor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setIsSubmitted(false); // Reset uploading state
        setFormData({ name: "", mobileNumber: "", password: "", address: "", status: "" });
        setError("");
        router.push("/customerlist");
        // Clear form
      } else {
        setError(data.message);
        setIsSubmitted(false); // Reset uploading state
      }
    } catch (error) {
      setError("Error submitting form");
      setIsSubmitted(false);
    }
  };



  return (
    <div className="grid sm:grid-cols-12 gap-4 m-4 overflow-hidden">
      {/* Left Side - Form Section */}
      <div className="sm:col-span-9 bg-green-200 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-start">Add Distributer</h2>

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

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-600 mb-1">Mobile</label>
            <input
              type="number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Class  */}

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {session && session.user && session.user.role === "admin" ? (
            <label>Status:
              <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>
          ) : null}

        </form>
        {
          error &&
          <div className="bg-red-500 p-2 text-white rounded-lg mb-2">
            {error}
          </div>
        }
      </div>

      {/* Right Side - Actions */}
      <div className="sm:col-span-3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Actions</h2>
        <div className="flex flex-col gap-3">
          <button
            className="w-full p-2 rounded border-2 border-green-500 bg-transparent hover:bg-green-500 hover:text-white"
            onClick={SubmitForm}
            disabled={isSubmitted} // Disable button while uploading
          >
            {isSubmitted ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormPage;
