import { MongoClient, ServerApiVersion } from "mongodb";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home(props) {
  const { data } = props;

  const router = useRouter();
  const navigatePage = () => router.push("/add-new");
  return (
    <div className="main__container">
      <div className="invoice__header">
        <div className="invoice__header-logo">
          <h3>Invoices</h3>
          <p>There are total {data.length} invoices</p>
        </div>

        <button className="btn" onClick={navigatePage}>
          Add New
        </button>
      </div>

      <div className="invoice__container">
        {/* ============Invoice Item============= */}
        {data?.map((invoice) => (
          <Link href={`/invoices/${invoice.id}`} passHref key={invoice.id}>
            <div className="invoice__item">
              <div>
                <h5 className="invoice__id">
                  {invoice.id.substr(0, 7).toUpperCase()}
                </h5>
              </div>

              <div>
                <h6 className="invoice__client">{invoice.clietName}</h6>
              </div>

              <div>
                <p className="invoice__created">{invoice.createdAt}</p>
              </div>

              <div>
                <h3 className="invoice__total">&#8377; {invoice.total}</h3>
              </div>

              <div>
                <button
                  className={`${
                    invoice.status === "paid"
                      ? "paid__status"
                      : invoice.status === "pending"
                      ? "pending__status"
                      : "draft__status"
                  }`}
                >
                  {invoice.status}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
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

  const invoices = await collection.find({}).toArray();

  return {
    props: {
      data: invoices.map((invoice) => {
        return {
          id: invoice._id.toString(),
          clietName: invoice.clientName,
          createdAt: invoice.createdAt,
          total: invoice.total,
          status: invoice.status,
        };
      }),
    },
    revalidate: 1,
  };
}
