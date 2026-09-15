import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
    });
    
    if (!response.ok) throw new Error("Failed to fetch");
    
    const html = await response.text();
    
    const getMeta = (prop: string) => {
      const regex1 = new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i');
      const regex2 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${prop}["']`, 'i');
      const regex3 = new RegExp(`<meta[^>]*name=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i');
      const regex4 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${prop}["']`, 'i');
      
      const match = html.match(regex1) || html.match(regex2) || html.match(regex3) || html.match(regex4);
      return match ? match[1] : "";
    }

    let title = getMeta("og:title") || getMeta("twitter:title");
    if (!title) {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      title = titleMatch ? titleMatch[1].trim() : "";
    }

    let image = getMeta("og:image") || getMeta("twitter:image");
    
    // Fallback: get first image inside the body if og:image fails
    if (!image) {
      const imgMatch = html.match(/<img[^>]*src=["']([^"']+)["']/i);
      if (imgMatch) {
        image = imgMatch[1];
      }
    }

    if (image && image.startsWith('/')) {
        const urlObj = new URL(targetUrl);
        image = `${urlObj.protocol}//${urlObj.host}${image}`;
    }

    let description = getMeta("og:description") || getMeta("description");

    return NextResponse.json({ title, image, description });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}
