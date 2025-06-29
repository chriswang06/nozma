
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("nozim");
    const collection = await db
      .collection("shutterfly")
      .aggregate([
        {
          $project: {
            _id: 1,
            created_at: 1,
            name: { 
              $let: {
                vars: {
                  firstAgent: { $first: { $objectToArray: "$agents" } }
                },
                in: "$$firstAgent.v.name"
              }
            }
          }
        }
      ])
      .toArray();
  

    
    
    return Response.json(collection);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}