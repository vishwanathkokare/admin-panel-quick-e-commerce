import { NextRequest, NextResponse } from "next/server";
import productsData from "./db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(productsData, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, name, price, stock, category, status, image } = body;

  const newProduct = {
    id: id ?? `PROD-${Math.floor(Math.random() * 10000)}`,
    name,
    price: Number(price),
    stock: Number(stock),
    category: category ?? 'Uncategorized',
    status: status ?? 'draft',
    image: image ?? '',
  };

  productsData.unshift(newProduct);

  return NextResponse.json(productsData, { headers: corsHeaders });
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400, headers: corsHeaders });
  }

  const body = await request.json();
  const { name, price, stock, category, status, image } = body;

  const findIndex = productsData.findIndex((prod) => prod.id === id);

  if (findIndex === -1) {
    return NextResponse.json({ message: "Product not found" }, { status: 404, headers: corsHeaders });
  }

  productsData[findIndex] = {
    ...productsData[findIndex],
    name: name ?? productsData[findIndex].name,
    price: price !== undefined ? Number(price) : productsData[findIndex].price,
    stock: stock !== undefined ? Number(stock) : productsData[findIndex].stock,
    category: category ?? productsData[findIndex].category,
    status: status ?? productsData[findIndex].status,
    image: image ?? productsData[findIndex].image,
  };

  return NextResponse.json(productsData, { headers: corsHeaders });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400, headers: corsHeaders });
  }

  const findIndex = productsData.findIndex((prod) => prod.id === id);

  if (findIndex === -1) {
    return NextResponse.json({ message: "Product not found" }, { status: 404, headers: corsHeaders });
  }

  productsData.splice(findIndex, 1);

  return NextResponse.json(productsData, { headers: corsHeaders });
}