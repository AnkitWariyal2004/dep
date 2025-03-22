import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const UserInfoCard = ({ userData }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        User Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoItem label="Category" value={userData.category} />
        {userData.category === "Pan" && <InfoItem label="Pan Options" value={userData.panOption} />}
        <InfoItem label="Name" value={userData.name} />
        <InfoItem label="Date of Birth" value={userData.dob} />
        <InfoItem label="Father's Name" value={userData.fatherName} />
      </div>

      {/* Images Section */}
      <h3 className="text-xl font-semibold mt-6 mb-4">Documents</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FileCard title="Photo" src={`/api/uploads${userData.photo.replace("/uploads", "")}`} />
        {userData.previousPanImage && <FileCard title="Previous PAN" src={`/api/uploads${userData.previousPanImage.replace("/uploads", "")}`} />}
        {
          userData.blueBookImage &&         <FileCard title="Bluebook" src={`/api/uploads${userData.blueBookImage.replace("/uploads", "")}`} />
        }

        <FileCard title="Aadhar Front" src={`/api/uploads${userData.aadharFront.replace("/uploads", "")}`} />
        <FileCard title="Aadhar Back" src={`/api/uploads${userData.aadharBack.replace("/uploads", "")}`} />
        <FileCard title="Sign" src={`/api/uploads${userData.signImage.replace("/uploads", "")}`} />
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="font-semibold text-gray-800 break-words">{value}</p>
  </div>
);

const FileCard = ({ title, src }) => {
  if (!src) return null;

  const isPDF = src.toLowerCase().endsWith(".pdf");

  return (
    <div className="text-center bg-gray-50 p-4 rounded-lg shadow">
      <p className="text-sm font-medium text-gray-700 mb-2">{title}</p>
      <div className="relative w-full h-40 md:h-48 lg:h-56 rounded-lg overflow-hidden shadow flex items-center justify-center bg-gray-200">
        {isPDF ? (
          <p className="text-gray-500">PDF Document</p>
        ) : (
          <Image src={src} alt={title} layout="fill" objectFit="fill" />
        )}
      </div>
      <a href={src} download className="mt-2 inline-block w-full">
        <Button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm sm:text-base">
          <Download size={18} className="shrink-0 sm:size-5 md:size-6" />
          <span className="whitespace-nowrap">Download</span>
        </Button>
      </a>
    </div>
  );
};

export default UserInfoCard;
