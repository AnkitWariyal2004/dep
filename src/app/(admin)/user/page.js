"use client";
import React, { useEffect, useState, Suspense } from "react";
import UserInfoCard from "@/app/_components/UserInfoCard";
import { useSearchParams } from "next/navigation";

const UserPage = () => {
  return (
    <Suspense fallback={<p>Loading user data...</p>}>
      <UserDetails />
    </Suspense>
  );
};

const UserDetails = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        console.log("Fetching data from:", `/api/edit/${userId}`);
        const res = await fetch(`/api/edit/${userId}`);

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const responseData = await res.json();
        console.log("API Response:", responseData);

        if (responseData.success) {
          setData(responseData.data);
        } else {
          throw new Error(responseData.error || "Failed to fetch document");
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (!userId) return <p>Loading user data...</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <UserInfoCard userData={data} />
    </div>
  );
};

export default UserPage;
