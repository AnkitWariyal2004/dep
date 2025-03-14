"use client";

import Image from "next/image";

const Dashboard_C = ({ imageSrc, text, fun }) => {
  return (
    <div className="shadow-md rounded-lg p-3 w-full max-w-[200px] h-fit flex flex-col items-center space-y-2" onClick={fun}>
      <Image src={imageSrc} alt="Card Icon" width={60} height={60} className="rounded-full" />
      <p className="text-gray-800 font-semibold text-center">{text}</p>
    </div>
  );
};

export default Dashboard_C;
