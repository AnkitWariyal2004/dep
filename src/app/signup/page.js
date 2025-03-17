'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
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
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      setSuccess('Signup successful! You can now log in.');
      setFormData({ mobileNumber: '', password: '', name: ''});
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>

        {/* Error & Success Messages */}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-green-500 text-center mb-2">{success}</p>}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Mobile Number Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Enter your mobile number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Referral Code (Optional) */}
          {/* <div>
            <label className="block text-gray-700 font-medium mb-1">Referral Code (Optional)</label>
            <input
              type="text"
              name="referal"
              placeholder="Referral code (if any)"
              value={formData.referal}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div> */}

          {/* Signup Button */}
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Signup
          </button>
        </form>

        {/* Already have an account? */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?
          <span className="text-blue-500 hover:underline cursor-pointer ml-1" onClick={() => router.push('/')}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
