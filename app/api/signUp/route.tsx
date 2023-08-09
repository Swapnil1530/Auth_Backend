import { db } from "@/lib";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      throw new Error("Please fill all the fields");
    }
    const existUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existUser) {
      return NextResponse.json(
        { message: "User already exist" },
        { status: 400 }
      );
    }
    const hashedPassword = await hash(password, 10);
    const res = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json({ res }, { status: 201 });
  } catch (error: any) {
     throw new Error(error.message);
  }
};
