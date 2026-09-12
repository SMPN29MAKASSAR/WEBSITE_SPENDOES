import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    // Return as key-value object
    const data = settings.reduce((acc: Record<string, string>, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    // Support both array [{key, value}] or object {key: value} format
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item && typeof item.key === 'string' && typeof item.value === 'string') {
          await prisma.setting.upsert({
            where: { key: item.key },
            update: { value: item.value },
            create: { key: item.key, value: item.value }
          });
        }
      }
    } else {
      // Iterate and upsert all settings
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
