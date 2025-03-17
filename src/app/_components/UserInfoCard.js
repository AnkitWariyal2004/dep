import Image from "next/image";

const UserInfoCard = ({ userData }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        User Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="Category" value={userData.category} />
        <InfoItem label="Pan Options" value={userData.panOptions} />
        <InfoItem label="Name" value={userData.name} />
        <InfoItem label="Date of Birth" value={userData.dob} />
        <InfoItem label="Father's Name" value={userData.fatherName} />
      </div>

      {/* Images Section */}
      <h3 className="text-xl font-semibold mt-6 mb-4">Documents</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ImageCard title="Photo" src={userData.photo} />
        <ImageCard title="Previous PAN" src={userData.previousPanImage} />
        <ImageCard title="Aadhar Front" src={userData.aadharFrontImage} />
        <ImageCard title="Aadhar Back" src={userData.aadharBackImage} />
        <ImageCard title="Bluebook" src={userData.bluebookImage} />
      </div>
    </div>
  );
};

// Info Item Component
const InfoItem = ({ label, value }) => (
  <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

// Image Card Component
const ImageCard = ({ title, src }) => {
  return (
    <div className="text-center">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <div className="relative w-full h-40 md:h-48 lg:h-56 rounded-lg overflow-hidden shadow">
        <Image src={src} alt={title} layout="fill" objectFit="cover" />
      </div>
    </div>
  );
};

// Sample Data (Example Usage)

// Render Component
export default UserInfoCard;