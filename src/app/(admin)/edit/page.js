'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const Edit = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // Get id from URL
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        category: "",
        panOption: "",
        name: "",
        dob: "",
        fatherName: "",
        mobile: "",
        status: "",
        remark: "",
        createdBy: "",
    });

    const [loading, setLoading] = useState(true); // Loading state

    // Fetch data when ID is available
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/edit/${id}`);
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();
                if (data.success) {
                    setFormData({
                        category: data.data.category,
                        panOption: data.data.panOption,
                        name: data.data.name,
                        dob: data.data.dob,
                        fatherName: data.data.fatherName,
                        mobile: data.data.mobile,
                        status: data.data.status,
                        remark: data.data.remark,
                    });
                } else {
                    throw new Error(data.error || "Failed to fetch document");
                }
            } catch (err) {
                console.error("Error fetching data:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);


    // Handle input change only for `status` and `remark`
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!id) {
            alert("Document ID is missing!");
            return;
        }
    
        try {
            const response = await fetch(`/api/edit/${id}`, {
                method: "PUT", // Use PUT instead of POST
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: formData.status,
                    remark: formData.remark,
                }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || "Failed to update document");
            }
    
            alert("Status updated successfully!");
            router.push("/documentlist"); // Redirect after update
        } catch (err) {
            console.error("Error updating status:", err.message);
            alert(`Error: ${err.message}`);
        }
    };
    

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Edit Document</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Read-Only Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Category</label>
              <input 
                type="text" 
                name="category" 
                value={formData.category} 
                readOnly 
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
      
            {formData.category === "Pan" && (
              <div>
                <label className="block text-gray-700 font-medium">PAN Option</label>
                <input 
                  type="text" 
                  name="panOption" 
                  value={formData.panOption} 
                  readOnly 
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            )}
      
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                readOnly 
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
      
            <div>
              <label className="block text-gray-700 font-medium">Date of Birth</label>
              <input 
                type="date" 
                name="dob" 
                value={formData.dob} 
                readOnly 
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
      
            <div>
              <label className="block text-gray-700 font-medium">Father&apos; Name</label>
              <input 
                type="text" 
                name="fatherName" 
                value={formData.fatherName} 
                readOnly 
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
      
            <div>
              <label className="block text-gray-700 font-medium">Mobile</label>
              <input 
                type="tel" 
                name="mobile" 
                value={formData.mobile} 
                readOnly 
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
      
          {/* Editable Fields */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring focus:ring-blue-200"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
      
          <div>
            <label className="block text-gray-700 font-medium">Remark</label>
            <textarea 
              name="remark" 
              value={formData.remark} 
              onChange={handleChange} 
              rows="3" 
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring focus:ring-blue-200"
            ></textarea>
          </div>
      
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition duration-300"
          >
            Update Status
          </button>
      
          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </form>
      </div>
      
    );
};

export default Edit;
