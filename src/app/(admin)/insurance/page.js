'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    category: 'Insurance',
    panOption: '',
    name: '',
    dob: '',
    photo: null,
    fatherName: '',
    signImage: null,
    mobile: '',
    status: '',
    remark: '',
    aadharBack: null,
    aadharFront: null,
    previousPanImage: null,
    blueBookImage: null,
    createdBy: session?.user?.id || '',
  });

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === 'file') {
      if (files[0] && files[0].size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [name]: 'File size should be less than 2MB' }));
        return;
      } else {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch('/api/docupload', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const text = await response.text();
      console.log('Raw Server Response:', text);
      const data = JSON.parse(text);

      if (response.ok) {
        console.log('Document added:', data);
        router.push('/documentlist');
      } else {
        setSubmitError(data.message || 'Failed to upload');
      }
    } catch (error) {
      setSubmitError("An error occurred while submitting.");
      console.error('Failed to save document:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid sm:grid-cols-12 gap-4 m-4 overflow-hidden">
      <div className="sm:col-span-9 p-6">
        <h2 className="text-xl font-semibold mb-4 text-start">Add Documents</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter Father's Name" className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="number" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter your mobile number" className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="file" name="blueBookImage" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="file" name="aadharBack" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="file" name="aadharFront" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <textarea name="remark" value={formData.remark} onChange={handleChange} placeholder="Enter any remarks" className="w-full p-2 border border-gray-300 rounded-lg" />
          {Object.keys(errors).map((key) => (errors[key] && <p key={key} className="text-red-500 text-sm">{errors[key]}</p>))}
          {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
        </form>
      </div>
      <div className="sm:col-span-3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Actions</h2>
        <button className={`w-full p-2 rounded border-2 ${loading ? "border-gray-400 bg-gray-300 text-gray-600" : "border-green-500 bg-transparent hover:bg-green-500 hover:text-white"}`} onClick={handleSave} disabled={loading}>
          {loading ? "Uploading..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default Page;