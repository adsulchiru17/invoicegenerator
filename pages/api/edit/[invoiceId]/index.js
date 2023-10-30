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
      {
        _id: new ObjectId(invoiceId),
      },
      {
        $set: {
          senderAddress: {
            street: req.body.senderStreet,
            city: req.body.senderCity,
            postalCode: req.body.senderPostalCode,
            country: req.body.senderCountry,
          },
          clientName: req.body.clientName,
          clientEmail: req.body.clientEmail,
          clientAddress: {
            street: req.body.clientStreet,
            city: req.body.clientCity,
            postalCode: req.body.clientPostalCode,
            country: req.body.clientCountry,
          },
          createdAt: req.body.createdAt,
          paymentDue: req.body.createdAt,
          paymentTerms: req.body.paymentTerms,
          description: req.body.description,
          status: req.body.status,
          items: req.body.items,
          total: req.body.total,
        },
      }
    );
    res.status(200).json({ message: "Invoice updated successfully" });
  }
  client.close();
}

export default handler;
