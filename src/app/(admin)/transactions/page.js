'use client'
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";



const TransactionPage = () => {
  const [data, setData] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/');
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/transction`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          console.log(data)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [session, status]);


  if (status === "loading") return <p>Loading...</p>; // ✅ Show loading state
  if (!session) return <p>Please log in</p>; // ✅ Handle unauthenticated users

  return (
    <div className="overflow-x-auto p-4">
      <div className="w-full max-w-full overflow-x-auto">
        <table className="w-full table-auto bg-white border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 text-left whitespace-nowrap">Name</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">status</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">type</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">remark</th>
              {
                session.user.role === "admin" ?<th className="px-4 py-2 text-left whitespace-nowrap">cumilative</th>:<th className="px-4 py-2 text-left whitespace-nowrap">ammount</th>
              }
              {
                session.user.role === "admin" && <th className="px-4 py-2 text-left whitespace-nowrap">created On</th>
              }

            </tr>

          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.customerId.name}</td>
                <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.status}</td>
                <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.type}</td>
                <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.remark}</td>
                {
                  session.user.role === "admin" && <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.cumilative}</td>
                }
                {
                  session.user.role === "admin" && <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.createdon.split("T")[0]}</td>
                }
                {
                  session.user.role ==="customer" &&   <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.ammount}</td>
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionPage;
