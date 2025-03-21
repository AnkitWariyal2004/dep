'use client'
import React, { useEffect, useState } from 'react'
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";


export default function WalletPage() {
  const[balance, setBalance]= useState();
  const[ammount, setAmmount]= useState(0);
  const [error, setError]= useState("")
  const [success, setSuccess]= useState("")
  const [loading, setLoading]= useState(false)

const getBalance = async () => {
    try {
      const response = await fetch('/api/walletdata');
      const result = await response.json();
      if (result.success) {
        setBalance(result.data);
      } 
    } catch (error) {
      console.log(error)
    }
  
}
useEffect(() => {  
  getBalance();
},[])

const recharge = async () => {
  setLoading(true); // ✅ Set loading before API call

  const amountValue = Number(ammount); // ✅ Convert to number

  if (amountValue <= 0) {
    setError("Amount must be greater than zero");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`/api/transction`, {  // ✅ Ensure correct API endpoint
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ammount: amountValue, type:"credit" }) // ✅ Send as number
    });

    const result = await response.json();

    if (!result.success) {
      toast.error(result.message)
      throw new Error(result.message || "Failed to recharge");
    }
    toast.success(result.message)
    setSuccess(result.message);
    setError(""); // ✅ Update UI balance immediately
    getBalance();
  } catch (error) {
    toast.error(error.message)
    setError(error.message || "Something went wrong, please try again.");
    setSuccess("");
  } finally {
    setLoading(false);
    setAmmount(""); // ✅ Clear input after recharge
  }
};



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster/>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Wallet</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Balance Card */}
          <div className="md:w-1/2 bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Your Balance</h2>
            <p className="text-3xl font-bold text-green-500 mt-4">{balance}</p>
          </div>

          {/* Right Side - Recharge Section */}
          <div className="md:w-1/2 bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Recharge Wallet</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={ammount}
              name="ammount"
              onChange={(e) => setAmmount(e.target.value)}
              className="w-full mt-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="w-full mt-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600" onClick={recharge} disabled={loading} >
            {loading ? "Wait..." : "Recharge"}
            </button>
            {
            error && <p className="text-red-500 text-sm mt-4">{error}</p>
          }{
            success && <p className="text-green-500 text-sm mt-4">{success}</p>
          }
          </div>
          
        </div>
      </div>
    </div>
  );
}
