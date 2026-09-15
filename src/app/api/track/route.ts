/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.webStat.upsert({
      where: { date: today },
      update: { views: { increment: 1 } },
      create: { date: today, views: 1 }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

