import React from 'react'
import UserInfoCard from '@/app/_components/UserInfoCard'

const Page = () => {
  const sampleUserData = {
    category: "Individual",
    panOptions: "New PAN",
    name: "John Doe",
    dob: "1990-01-01",
    fatherName: "Robert Doe",
    photo: "/Images/photo.jpeg",
    previousPanImage: "/Images/R.jfif",
    aadharFrontImage: "/Images/R.jfif",
    aadharBackImage: "/Images/R.jfif",
    bluebookImage: "/Images/R.jfif",
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <UserInfoCard userData={sampleUserData}/>
    </div>
  )
}

export default Page
