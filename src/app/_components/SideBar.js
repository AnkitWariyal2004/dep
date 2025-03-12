"use client";
import Image from "next/image";
import { redirect } from "next/navigation";
import * as FaIcons from "react-icons/fa"; // Import all FontAwesome icons

const Sidebar = ({ isOpen, setIsOpen, activeItem, setActiveItem, Menus }) => {
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
        className={`h-screen bg-white shadow-lg p-4 flex flex-col overflow-y-auto 
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
          <FaIcons.FaTimes size={20} />
        </button>

        {/* Logo */}
        <div className={`${isOpen ? "absolute" : "justify-center flex"}`}>
          <Image
            src="/Images/razorpay-logo.png"
            alt="Description of image"
            width={120}
            height={100}
          />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 mt-4">
          <ul className="text-[1rem]">
            {Menus.map((item, index) => {
              console.log("Menu Item:", item); // Debug: Check JSON structure
              
              const IconComponent = FaIcons[item.icon]; // Get icon dynamically
              
              return (
                <div key={index}>
                  {item.children ? (
                    <>
                      <SectionTitle title={item.title} />
                      {item.children.map((child, childIndex) => {
                        const ChildIconComponent = FaIcons[child.icon]; // Get child icon

                        return (
                          <MenuItem
                            key={childIndex}
                            icon={ChildIconComponent ? <ChildIconComponent /> : null}
                            text={child.title}
                            active={activeItem === child.title}
                            setActiveItem={setActiveItem}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <MenuItem
                      key={index}
                      icon={IconComponent ? <IconComponent /> : null}
                      text={item.title}
                      active={activeItem === item.title}
                      setActiveItem={setActiveItem}
                    />
                  )}
                </div>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section
        <div className="mt-10 rounded-md shadow-md">
          <MenuItem icon={<FaIcons.FaCog />} text="Account & Settings" />
        </div> */}
      </div>
    </div>
  );
};

// Reusable Components
const MenuItem = ({ icon, text, active, setActiveItem }) => (
  <li
    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
      active ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
    }`}
    onClick={() => {
      setActiveItem(text);
      const path = `${text.trim().replace(/\s+/g, "").toLowerCase()}`;
      redirect(path);
    }}
  >
    {icon && <span className="text-lg">{icon}</span>}
    <span>{text}</span>
  </li>
);

const SectionTitle = ({ title }) => (
  <li className="text-xs text-gray-400 uppercase mt-4 mb-2">{title}</li>
);

export default Sidebar;
