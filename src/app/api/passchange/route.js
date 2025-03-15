import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/user';
import Customer from '@/lib/models/customer';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();
  const userId = session.user.id;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({sucess:false, message: 'All fields are required' }, { status: 400 });
  }

  try {
    const user = await User.findById(userId);
    const customer= await Customer.findOne(
        {userId:userId}
    )
    if (!user || !customer) {
      return NextResponse.json({ sucess:false,message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({sucess:false, message: 'Incorrect current password' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    customer.password=hashedPassword;
    
    await user.save();
    await customer.save();

    return NextResponse.json({sucess:true, message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({sucess:false, message: 'Server error' }, { status: 500 });
  }
}
