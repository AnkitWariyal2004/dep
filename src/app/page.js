'use client'
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [banners, setBanners] = useState([]);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/bannerupload");
        const data = await response.json();
        setBanners(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <><nav className="bg-white shadow-md p-4 fixed top-0 left-0 right-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10">
        <Link href="/">
          <span className="text-2xl font-bold text-gray-800">Brand</span>
        </Link>
        <button
          className="md:hidden p-2 text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <ul
          className={`md:flex md:space-x-6 absolute md:static bg-white md:bg-transparent w-full md:w-auto left-0 md:flex-row flex-col items-center p-6 md:p-0 transition-all duration-300 ease-in-out ${isOpen ? "top-16 shadow-lg" : "top-[-300px]"}`}
        >
          <li className="py-3 md:py-0">
            <Link href="/about" className="text-lg text-gray-800 hover:text-blue-600">About</Link>
          </li>
          <li className="py-3 md:py-0">
            <Link href="/services" className="text-lg text-gray-800 hover:text-blue-600">Services</Link>
          </li>
          <li className="py-3 md:py-0">
            <Link href="/contact" className="text-lg text-gray-800 hover:text-blue-600">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>


    <div className="max-w-6xl mx-auto p-4 mt-24">
  {banners.length > 0 && (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <div className="w-full h-full">
        <Image
          src={banners[currentIndex].image}
          alt={banners[currentIndex].title}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-fill"
          priority
        />
      </div>
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg text-lg font-medium">
        {banners[currentIndex].title}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-3 rounded-full text-black hover:bg-opacity-75"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-3 rounded-full text-black hover:bg-opacity-75"
      >
        ▶
      </button>
    </div>
  )}
</div>


      <div className="flex justify-center space-x-4 ">
        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Sign Up
        </button>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition shadow-md"
        >
          Login
        </button>
      </div>
    </>
  );
}