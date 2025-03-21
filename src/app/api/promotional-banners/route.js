import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/dbConnect';
import fs from 'fs';
import PromotionalBanner from '@/lib/models/promotional';

export async function POST(req) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const image = formData.get('image');
    const link = formData.get('link')

    if (!title || !image ||!link) {
      return NextResponse.json({ success: false, message: 'Title, image and link are required.' }, { status: 400 });
    }

    // Validate file size (max 2MB)
    if (image.size > 2 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File size should be less than 2MB.' }, { status: 400 });
    }

    // Function to save the uploaded file
   
    async function saveFile(file, subDir) {
    if (!file) return '';
  
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name).toLowerCase();
    const fileName = `${uuidv4()}${ext}`;
    const folderPath = path.join(process.cwd(), 'public', 'uploads', subDir);
  
    // ✅ Ensure the directory exists before writing the file
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  
    const filePath = path.join(folderPath, fileName);
    await writeFile(filePath, buffer);
  
    return `/uploads/${subDir}/${fileName}`;
  }

    // Save the image
    const imagePath = await saveFile(image, 'promobanner');

    // Store in the database
    const newPromoBanner = await PromotionalBanner.create({ title, image: imagePath, link });

    return new Response(JSON.stringify({ success: true, data: newPromoBanner }), { status: 200 });
  } catch (error) {
    console.error('Error uploading banner:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}


export async function GET(req) {
  try {
    await dbConnect();
    // Fetch all banners (sorted by latest first)
    const banners = await PromotionalBanner.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify({ success: true, data: banners }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}