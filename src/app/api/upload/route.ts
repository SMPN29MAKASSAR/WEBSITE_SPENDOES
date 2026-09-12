import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Prepare payload for ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append("key", process.env.IMGBB_API_KEY || "");
    imgbbFormData.append("image", base64Image);

    // Upload to ImgBB
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbFormData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("ImgBB Error:", data);
      throw new Error(data.error?.message || "Gagal mengunggah ke ImgBB");
    }

    // Return the URL from ImgBB
    return NextResponse.json({ url: data.data.url });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
