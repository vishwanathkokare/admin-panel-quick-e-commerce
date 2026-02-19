import { NextRequest, NextResponse } from "next/server";
import usersData from "./db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(usersData, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, name, email, role, status, avatar } = body;

  const newUser = {
    id: id ?? `USR-${Math.floor(Math.random() * 10000)}`,
    name,
    email,
    role: role ?? 'user',
    status: status ?? 'active',
    avatar: avatar ?? '',
  };

  usersData.unshift(newUser);

  return NextResponse.json(usersData, { headers: corsHeaders });
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400, headers: corsHeaders });
  }

  const body = await request.json();
  const { name, email, role, status, avatar } = body;

  const findIndex = usersData.findIndex((user) => user.id === id);

  if (findIndex === -1) {
    return NextResponse.json({ message: "User not found" }, { status: 404, headers: corsHeaders });
  }

  usersData[findIndex] = {
    ...usersData[findIndex],
    name: name ?? usersData[findIndex].name,
    email: email ?? usersData[findIndex].email,
    role: role ?? usersData[findIndex].role,
    status: status ?? usersData[findIndex].status,
    avatar: avatar ?? usersData[findIndex].avatar,
  };

  return NextResponse.json(usersData, { headers: corsHeaders });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400, headers: corsHeaders });
  }

  const findIndex = usersData.findIndex((user) => user.id === id);

  if (findIndex === -1) {
    return NextResponse.json({ message: "User not found" }, { status: 404, headers: corsHeaders });
  }

  usersData.splice(findIndex, 1);

  return NextResponse.json(usersData, { headers: corsHeaders });
}