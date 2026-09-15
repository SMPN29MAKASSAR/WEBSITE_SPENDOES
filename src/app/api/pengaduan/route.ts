/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { nama, email, kategori, isiAduan, lampiran, captchaToken } = body;

    if (!captchaToken) {
      return NextResponse.json({ error: "Captcha wajib diisi" }, { status: 400 });
    }
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
    const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
    const recaptchaJson = await recaptchaRes.json();
    if (!recaptchaJson.success) {
      return NextResponse.json({ error: "Validasi Captcha Gagal" }, { status: 400 });
    }


    if (!nama || !kategori || !isiAduan) {
      return NextResponse.json({ error: "Nama, Kategori, and Isi Aduan are required" }, { status: 400 });
    }

    const tiketId = `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newPengaduan = await prisma.pengaduan.create({
      data: {
        tiketId,
        nama,
        email,
        kategori,
        isiAduan,
        lampiran,
      },
    });

    return NextResponse.json({ success: true, data: newPengaduan }, { status: 201 });
  } catch (error) {
    console.error("Error creating pengaduan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tiketId = searchParams.get("tiketId");

  try {
    if (tiketId) {
      const pengaduan = await prisma.pengaduan.findUnique({
        where: { tiketId },
      });

      if (!pengaduan) {
        return NextResponse.json({ error: "Pengaduan not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: pengaduan }, { status: 200 });
    } else {
      const pengaduan = await prisma.pengaduan.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(pengaduan);
    }
  } catch (error) {
    console.error("Error fetching pengaduan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

