'use client'
import React, { useState } from 'react'
import Sidebar from "@/app/_components/SideBar";
import Header from "@/app/_components/Header";
import Payment from '@/app/_components/Payment';
function Page() {
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-2">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className='p-4 overflow-y-auto 
        lg:h-screen md:min-h-full'>
          <Payment/>
        </div>
      </div>
    </div>
  )
}

export default Page
