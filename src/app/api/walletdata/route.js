import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/user';
import Customer from '@/lib/models/customer';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Wallet from '@/lib/models/wallet';

export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const customer = await Customer.findOne({ userId });
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }

    const wallet = await Wallet.findOne({ customerId: customer._id });
    if (!wallet) {
      return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Wallet found', data: wallet.ammount }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}
