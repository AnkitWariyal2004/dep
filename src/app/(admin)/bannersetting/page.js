'use client';

import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Image from 'next/image';
const Page = () => {

  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([])
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    image: '',
  });


  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/bannerupload');
      const data = await response.json();
      console.log(data)
      setBanners(data.data);
      console.log(data.data)
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

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
      // setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    let newErrors = {};

    // Title Validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title cannot be empty';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (!/[a-zA-Z]/.test(formData.title)) {
      newErrors.title = 'Title must contain at least one letter';
    }

    // Image Validation
    if (!formData.image) {
      newErrors.image = 'Image is required';
    } else {
      const allowedExtensions = ['jpg', 'jpeg'];
      const fileExt = formData.image.name.split('.').pop().toLowerCase();
      const fileSizeMB = formData.image.size / (1024 * 1024); // Convert bytes to MB

      if (!allowedExtensions.includes(fileExt)) {
        newErrors.image = 'Only JPG images are allowed';
      } else if (fileSizeMB > 2) {
        newErrors.image = 'Image size should be less than 2MB';
      }
    }

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
      const response = await fetch('/api/bannerupload', {
        method: 'POST',
        body: formDataToSend,
      });

      const text = await response.text();
      console.log('Raw Server Response:', text);
      const data = JSON.parse(text);

      if (data.success) {
        console.log('Banner added:', data);
        toast.success('Banner uploaded successfully!');
        fetchBanners();
        // router.push('/banner-list');
      } else {
        toast.success('failed to upload banner');
        throw new Error(data.message || 'Failed to upload');
      }
    } catch (error) {
      console.error('Failed to save banner:', error);
      setSubmitError(error.message || 'An error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log(id)
    setLoading(true);
    try {
      const response = await fetch(`/api/bannerupload/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message)
        setFormData({ title: '', image: '' });
        fetchBanners();

      } else {
        toast.error(data.message)
        console.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.error("Error deleting:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="grid sm:grid-cols-12 gap-4 m-4 overflow-hidden">
        <div className="sm:col-span-9 p-6">
          <h2 className="text-xl font-semibold mb-4 text-start">Upload Banner</h2>
          <Toaster />
          <form className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter banner title"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Upload Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {Object.keys(errors).map((key) => (
              errors[key] && <p key={key} className="text-red-500 text-sm">{errors[key]}</p>
            ))}
          </form>
        </div>

        <div className="sm:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Actions</h2>
          <div className="flex flex-col gap-3">
            <button
              className={`w-full p-2 rounded border-2 ${loading ? 'border-gray-400 bg-gray-300 text-gray-600' : 'border-green-500 bg-transparent hover:bg-green-500 hover:text-white'}`}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Save'}
            </button>
            {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
          </div>
        </div>
      </div>


      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-4 w-full h-60 relative">
        {banners.map((banner) => (
          <div key={banner._id} className="border p-4 rounded shadow-md">
            <Image
              src={`/api/uploads${banner.image.replace("/uploads", "")}`} // Corrected path
              alt={banner.title}
              width={400}
              height={400}
              className="w-full h-40 object-fill rounded"
              priority // Ensures the image loads faster
            />
            <h3 className="text-lg font-semibold mt-2">{banner.title}</h3>
            <div className="flex items-center justify-between mt-2">
              {banner.link && (
                <a
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Visit Link
                </a>
              )}
              <button
                onClick={() => handleDelete(banner._id)}
                className="text-red-500 hover:text-red-700"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Page;
