
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("nozim");
    const collection = await db
      .collection("shutterfly")
      .find({})
      .limit(20)
      .toArray();
    
    return Response.json(collection);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}