import { NextRequest, NextResponse } from "next/server";
import ordersData from "./db";

export async function GET() {
  return NextResponse.json(ordersData);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, name, amount, orderItems, phoneNumber, address} = body;

  ordersData.unshift({
    id,
    name,
    amount,
    orderItems,
    phoneNumber,
    address,
    status: 'accepted',
    paidBy: 'cash',
    avatar: "/placeholder.png",
    avatarFallback: name?.charAt(0)?.toUpperCase() ?? "U",
  });

  return NextResponse.json(ordersData);
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  const body = await request.json();
  const { name, amount, orderItems, phoneNumber, address, status, paidBy } = body;

  const findIndex = ordersData.findIndex((order) => order.id === id);

  if (findIndex === -1) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  ordersData[findIndex] = {
    ...ordersData[findIndex],
    name,
    amount,
    orderItems,
    phoneNumber,
    address,
    status,
    paidBy,
  };

  return NextResponse.json(ordersData);
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  const findIndex = ordersData.findIndex((order) => order.id === id);

  if (findIndex === -1) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  ordersData.splice(findIndex, 1);

  return NextResponse.json(ordersData);
}
