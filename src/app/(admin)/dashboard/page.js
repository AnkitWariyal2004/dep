"use client"
import Dashboard_C from "@/app/_components/Dashboard_C";
import { useSession } from "next-auth/react";
import { useRouter, } from "next/navigation";
import { useEffect } from "react";



export default function Page() {
  const { data: session, status } = useSession();
  const router= useRouter();
  useEffect(() => {
    if (status ==='authenticated') {
    }else{
      router.push('/')
    }
  }, [status, router]);
  return (
    <div className=" p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        <div  className="flex justify-center cursor-pointer h-[200px]">
          <Dashboard_C imageSrc="/Images/icons8-card-exchange.gif" text="PAN" fun={()=>{
            router.push('/pan');
          }}/>
        </div>

        <div  className="flex justify-center cursor-pointer h-[200px]">
          <Dashboard_C imageSrc="/Images/icons8-insurance.gif" text="Insurance"  fun={()=>{
            router.push('/insurance');
          }}/>
        </div>
        <div  className="flex justify-center cursor-pointer h-[200px]">
          <Dashboard_C imageSrc="/Images/icons8-card-exchange.gif" text="PAN" fun={()=>{
            router.push('/pan');
          }}/>
        </div>
        <div  className="flex justify-center cursor-pointer h-[200px]">
          <Dashboard_C imageSrc="/Images/icons8-card-exchange.gif" text="PAN" fun={()=>{
            router.push('/pan');
          }}/>
        </div>
        <div  className="flex justify-center cursor-pointer h-[200px]">
          <Dashboard_C imageSrc="/Images/icons8-card-exchange.gif" text="PAN" fun={()=>{
            router.push('/pan');
          }}/>
        </div>
        <div  className="flex justify-center cursor-pointer h-[200px]">
          <Dashboard_C imageSrc="/Images/icons8-card-exchange.gif" text="PAN" fun={()=>{
            router.push('/pan');
          }}/>
        </div>
        <div  className="flex justify-center cursor-pointer h-[200px]">
          <Dashboard_C imageSrc="/Images/icons8-card-exchange.gif" text="PAN" fun={()=>{
            router.push('/pan');
          }}/>
        </div>
        <div  className="flex justify-center cursor-pointer h-[200px]">
          <Dashboard_C imageSrc="/Images/icons8-card-exchange.gif" text="PAN" fun={()=>{
            router.push('/pan');
          }}/>
        </div>
        
    </div>
  );
}
