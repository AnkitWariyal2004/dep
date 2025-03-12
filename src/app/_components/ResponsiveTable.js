"use client";
import React, { useState, useEffect } from "react";

const ResponsiveTable = () => {
  const [students, setStudents] = useState([]); 
  const [selectedRows, setSelectedRows] = useState({}); 
  const [selectAll, setSelectAll] = useState(false); 

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const res = await fetch(""); // Adjust API endpoint
//         const data = await res.json();
//         if (data.success) {
//           setStudents(data.data);
//         } else {
//           console.error("Failed to fetch students");
//         }
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       }
//     };

//     fetchStudents();
//   }, []);


  const handleCheckboxChange = (index) => {
    setSelectedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSelectAll = () => {
    const newSelectAllState = !selectAll;
    setSelectAll(newSelectAllState);


    const newSelectedRows = {};
    if (newSelectAllState) {
      students.forEach((_, index) => {
        newSelectedRows[index] = true;
      });
    }
    setSelectedRows(newSelectedRows);
  };

  return (
    <div className="border border-gray-300 rounded-lg shadow-md p-2">
      <div className="overflow-x-auto md:overflow-x-scroll">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              {[
                "Name",
                "Mobile",
                "Class",
                "Gender",
                "DOB",
                "State",
                "District",
                "City",
                "Address",
              ].map((heading, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          {/* <tbody>
            {students.map((item, index) => (
              <tr
                key={index}
                className={`border border-gray-300 ${
                  selectedRows[index] ? "bg-blue-100" : ""
                }`}

                onClick={()=>{}}
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows[index] || false}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.mobile}</td>
                <td className="px-4 py-2">{item.class}</td>
                <td className="px-4 py-2">{item.gender}</td>
                <td className="px-4 py-2">{item.dob}</td>
                <td className="px-4 py-2">{item.state}</td>
                <td className="px-4 py-2">{item.district}</td>
                <td className="px-4 py-2">{item.city}</td>
                 <td className="px-4 py-2">{item.address}</td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>
    </div>
  );
};

export default ResponsiveTable;
