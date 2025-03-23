'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false); 
  const [submitError, setSubmitError] = useState("");
  const [showRenewPanForm, setShowRenewPanForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    category: 'Pan',
    panOption: '',
    name: '',
    dob: '',
    photo: '',
    fatherName: '',
    signImage: '',
    mobile: '',
    status: '',
    remark: '',
    aadharBack: '',
    aadharFront: '',
    previousPanImage: '',
    blueBookImage: '',
    userId:session?.user?.id ?? '',
    type:'debit',
    Ammount:100,
    createdBy: session?.user?.id ?? '',  // Prevents crash if session is undefined
  });

  // Wait until session is loaded
  if (status === 'loading') return <p>Loading...</p>;

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
    if (name === "panOption") {
      setShowRenewPanForm(value === "PAN Card Renewal");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");
    let newErrors = {};
  
    // Required Field Validations
    if (!formData.panOption) {
      newErrors.panOption = "PAN Card option is required";
    }
    if (!/[a-zA-Z]/.test(formData.name)) {
      newErrors.name = "Name must contain at least one letter";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father's Name is required.";
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }
  
    // File Validation Function
    const validateFile = (file, fieldName) => {
      if (!file) {
        newErrors[fieldName] = `${fieldName} is required`;
        return false;
      }
      const allowedExtensions = ["jpg", "jpeg", "pdf"];
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileSizeMB = file.size / (1024 * 1024);
  
      if (!allowedExtensions.includes(fileExt)) {
        newErrors[fieldName] = "Only JPG and PDF files are allowed";
        return false;
      }
      if (fileSizeMB > 2) {
        newErrors[fieldName] = "File size should be less than 2MB";
        return false;
      }
      return true;
    };
  
    // File Upload Validations Based on PAN Option
    if (formData.panOption === "New PAN Card") {
      validateFile(formData.photo, "photo");
      validateFile(formData.aadharFront, "aadharFront");
      validateFile(formData.aadharBack, "aadharBack");
      validateFile(formData.signImage, "signImage");
    } else if (formData.panOption === "PAN Card Renewal") {
      validateFile(formData.photo, "photo");
      validateFile(formData.aadharFront, "aadharFront");
      validateFile(formData.aadharBack, "aadharBack");
      validateFile(formData.signImage, "signImage");
      validateFile(formData.previousPanImage, "previousPanImage");
    }
  
    // If any errors exist, stop form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }


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
        toast.success("Document Uploaded")
        console.log('Document added:', data);
        router.push('/documentlist');
      } else {
        toast.error(data.message)
        throw new Error(data.message || 'Failed to upload'); 
      }
    } catch (error) {
      toast.error(error.message)
      // toast.success(error.message)
      console.error('Failed to save document:', error);
      setSubmitError(error.message || "An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid sm:grid-cols-12 gap-4 m-4 overflow-hidden">
      <Toaster/>
      <div className="sm:col-span-9 p-6">
        <h2 className="text-xl font-semibold mb-4 text-start">Add Documents</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className="block text-gray-600 mb-1">PAN Card Options</label>
            <select name="panOption" value={formData.panOption} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Select Option</option>
              <option value="New PAN Card">New PAN Card</option>
              <option value="PAN Card Renewal">PAN Card Renewal</option>
            </select>
          </div>

          {showRenewPanForm && (
            <div>
              <label className="block text-gray-600 mb-1">Previous PAN Image</label>
              <input type="file" name="previousPanImage" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          )}

          <div>
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Upload Photo</label>
            <input type="file" name="photo" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
              <label className="block text-gray-600 mb-1">Aadhar Front</label>
              <input type="file" name="aadharFront" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Aadhar Back Image</label>
              <input type="file" name="aadharBack" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>


          <div>
            <label className="block text-gray-600 mb-1">Father&apos;s Name</label>
            <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter Father's Name" className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Upload Signature</label>
            <input type="file" name="signImage" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Mobile Number</label>
            <input type="number" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter your mobile number" className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>

          {session?.user?.role === "admin" && (
            <>
              <div>
                <label className="block text-gray-600 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Remark</label>
                <textarea name="remark" value={formData.remark} onChange={handleChange} placeholder="Enter any remarks" className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
            </>
          )}

          {Object.keys(errors).map((key) => (
            errors[key] && <p key={key} className="text-red-500 text-sm">{errors[key]}</p>
          ))}
        </form>
      </div>

      <div className="sm:col-span-3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Actions</h2>
        <div className="flex flex-col gap-3">
          <button className={`w-full p-2 rounded border-2 ${loading ? "border-gray-400 bg-gray-300 text-gray-600" : "border-green-500 bg-transparent hover:bg-green-500 hover:text-white"}`} onClick={handleSave} disabled={loading}>
            {loading ? "Uploading..." : "Save"}
          </button>
          {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
        </div>
      </div>
    </div>
  );
}

export default Page;