'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function PromotionalBannerPage() {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({ title: '', image: '', link: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/promotional-banners');
      const data = await response.json();
      console.log(data)
      setBanners(data.data);
      console.log(data.data)
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (files[0]?.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'File size must be under 2MB' }));
      } else {
        setErrors((prev) => ({ ...prev, image: '' }));
        setFormData((prev) => ({ ...prev, image: files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.image) newErrors.image = 'Image is required';
    if (!formData.link.trim()) newErrors.link = 'Link is required';
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
      const response = await fetch('/api/promotional-banners', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();

      if (data.success) {
        fetchBanners();
        setFormData({ title: '', image: null, link: '' });
      } else {
        throw new Error('Failed to upload banner');
      }
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log(id)
    setLoading(true);
    try {
      const response = await fetch(`/api/promotional-banners/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message)
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <Toaster/>
      <h2 className="text-2xl font-semibold mb-4">Add Promotional Banner</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Banner Title" className="p-2 border rounded w-full" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <input type="file" name="image" accept="image/*" onChange={handleChange} className="p-2 border rounded w-full" />
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

        <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Optional Link" className="p-2 border rounded w-full" />

        <button type="submit" disabled={loading} className="p-2 bg-blue-500 text-white rounded w-full">
          {loading ? 'Uploading...' : 'Submit'}
        </button>
        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
      </form>

      <h2 className="text-2xl font-semibold mt-6">Uploaded Banners</h2>
      <div className="grid gap-4 mt-4">
        {banners.map((banner) => (
          <div key={banner._id} className="border p-4 rounded shadow-md">
            <Image
              width={400}
              height={400}
              src={banner.image}
              alt={banner.title}
              className="w-full h-40 object-fill rounded"
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

    </div>
  );
}
