"use client";
import Image from "next/image";
import { useState } from "react";
import { FaTimes, FaHome, FaExchangeAlt, FaFileInvoice, FaWallet, FaLink, FaClipboard, FaUser, FaGift, FaCode, FaTags, FaCog } from "react-icons/fa";
const Sidebar = ({ isOpen, setIsOpen }) => {
  const [testMode, setTestMode] = useState(false);

  return (
    <div className="">
      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
  className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 flex flex-col overflow-y-auto 
    transition-transform duration-300 ease-in-out z-50 
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0 lg:static lg:h-screen lg:overflow-y-auto`}
>
        {/* Close Button (Only for Mobile) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden mb-4 text-gray-600 self-end"
          aria-label="Close Sidebar"
        >
          <FaTimes size={20} />
        </button>

        

        <div className={`${isOpen ? "absolute" : "justify-center flex"
          }`}>
          <Image
            src="/Images/razorpay-logo.png" // Path to your image
            alt="Description of image"
            width={120} // Desired width
            height={100} // Desired height
          />
        </div>




        {/* Menu Items */}
        <nav className="flex-1 mt-4">
          <ul className="text-[1rem]">
            <MenuItem icon={<FaHome />} text="Home" active />
            <MenuItem icon={<FaExchangeAlt />} text="Transactions" />
            <MenuItem icon={<FaWallet />} text="Settlements" />
            <MenuItem icon={<FaFileInvoice />} text="Reports" />

            <SectionTitle title="PAYMENT PRODUCTS" />
            <MenuItem icon={<FaLink />} text="Payment Links" />
            <MenuItem icon={<FaClipboard />} text="Payment Page" />
            <MenuItem icon={<FaClipboard />} text="Razorpay.me " />

            <SectionTitle title="BANKING PRODUCTS" />
            <MenuItem icon={<FaTags />} text="X Payroll" />
            <MenuItem icon={<FaWallet />} text="Loans" />

            <SectionTitle title="CUSTOMER PRODUCTS" />
            <MenuItem icon={<FaUser />} text="Customers" />
            <MenuItem icon={<FaGift />} text="Offers" />
            <MenuItem icon={<FaCode />} text="Developers" />
            <MenuItem icon={<FaTags />} text="Apps & Deals" />
          </ul>
        </nav>


        {/* Bottom Section */}
        <div className="mt-10 rounded-md shadow-md">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Test Mode</span>
            <button
              className={`w-10 h-5 flex items-center rounded-full p-1 transition duration-300 ${testMode ? "bg-blue-500" : "bg-gray-300"
                }`}
              onClick={() => setTestMode(!testMode)}
              aria-label="Toggle Test Mode"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${testMode ? "translate-x-5" : "translate-x-0"
                  } transition duration-300`}
              ></div>
            </button>
          </div>
          <MenuItem icon={<FaCog />} text="Account & Settings" />
        </div>


      </div>
    </div>
  );
};

// Reusable Components
const MenuItem = ({ icon, text, active }) => (
  <li className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${active ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
    }`}>
    {icon && <span className="text-lg">{icon}</span>}
    <span>{text}</span>
  </li>
);

const SectionTitle = ({ title }) => (
  <li className="text-xs text-gray-400 uppercase mt-4 mb-2">{title}</li>
);

// const NavItem = ({ icon, text, active }) => (
//   <li className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${active ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
//     }`}>
//     {icon && <span className="text-lg">{icon}</span>}
//     <span>{text}</span>
//   </li>
// );

export default Sidebar;
