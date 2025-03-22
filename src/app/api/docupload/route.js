import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/dbConnect";
import Document from "@/lib/models/document";
import { NextResponse } from "next/server";
import Customer from "@/lib/models/customer";
import Wallet from "@/lib/models/wallet";
import Transaction from "@/lib/models/transction";
import Price from "@/lib/models/price";
// import { put } from "@vercel/blob";

// export async function POST(req) {
//   await dbConnect();

//   try {
//     const formData = await req.formData();

//     // Extract form data fields
//     const category = formData.get("category");
//     const name = formData.get("name");
//     const dob = formData.get("dob");
//     const fatherName = formData.get("fatherName");
//     const mobile = formData.get("mobile");
//     const status = formData.get("status");
//     const remark = formData.get("remark") || "";
//     const createdBy = formData.get("createdBy");
//     const panOption = formData.get("panOption");

//     // Extract files
//     const photo = formData.get("photo");
//     const signImage = formData.get("signImage");
//     const aadharBack = formData.get("aadharBack");
//     const aadharFront = formData.get("aadharFront");
//     const previousPanImage = formData.get("previousPanImage");
//     const blueBookImage = formData.get("blueBookImage");



//     if(category==="Pan"){
//       if(panOption==="New PAN Card"){
//         if (!category && !name
//           && !dob && !fatherName && !mobile && !createdBy && !panOption 
//           && !photo && !signImage && !aadharBack && !aadharFront
//         ) {
//           return Response.json({ error: "You Must Have to fill category, name, dob, fatherName, mobile,createdBy, panOption,photo, signImage, aadharBack, aadharFront."}, { status: 400 });
//         }
//       }else{
//         if (!category && !name
//           && !dob && !fatherName && !mobile && !createdBy && !panOption &&!previousPanImage
//           && !photo && !signImage && !aadharBack && !aadharFront
//         ) {
//           return Response.json({ error: "You Must Have to fill category, name, dob, fatherName, mobile,createdBy, panOption,photo, signImage, aadharBack, aadharFront and previousPanImage."}, { status: 400 });
//         }
//       }
//     }else{
//       return Response.json({ error: "You Must Have to fill name, dob, fatherName, mobile, aadharBack, aadharFront and blueBookImage."}, { status: 400 });
//     }


//     // Function to upload a file to Vercel Blob
//     async function uploadFile(file, subDir) {
//       if (!file || file.size === 0) return ""; // If no file uploaded, return empty string

//       const fileName = `${subDir}/${uuidv4()}-${file.name}`; // Unique filename
//       const { url } = await put(fileName, file, { access: "public" }); // Upload to Vercel Blob
//       return url; // Return the file URL
//     }

//     // Upload files to Vercel Blob
//     const photoPath = await uploadFile(photo, "photo");
//     const signPath = await uploadFile(signImage, "sign");
//     const aadharBackPath = await uploadFile(aadharBack, "aadharback");
//     const aadharFrontPath = await uploadFile(aadharFront, "aadharfront");
//     const blueBookPath = await uploadFile(blueBookImage, "bluebook");
//     const previousPanImagePath = await uploadFile(previousPanImage, "previouspan");

//     // Create document in MongoDB
//     const newDoc = await Document.create({
//       category,
//       name,
//       dob,
//       fatherName,
//       panOption,
//       mobile,
//       status,
//       remark,
//       createdBy,
//       photo: photoPath,
//       signImage: signPath,
//       blueBookImage: blueBookPath,
//       previousPanImage: previousPanImagePath,
//       aadharBack: aadharBackPath,
//       aadharFront: aadharFrontPath,
//     });

//     return new Response(JSON.stringify({ success: true, data: newDoc }), { status: 200 });
//   } catch (error) {
//     console.error("Error processing form submission:", error);
//     return new Response(
//       JSON.stringify({ success: false, message: "Internal Server Error", error: error.message }),
//       { status: 500 }
//     );
//   }
// }

async function saveFile(file, subDir) {
  if (!file || file.size === 0) return "";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name).toLowerCase();
  const fileName = `${uuidv4()}${ext}`;

  // ✅ Allow only JPG and PDF
  if (!['.jpg', '.jpeg', '.pdf'].includes(ext)) {
      throw new Error('Only JPG and PDF files are allowed.');
  }

  // Save in `/uploads/` (outside `public/`)
  const folderPath = path.join(process.cwd(), 'uploads', subDir);

  if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/${subDir}/${fileName}`;  // Return relative path
}

export async function addorminus(customer,walletId,ammount,type){
  if(ammount === null){
    return {
      status: "failed",
      message: "ammount can't be null",
    }
  }
  const userWallet = await Wallet.findById(walletId);
  let cumilative=0
  if(type ==="debit"){
    const walletbal= userWallet.ammount
    // console.log("wallet balance :"+walletbal)
    if(walletbal<ammount){
      return {
        status: false,
        message: "Insufficient balance",
        error:"Insuficient balance in your wallet"
      }
    }
    cumilative = walletbal - ammount
  }else if(type==="credit"){
    cumilative = userWallet.ammount + ammount
  }
  try {
    const transaction = await Transaction.create({
      customerId:customer._id,
      ammount:ammount,
      type:type,
      status: "pending",
      walletId:walletId,
      remark: "still nothing",
      cumilative:cumilative,
    });
    // console.log("transaction:"+transaction)
    userWallet.ammount = transaction.cumilative;
    await userWallet.save();
    if(type==="credit"){
      return {
        status: "success",
        message: "Transaction added successfully",
        transaction:transaction
      }
    }else{
      return {
        status: "success",
        message: "Transaction successfull",
        transaction:transaction
      }
    }
  } catch (error) {
    return {
      status: "failed",
      message: "Transaction failed",
      error:error
    }
  }
 
  
} 

export async function GET(req) {
  try {
    await dbConnect(); // Ensure database connection

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const userID = searchParams.get("userID");

    if (!role || !userID) {
      return NextResponse.json({ success: false, message: "Missing role or userID" }, { status: 400 });
    }

    let documents = [];

    if (role === "admin") {
      // ✅ Fetch all documents for admin
      documents = await Document.find({}).populate("createdBy", "name");
    }
    else if (role === "customer") {
      // ✅ Fetch documents created by the user (customer)
      documents = await Document.find({ createdBy: userID });
    }
    else {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: documents }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}



export async function POST(req) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const type =  await formData.get("type");
    const category = await formData.get("category");
    const panOption = await formData.get("panOption");
    // const ammount = await formData.get("ammount");
    let ammount;

    // Extract form data fields
    const userId = await formData.get("userId");
    const customer = await Customer.findOne({ userId })
    const userWallet = await Wallet.findOne({customerId: customer._id})
    const price= await Price.findOne();
    console.log("category :"+category)
    console.log("category :"+panOption)
    console.log("price : "+price)
    if(panOption==="New PAN Card"){
      ammount=price.newPenPrice
    }else if(panOption==="PAN Card Renewal"){
      ammount=price.renewalPenPrice
    }else {
      ammount = price.insurancePrice
    }

    console.log("ammount: "+ammount)
    const res = await addorminus(customer, userWallet._id, ammount, type)
    if (res.status === false || res.status === "failed") {
      return NextResponse.json({ success: false, message: res.message, error: res.error }, { status: 400 });
    }



    const name = formData.get("name");
    const dob = formData.get("dob");
    const fatherName = formData.get("fatherName");
    const mobile = formData.get("mobile");
    const status = formData.get("status");
    const remark = formData.get("remark") || "";
    const createdBy = formData.get("createdBy");


    // Extract files
    const photo = formData.get("photo");
    const signImage = formData.get("signImage");
    const aadharBack = formData.get("aadharBack");
    const aadharFront = formData.get("aadharFront"); // ✅ Now declared
    const previousPanImage = formData.get("previousPanImage");
    const blueBookImage = formData.get("blueBookImage");

    // Function to save a file and return its path
    // async function saveFile(file, subDir) {
    //   if (!file || file.size === 0) return ""; // If no file uploaded, return empty string

    //   const bytes = await file.arrayBuffer();
    //   const buffer = Buffer.from(bytes);

    //   // Get file extension
    //   const ext = path.extname(file.name).toLowerCase();
    //   const fileName = `${uuidv4()}${ext}`; // Generate unique filename
    //   const folderPath = path.join(process.cwd(), "public", "uploads", subDir);

    //   // Create directory if it doesn't exist
    //   if (!fs.existsSync(folderPath)) {
    //     fs.mkdirSync(folderPath, { recursive: true });
    //   }

    //   const filePath = path.join(folderPath, fileName);
    //   await writeFile(filePath, buffer);

    //   return `/uploads/${subDir}/${fileName}`; // Relative path for frontend
    // }

    // Save files
    const photoPath = await saveFile(photo, "photo");
    const signPath = await saveFile(signImage, "sign");
    const aadharBackPath = await saveFile(aadharBack, "aadharback");
    const aadharFrontPath = await saveFile(aadharFront, "aadharfront");
    const blueBookPath = await saveFile(blueBookImage, "bluebook");
    const previousPanImagePath = await saveFile(previousPanImage, "previouspan");


    // Create document in MongoDB
    const newDoc = await Document.create({
      category,
      name,
      dob,
      fatherName,
      panOption,
      mobile,
      status:status||"Pending",
      remark,
      createdBy,
      photo: photoPath,
      signImage: signPath,
      blueBookImage: blueBookPath,
      previousPanImage: previousPanImagePath,
      aadharBack: aadharBackPath,
      aadharFront: aadharFrontPath,
    });

    return new Response(JSON.stringify({ success: true, data: newDoc }), { status: 200 });
  } catch (error) {
    console.error("Error processing form submission:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}