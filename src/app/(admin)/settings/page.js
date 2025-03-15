'use client'
import { useState } from "react";

export default function Settings() {
  // const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
   currentPassword:'',
   newPassword:'',
  });
   const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit =async (e)=>{
      e.preventDefault();
      try {
        const response = await fetch(`/api/passchange`, {
          method: "PUT", // Use PUT instead of POST
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.sucess) {
        setSuccess(result.message);
        setError(null);
        } else {
          setError(result.message);
          setSuccess(null);
          }
      } catch (error) {
        console.error(error);
      }
    }

  return (
    <div className={`p-6`}>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">Settings</h2>
        
        {/* Profile Settings */}
        {/* Password Settings */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Current Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            onChange={handleChange}
            value={formData.currentPassword}
            name="currentPassword"
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          
        </div>
        <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">New Password</h3>
        <input
            type="password"
            placeholder="New Password"
            onChange={handleChange}
            value={formData.newPassword}
            name="newPassword"
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        

        {/* Save Button */}
        <button className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300" onClick={handleSubmit}>
          Save Changes
        </button>
        {/* how to show error message */}
        {
          error && <div className="text-red-500 text-md mb-4">{error}</div>
        }
        {
          success && <div className="text-green-500 text-md mb-4">{success}</div>
        }
      </div>
    </div>
  );
}