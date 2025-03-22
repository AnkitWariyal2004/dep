"use client"
import Dashboard_C from "@/app/_components/Dashboard_C";
import Image from "next/image";
// import { useSession } from "next-auth/react";
import { useRouter, } from "next/navigation";
import { useEffect, useState } from "react";



export default function Page() {
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/promotional-banners');
      const data = await response.json();
      console.log(data)
      setBanners(data.data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };
  const router = useRouter();
  return (
    <>

      <div className=" p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        <div className="flex justify-center cursor-pointer h-full">
          <Dashboard_C imageSrc="/Images/icons8-card-exchange.gif" text="PAN" fun={() => {
            router.push('/pan');
          }} />
        </div>

        <div className="flex justify-center cursor-pointer h-[200px]">
          <Dashboard_C imageSrc="/Images/icons8-insurance.gif" text="Insurance" fun={() => {
            router.push('/insurance');
          }} />
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {banners.map((banner) => (
          <div key={banner._id} className="border p-4 rounded shadow-md">
            <Image
              src={`/api/uploads${banner.image.replace("/uploads", "")}`} // Corrected path
              alt={banner.title}
              width={400}
              height={400}
              className="w-full h-40 object-fill rounded"
              priority // Ensures the image loads faster
            />

            <h3 className="text-lg font-semibold mt-2">{banner.title}</h3>
            {banner.link && (
              <a
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Sale
              </a>
            )}
          </div>
        ))}
      </div>

    </>
  );
}
