import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/dbConnect';
import Banner from '@/lib/models/banner';
import fs from 'fs';

async function saveFile(file, subDir) {
  if (!file) return '';

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

export async function POST(req) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const image = formData.get('image');

    if (!title || !image) {
      return NextResponse.json({ success: false, message: 'Title and image are required.' }, { status: 400 });
    }

    // Validate file size (max 2MB)
    if (image.size > 2 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File size should be less than 2MB.' }, { status: 400 });
    }

    // Function to save the uploaded file

    // Save the image
    const imagePath = await saveFile(image, 'banners');

    // Store in the database
    const newBanner = await Banner.create({ title, image: imagePath });

    return new Response(JSON.stringify({ success: true, data: newBanner }), { status: 200 });
  } catch (error) {
    console.error('Error uploading banner:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}


export async function GET(req){
  await dbConnect();
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }).limit(4);
    return new Response(JSON.stringify({ success: true, data: banners }), { status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error', error:error.message }), { status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}