"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
// import Image from "next/image";
import { redirect } from "next/navigation";
import * as FaIcons from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen, activeItem, setActiveItem, Menus }) => {
  const pathname = usePathname(); // Get current URL path

  useEffect(() => {
    if (!pathname) return;

    // Extract last part of URL (e.g., /customerlist → customerlist)
    const currentPath = pathname.split("/").pop();
    
    let foundItem = null;

    // Check if a menu item matches the path
    Menus.forEach((item) => {
      const formattedTitle = item.title.toLowerCase().replace(/\s+/g, "");
      if (formattedTitle === currentPath) {
        foundItem = item.title;
      } else if (item.children) {
        item.children.forEach((child) => {
          const formattedChildTitle = child.title.toLowerCase().replace(/\s+/g, "");
          if (formattedChildTitle === currentPath) {
            foundItem = child.title;
          }
        });
      }
    });

    // If we found a match, update the active item
    if (foundItem) {
      setActiveItem(foundItem);
      console.log("Active Item Set:", foundItem);
    }
  }, [pathname, Menus, setActiveItem]); // Run effect when pathname changes

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
          {/* <Image
            src="/Images/razorpay-logo.png"
            alt="Description of image"
            width={120}
            height={100}
          /> */}
          <h1 className="text-2xl font-bold text-gray-600">EmuRecharge</h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 mt-4">
          <ul className="text-[1rem]">
            {Menus.map((item, index) => {
              const IconComponent = FaIcons[item.icon];

              return (
                <div key={index}>
                  {item.children ? (
                    <>
                      <SectionTitle title={item.title} />
                      {item.children.map((child, childIndex) => {
                        const ChildIconComponent = FaIcons[child.icon];

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
      const path = text.trim().replace(/\s+/g, "").toLowerCase();
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
