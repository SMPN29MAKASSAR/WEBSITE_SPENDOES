import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
    });
    
    if (!response.ok) throw new Error("Failed to fetch");
    
    const html = await response.text();
    
    // Extract Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    const title = titleMatch ? titleMatch[1] : "";

    // Extract Image
    const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) || html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i);
    const image = imageMatch ? imageMatch[1] : "";

    // Extract Description
    const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) || html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const description = descMatch ? descMatch[1] : "";

    return NextResponse.json({ title, image, description });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}
