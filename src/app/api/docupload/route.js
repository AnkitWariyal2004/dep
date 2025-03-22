import fs from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/dbConnect";
import Document from "@/lib/models/document";
import { NextResponse } from "next/server";
import Customer from "@/lib/models/customer";
import Wallet from "@/lib/models/wallet";
import Transaction from "@/lib/models/transaction";
import Price from "@/lib/models/price";

async function saveFile(file, subDir) {
    if (!file || file.size === 0) return "";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name).toLowerCase();
    const fileName = `${uuidv4()}${ext}`;

    if (![".jpg", ".jpeg", ".pdf"].includes(ext)) {
        throw new Error("Only JPG and PDF files are allowed.");
    }

    const folderPath = path.join(process.cwd(), "uploads", subDir);
    await fs.mkdir(folderPath, { recursive: true });

    const filePath = path.join(folderPath, fileName);
    await writeFile(filePath, buffer);

    return `/uploads/${subDir}/${fileName}`;
}

export async function addOrMinus(customer, walletId, amount, type) {
    if (!amount) {
        return { status: "failed", message: "Amount can't be null" };
    }
    
    const userWallet = await Wallet.findById(walletId);
    if (!userWallet) return { status: "failed", message: "Wallet not found" };

    let cumulative = userWallet.amount;
    if (type === "debit") {
        if (userWallet.amount < amount) {
            return { status: false, message: "Insufficient balance" };
        }
        cumulative -= amount;
    } else if (type === "credit") {
        cumulative += amount;
    }

    try {
        const transaction = await Transaction.create({
            customerId: customer._id,
            amount,
            type,
            status: "pending",
            walletId,
            remark: "Transaction recorded",
            cumulative,
        });
        
        userWallet.amount = cumulative;
        await userWallet.save();
        return { status: "success", message: "Transaction successful", transaction };
    } catch (error) {
        return { status: "failed", message: "Transaction failed", error: error.message };
    }
}

export async function POST(req) {
    await dbConnect();
    try {
        const formData = await req.formData();
        const type = formData.get("type");
        const category = formData.get("category");
        const panOption = formData.get("panOption");
        const userId = formData.get("userId");
        const customer = await Customer.findOne({ userId });
        if (!customer) return NextResponse.json({ success: false, message: "Customer not found" }, { status: 400 });

        const userWallet = await Wallet.findOne({ customerId: customer._id });
        if (!userWallet) return NextResponse.json({ success: false, message: "Wallet not found" }, { status: 400 });

        const price = await Price.findOne();
        let amount =
            panOption === "New PAN Card" ? price.newPenPrice :
            panOption === "PAN Card Renewal" ? price.renewalPenPrice :
            price.insurancePrice;

        const res = await addOrMinus(customer, userWallet._id, amount, type);
        if (res.status === "failed") {
            return NextResponse.json({ success: false, message: res.message }, { status: 400 });
        }

        const newDoc = await Document.create({
            category,
            name: formData.get("name"),
            dob: formData.get("dob"),
            fatherName: formData.get("fatherName"),
            panOption,
            mobile: formData.get("mobile"),
            status: formData.get("status") || "Pending",
            remark: formData.get("remark") || "",
            createdBy: formData.get("createdBy"),
            photo: await saveFile(formData.get("photo"), "photo"),
            signImage: await saveFile(formData.get("signImage"), "sign"),
            blueBookImage: await saveFile(formData.get("blueBookImage"), "bluebook"),
            previousPanImage: await saveFile(formData.get("previousPanImage"), "previouspan"),
            aadharBack: await saveFile(formData.get("aadharBack"), "aadharback"),
            aadharFront: await saveFile(formData.get("aadharFront"), "aadharfront"),
        });

        return new Response(JSON.stringify({ success: true, data: newDoc }), { status: 200 });
    } catch (error) {
        console.error("Error processing form submission:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error", error: error.message }), { status: 500 });
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
