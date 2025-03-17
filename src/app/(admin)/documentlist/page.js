'use client'
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
// import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { Router} from "next/router";


const Table = () => {
  const [data, setData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const { data: session, status } = useSession();
  const router = useRouter(); // Initialize router


  // Redirect if user is not authenticated or not an admin
  // useEffect(() => {
  //   if (status === "loading") return; // Wait for session to load
  //   if (!session) {
  //     router.push("/"); // Redirect to home page if not an admin
  //   }
  // }, [session, status, router]);

  useEffect(() => {
    const fetchData = async (role, id) => {
      try {
        const response = await fetch(`/api/docupload?role=${role}&userID=${id}`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          console.log(data)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (status === "authenticated" && session?.user?.role && session?.user?.id) {
      fetchData(session.user.role, session.user.id);
    }
  }, [session, status]);

  const handleSelectAll = () => {
    const newCheckedState = !selectAll;
    setSelectAll(newCheckedState);
    const updatedCheckedItems = {};
    data.forEach((_, index) => {
      updatedCheckedItems[index] = newCheckedState;
    });
    setCheckedItems(updatedCheckedItems);
  };

  const handleCheckboxChange = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (status === "loading") return <p>Loading...</p>; // ✅ Show loading state
  if (!session) return <p>Please log in</p>; // ✅ Handle unauthenticated users

  return (
    <div className="overflow-x-auto p-4">
      <div className="w-full max-w-full overflow-x-auto">
        <table className="w-full table-auto bg-white border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 text-left w-12">
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Category</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Name</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Father Name</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Mobile Number</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Remarks</th>
              {
                session?.user?.role === "admin" && (
                  <>
                    <th className="px-4 py-2 text-left whitespace-nowrap">Created By</th>
                    <th className="px-4 py-2 text-left whitespace-nowrap">Edit</th>
                  </>
                )
              }
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="px-4 py-2 w-12">
                  <input
                    type="checkbox"
                    checked={!!checkedItems[index]}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.category}</td>
                <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.name}</td>
                <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.fatherName}</td>
                <td
                  className={`px-4 py-2 font-semibold break-words max-w-[100px] overflow-hidden text-ellipsis 
                ${item.status === "Pending" ? "text-yellow-600" :
                      item.status === "Rejected" ? "text-red-600" :
                        "text-green-600"}`}
                >
                  {item.status}
                </td>
                <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">{item.mobile}</td>
                <td className="px-4 py-2 break-words max-w-[200px] overflow-hidden text-ellipsis">{item.remark}</td>
                {
                  session?.user?.role === "admin" && (
                    <>
                      <td className="px-4 py-2 break-words max-w-[150px] overflow-hidden text-ellipsis">
                        {item.createdBy.name}
                      </td>
                      <td className="px-4 py-2 break-words max-w-[200px] overflow-hidden text-ellipsis">
                        <button
                          onClick={() => router.push(`/edit?id=${item._id}`)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )
                }

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
