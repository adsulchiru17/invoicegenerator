const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

async function handler(req, res) {
  const { invoiceId } = req.query;

  const uri =
  "mongodb+srv://adsulchiranjiv958:jH0cEetII4pC0S6t@cluster0.c9wga1l.mongodb.net/invoices2?retryWrites=true&w=majority";
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  const db = client.db();
  const collection = db.collection("allInvoices");

  if (req.method === "PUT") {
    await collection.updateOne(
      { _id: new ObjectId(invoiceId) },
      {
        $set: {
          status: "paid",
        },
      }
    );
    client.close();
  }

  if (req.method === "DELETE") {
    await collection.deleteOne({ _id: new ObjectId(invoiceId) });

    res.status(200).json({ message: "Invoice deleted successfully" });
    client.close();
  }
}

export default handler;
