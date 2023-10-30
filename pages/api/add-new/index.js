import { MongoClient, ServerApiVersion } from "mongodb";

async function handler(req, res) {
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

  // const client = await MongoClient.connect(
  //   "mongodb://localhost:27017/invoices",
  //   {
  //     sslCA: fs.readFileSync("/path/to/ssl_certificate.pem"),
  //     useNewUrlParser: true,
  //   }
  // );

  // const client = await MongoClient.connect(
  //   "mongodb://localhost:27017/invoices",
  //   {
  //     useNewUrlParser: true,
  //   }
  // );

  if (req.method === "POST") {
    const invoice = {
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
    };

    const db = client.db();
    const collection = db.collection("allInvoices");
    await collection.insertOne(invoice);

    res.status(200).json({ message: "Invoice added successfully" });

    client.close();
  }
}

export default handler;
