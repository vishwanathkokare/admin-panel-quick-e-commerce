import { NextRequest, NextResponse } from "next/server";
import ordersData from "./db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(ordersData, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, name, amount, orderItems, phoneNumber, address, status, paidBy } = body;

  ordersData.unshift({
    id: id ?? `ORD-${Math.floor(Math.random() * 10000)}`,
    name,
    amount,
    orderItems,
    phoneNumber,
    address,
    status: status ?? 'accepted',
    paidBy: paidBy ?? 'cash',
    avatar: "/placeholder.png",
    avatarFallback: name?.charAt(0)?.toUpperCase() ?? "U",
  });

  return NextResponse.json(ordersData, { headers: corsHeaders });
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400, headers: corsHeaders });
  }

  const body = await request.json();
  const { name, amount, orderItems, phoneNumber, address, status, paidBy } = body;

  const findIndex = ordersData.findIndex((order) => order.id === id);

  if (findIndex === -1) {
    return NextResponse.json({ message: "Order not found" }, { status: 404, headers: corsHeaders });
  }

  ordersData[findIndex] = {
    ...ordersData[findIndex],
    name: name ?? ordersData[findIndex].name,
    amount: amount ?? ordersData[findIndex].amount,
    orderItems: orderItems ?? ordersData[findIndex].orderItems,
    phoneNumber: phoneNumber ?? ordersData[findIndex].phoneNumber,
    address: address ?? ordersData[findIndex].address,
    status: status ?? ordersData[findIndex].status,
    paidBy: paidBy ?? ordersData[findIndex].paidBy,
  };

  return NextResponse.json(ordersData, { headers: corsHeaders });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400, headers: corsHeaders });
  }

  const findIndex = ordersData.findIndex((order) => order.id === id);

  if (findIndex === -1) {
    return NextResponse.json({ message: "Order not found" }, { status: 404, headers: corsHeaders });
  }

  ordersData.splice(findIndex, 1);

  return NextResponse.json(ordersData, { headers: corsHeaders });
}
