import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/user';
import Customer from '@/lib/models/customer';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Transaction from '@/lib/models/transction';
import Wallet from '@/lib/models/wallet';


export async function addorminus(customerId,walletId,ammount,type){
  const userWallet = await Wallet.findOne({ customerId: customerId});
  let cumilative=0
  if(type ==="debit"){
    const walletbal= userWallet.ammount
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
      customerId,
      ammount,
      type,
      status: "pending",
      walletId,
      remark: "still nothing",
      cumilative,
    });
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

export async function PUT(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ammount, type } = await req.json();
    Number(ammount)
    if (!ammount || ammount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid amount" }, { status: 400 });
    }

    const userId = session.user.id;
    const user = await User.findById(userId);
    const customer = await Customer.findOne({ userId: userId });
    const userWallet = await Wallet.findOne({ customerId: customer?._id });

    if (!user || !customer) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    if (!userWallet) {
      return NextResponse.json({ success: false, message: "Wallet not found" }, { status: 404 });
    }

    if (type === "credit") {

    const res= await addorminus(customer._id,userWallet._id,ammount,type);
    if(res.status==="success"){
    return NextResponse.json({ success: true, message: res.message, transaction:res.transaction }, { status:200});
    }
    return NextResponse.json({success: false,message:res.message,error:res.error},{ status: 400 })  
    }else if(type==="debit"){
    const res= await addorminus(customer._id,userWallet._id,ammount,type);
    if(res.status==="success"){
    return NextResponse.json({ success: true, message: res.message, transaction:res.transaction }, { status:200});
    }
    return NextResponse.json({success: false,message:res.message,error:res.error},{ status: 400 })
    }
  } catch (error) {
    console.error("Transaction Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}


export async function GET(req){
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status:
      401 });
      }
     try {
        if(session.user.role==="admin"){
          const allTrans= await Transaction.find({}).populate("customerId","name -_id");
          // console.log(allTrans)
          return NextResponse.json({ success: true, data: allTrans });
        }else if (session.user.role==="customer"){
          // console.log(session.user.id)
          const customer = await Customer.findOne({ userId: session.user.id });
          // const wallet = Wallet.findOne({customerId:customer._id})
          // console.log("wakket"+wallet)
          const customerTrans= await Transaction.find({customerId:customer._id}).populate("customerId","name -_id");
          // console.log(customerTrans)
          return NextResponse.json({ success: true, data: customerTrans });
        }
     } catch (error) {
      console.error("Error fetching transactions:", error);
      return NextResponse.json({ success: false, message: "Server error" }, { status:500 });  
     }
       
}