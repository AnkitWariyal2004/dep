import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/user';
import Customer from '@/lib/models/customer';

export async function PUT(req) {
    await dbConnect();
  
    const { newPassword, confirmPassword, id } = await req.json();
    console.log("Received ID:", id);

  
    if (!newPassword || !confirmPassword) {
        return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
    }
    
    try {
        const user = await User.findById(id);
        const customer = await Customer.findOne({ userId: id});

        if (!user || !customer) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        customer.password = hashedPassword;
        
        await user.save();
        await customer.save();
  
        return NextResponse.json({ success: true, message: 'Password updated successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
