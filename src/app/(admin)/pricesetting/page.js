"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function PriceSettingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [prices, setPrices] = useState({
    newPenPrice: "",
    renewalPenPrice: "",
    insurancePrice: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded

    if (!session) {
      router.push("/login"); // Redirect if not logged in
      return;
    } else if (session.user?.role === "customer" || session.user?.role === "distributor") {
      router.push("/dashboard"); // Redirect based on role
      return;
    }

    const fetchPrices = async () => {
      try {
        const res = await fetch("/api/setprice");
        const data = await res.json();
        if (data.success && data.data) {
          setPrices({
            newPenPrice: data.data.newPenPrice?.toString() || "",
            renewalPenPrice: data.data.renewalPenPrice?.toString() || "",
            insurancePrice: data.data.insurancePrice?.toString() || "",
          });
        } else {
          setError("Failed to fetch prices: " + data.message);
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
        setError("Failed to fetch prices.");
      }
    };

    fetchPrices();
  }, [session, status, router]);

  const handleChange = (e) => {
    setPrices({ ...prices, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure inputs are not empty
    if (prices.newPenPrice === "" || prices.renewalPenPrice === "" || prices.insurancePrice === "") {
      setError("All fields are required.");
      return;
    }
  
    // Convert values to numbers and validate
    const updatedPrices = {
      newPenPrice: Number(prices.newPenPrice),
      renewalPenPrice: Number(prices.renewalPenPrice),
      insurancePrice: Number(prices.insurancePrice),
    };
  
    // Check if values are valid numbers
    if (isNaN(updatedPrices.newPenPrice) || isNaN(updatedPrices.renewalPenPrice) || isNaN(updatedPrices.insurancePrice)) {
      setError("Prices must be valid numbers.");
      return;
    }
  
    // Check for negative values
    if (updatedPrices.newPenPrice < 0 || updatedPrices.renewalPenPrice < 0 || updatedPrices.insurancePrice < 0) {
      setError("Prices cannot be negative.");
      return;
    }
  
    try {
      const res = await fetch("/api/setprice", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPrices),
      });
  
      const data = await res.json();
  
      if (data.success) {
        toast.success("Prices updated successfully!");
        setError(""); // Clear error if successful
      } else {
        toast.error("Failed to update prices.");
      }
    } catch (error) {
      console.error("Error updating prices:", error);
      toast.error("Server error. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster /> {/* Add this here */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Set Prices</h2>
        
        {error && <p className="text-red-500 mb-2">{error}</p>}
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New PAN Card Price</label>
            <input
              type="number"
              name="newPenPrice"
              value={prices.newPenPrice}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Renewal PAN Card Price</label>
            <input
              type="number"
              name="renewalPenPrice"
              value={prices.renewalPenPrice}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance Price</label>
            <input
              type="number"
              name="insurancePrice"
              value={prices.insurancePrice}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Update Prices
          </button>
        </form>
      </div>
    </div>
  );
  
}
