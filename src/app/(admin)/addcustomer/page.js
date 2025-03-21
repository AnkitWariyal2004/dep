'use client'
import { useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function SignupPage() {
  const { data: session, status } = useSession();
  // const router = useRouter();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: '',
    name: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message)
        throw new Error(data.message || 'Signup failed');
      }
      toast.success("Customer Added Sucessfully")
      setSuccess('Signup successful! You can now log in.');
      setFormData({ mobileNumber: '', password: '', name: '' });
      router.push('/customerlist');
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === 'loading' || !session) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center  bg-gray-50 p-6 sm:p-12">
      <Toaster/>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 sm:p-10">
        {/* <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2> */}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Enter your mobile number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
}
