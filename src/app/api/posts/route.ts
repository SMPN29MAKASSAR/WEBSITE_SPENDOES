import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    let userId = null;
    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (dbUser) userId = dbUser.id;
    }

    if (!userId) {
      const adminUser = await prisma.user.findUnique({ where: { email: "admin@sekolah.com" } });
      if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      userId = adminUser.id;
    }

    const body = await req.json();
    const { title, content, createdAt, imageUrl, externalUrl, publishedAt } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const postData: any = { title, content, authorId: userId };
    if (imageUrl !== undefined) { postData.imageUrl = imageUrl; }
    if (externalUrl !== undefined) { postData.externalUrl = externalUrl; }
    if (publishedAt) { postData.publishedAt = new Date(publishedAt); }
    
    if (createdAt) {
      // Ensure the date is valid and in ISO format
      const parsedDate = new Date(createdAt);
      if (!isNaN(parsedDate.getTime())) {
        postData.createdAt = parsedDate;
      }
    }

    const post = await prisma.post.create({
      data: postData,
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

