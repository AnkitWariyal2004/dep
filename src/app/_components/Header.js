"use client";
import { FiSearch, FiUser } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { FaMoneyBillWave, FaUserFriends, FaUniversity, FaBriefcase } from "react-icons/fa";
import { useState } from "react";
import { redirect } from "next/navigation";

const Header = ({ toggleSidebar }) => {

  //userdetails
  const [isFiuserOpen, setFiuserOpen] = useState(false);
  return (
    <header className="fixed w-full top-0 lg:flex lg:flex-col lg:w-[calc(100%-16rem)]">
      <nav className="bg-white p-4 lg:hidden flex space-x-3 text-gray-700 text-sm overflow-y-auto whitespace-nowrap md:hidden">
        <NavItem icon={<FaMoneyBillWave />} text="Payments" />
        <NavItem icon={<FaUserFriends />} text="Partners" />
        <NavItem icon={<FaUniversity />} text="Banking" />
        <NavItem icon={<FaBriefcase />} text="Payroll" />
      </nav>
      <hr className="lg:hidden"/>
    

      <div className=" lg:shadow-md bg-white px-4 py-2 flex items-center justify-between">
        {/* Left Section - Sidebar Toggle & Logo */}
        <div className="flex items-center">
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 bg-blue-500 text-white rounded-md shadow-md relative right-2"
            aria-label="Toggle Sidebar"
          >
            <FaBars size={18} />
          </button>
          <hr  className="md:hidden"/>



          {/* Navigation Menu (Visible only on Desktop) */}
          <nav className="hidden md:flex space-x-6 text-gray-700 text-sm">
            <NavItem icon={<FaMoneyBillWave />} text="Payments" active />
            <NavItem icon={<FaUserFriends />} text="Partners" />
            <NavItem icon={<FaUniversity />} text="Banking" />
            <NavItem icon={<FaBriefcase />} text="Payroll" />
          </nav>
        </div>

       


        {/* Right Section - Search Bar & User Icon */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 pl-10 pr-4 py-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 "
            />
          </div>

          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => setFiuserOpen(!isFiuserOpen)}>
              <FiUser className="text-gray-600" />
            </button>
            {isFiuserOpen && (
              <div className="absolute right-0 mt-3 w-50 bg-white shadow-lg rounded-lg p-4 z-20">
                <p className="text-gray-700 font-medium">Ankit Wariyal</p>
                <p className="text-gray-500 text-sm">wariyalankit1212@gmail.com</p>
                <hr className="my-2" />
                <button className="w-full text-left text-red-500 hover:bg-gray-100 p-2 rounded">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>




      </div>
      
    </header>
  );
};





// Reusable Navigation Item

const NavItem = ({ icon, text }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button className="relative bg-white z-0" onClick={() => redirect(`/${text.toLowerCase()}`)}>
      <li
        className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer z-0`}
      >
        {icon && <span className="text-lg z-0">{icon}</span>}
        <span className="z-0">{text}</span>
      </li>

      {/* Dropdown Menu */}
    </button>
  );
};



export default Header;
