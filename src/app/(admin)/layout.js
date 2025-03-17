"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/_components/SideBar";
import Header from "@/app/_components/Header";
import { useSession } from "next-auth/react";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [windowWidth, setWindowWidth] = useState(0);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let Menus = [];
  if (status === "authenticated") {
    if (session?.user?.role === "admin") {
      Menus = [
        { title: "Dashboard", icon: "FaHome" },
        {
          title: "User",
          children: [
            { title: "Add Customer", icon: "FaUser" },
            { title: "Customer List", icon: "FaThList" },
          ],
        },
        {
          title: "Services",
          children: [
            { title: "Pan", icon: "FaNetworkWired" },
            { title: "Insurance", icon: "FaFileAlt" },
          ],
        },
        {
          title:"documents",
          children: [
            // { title: "Add Document", icon: "FaFile" },
            { title: "Document List", icon: "FaFileAlt" },
            ],
        },

        {
          title: "Settings",
          children: [
            { title: "Settings", icon: "FaCogs" },
            // { title: "Change Password", icon: "FaKey" },
            ],
        },
        // { title: "Settings", icon: "FaCog" },
      ];
    } else if (session?.user?.role === "customer") {
      Menus = [
        { title: "Dashboard", icon: "FaHome" },
        {
          title: "Services",
          children: [
            { title: "Pan", icon: "FaNetworkWired" },
            { title: "Insurance", icon: "FaFileAlt" },
          ],
        },
        {
          title: "Document",
          children: [
            // { title: "Add Document", icon: "FaUser" },
            { title: "Document List", icon: "FaThList" },
          ],
        },
        // {
        //   title: "Distributer",
        //   children: [
        //     { title: "Add Distributer", icon: "FaNetworkWired" },
        //     { title: "Distributer List", icon: "FaSitemap" },
        //   ],
        // },
                // { title: "Settings", icon: "FaCog" },
      ];
    }else if( session.user.role === "distributer"){
      Menus = [
        { title: "Dashboard", icon: "FaHome" },
        {
          title: "Document",
          children: [
            { title: "Add Document", icon: "FaUser" },
            { title: "Document List", icon: "FaThList" },
          ],
        },
        {
          title: "Distributer",
          children: [
            { title: "Add Distributer", icon: "FaNetworkWired" },
            { title: "Distributer List", icon: "FaSitemap" },
          ],
        },
                // { title: "Settings", icon: "FaCog" },
      ];
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen transition-transform duration-300 z-30 bg-white w-64 lg:w-1/6 md:w-1/4 sm:w-64 ${
          isSidebarOpen || windowWidth >= 1024 ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          Menus={Menus}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          windowWidth >= 1024 ? "lg:ml-[16.67%]" : "ml-0"
        } w-full relative z-10 min-h-screen`}
      >
        {/* Header */}
        <div className="fixed top-0 right-0 w-full lg:w-[83.33%] z-20 bg-white shadow-md">
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Content */}
        <div className={`overflow-y-auto p-4 flex-1 ${windowWidth <= 767 ? "mt-32" : "sm:mt-9"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
