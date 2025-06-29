import clientPromise from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const client = await clientPromise;
    const db = client.db("nozim");
    const document = await db
      .collection("shutterfly")
      .findOne({ _id: id });
    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(document);
  } catch (e) {
    console.error(e);
     if (e instanceof Error && e.message.includes('ObjectId')) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}