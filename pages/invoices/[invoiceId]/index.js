import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { useRouter } from "next/router";
import React, { useRef } from "react";

import { toast } from "react-toastify";

const InvoiceDetails = (props) => {
  const { data } = props;
  const modalRef = useRef(null);

  const router = useRouter();
  const goBack = () => {
    router.push("/");
  };

  const updateStatus = async (invoiceId) => {
    const res = await fetch(`/api/invoices/${invoiceId}`, {
      method: "PUT",
    });

    const data = res.json();
    console.log(data);

    window.location.reload();
  };

  const deleteInvoice = async (invoiceId) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      toast.success(data.message);
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Show Modal
  const modalToggle = () => modalRef.current.classList.toggle("showModal");

  return (
    <div className="main__container">
      <div className="back__btn">
        <h6 onClick={goBack}>Go Back</h6>
      </div>

      <div className="invoice__details-header">
        <div className="details__status">
          <p>Status</p>
          <button
            className={`${
              data.status === "paid"
                ? "paid__status"
                : data.status === "pending"
                ? "pending__status"
                : "draft__status"
            }`}
          >
            {data.status}
          </button>
        </div>

        <div className="details__btns">
          <button
            className="edit__btn"
            onClick={() => router.push(`/edit/${data.id}`)}
          >
            Edit
          </button>

          {/* =====================DELETE MODAL================= */}

          <div className="delete__modal" ref={modalRef}>
            <div className="modal">
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to delete invoice #
                {data.id.substr(0, 7).toUpperCase()}? This action cannot be
                undone.
              </p>

              <div className="details__btns modal__btns">
                <button className="edit__btn" onClick={modalToggle}>
                  Cancel
                </button>
                <button
                  className="delete__btn"
                  onClick={() => deleteInvoice(data.id)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

          {/* =====================DELETE MODAL================= */}

          <button className="delete__btn" onClick={modalToggle}>
            Delete
          </button>

          <button
            onClick={() => updateStatus(data.id)}
            className={`${
              data.status === "paid" || data.status === "draft"
                ? "disabled"
                : ""
            } mark__as-btn`}
          >
            Mark as Paid
          </button>
        </div>
      </div>

      <div className="invoice__details">
        <div className="details__box">
          <div>
            <h4>{data.id.substr(0, 7).toUpperCase()}</h4>
            <p>{data.description}</p>
          </div>
          <div>
            <p>{data.senderAddress.street}</p>
            <p>{data.senderAddress.city}</p>
            <p>{data.senderAddress.postalCode}</p>
            <p>{data.senderAddress.country}</p>
          </div>
        </div>

        <div className="details__box">
          <div>
            <div className="invoice__created-date">
              <p>Invoice Date</p>
              <h4>{data.createdAt}</h4>
            </div>
            <div>
              <p className="invoice__payment">Payment date</p>
              <h4>{data.paymentDue}</h4>
            </div>
          </div>

          <div className="invoice__client-address">
            <p>Bill To</p>
            <h4>{data.clientName}</h4>
            <div>
              <p>{data.clientAddress.street}</p>
              <p>{data.clientAddress.city}</p>
              <p>{data.clientAddress.postalCode}</p>
              <p>{data.clientAddress.country}</p>
            </div>
          </div>

          <div>
            <p>Send To</p>
            <h4>{data.clientEmail}</h4>
          </div>
        </div>

        {/* ====================INVOICE ITEMS==================== */}
        <div className="invoice__item-box">
          <ul className="list">
            <li className="list__item">
              <p className="item__name-box">Item Name</p>
              <p className="list__item-box">Qty</p>
              <p className="list__item-box">Price</p>
              <p className="list__item-box">Total</p>
            </li>

            {/* ==========item 1============= */}
            {data?.items?.map((item, idx) => (
              <li className="list__item" key={idx}>
                <div className="item__name-box">
                  <h5>{item.name}</h5>
                </div>

                <div className="list__item-box">
                  <p>{item.quantity}</p>
                </div>
                <div className="list__item-box">
                  <p>&#8377;{item.price}</p>
                </div>
                <div className="list__item-box">
                  <p>&#8377;{item.total}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="grand__total">
          <h5>Grand Total</h5>
          <h2>&#8377;{data.total}</h2>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;

export async function getStaticPaths() {
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

  const invoices = await collection.find({}, { _id: 1 }).toArray();

  return {
    fallback: "blocking",
    paths: invoices.map((invoice) => ({
      params: {
        invoiceId: invoice._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  const { invoiceId } = context.params;

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
  const invoice = await collection.findOne({ _id: new ObjectId(invoiceId) });

  // console.log(invoice);

  return {
    props: {
      data: {
        id: invoice._id.toString(),
        senderAddress: invoice.senderAddress,
        clientAddress: invoice.clientAddress,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        description: invoice.description,
        createdAt: invoice.createdAt,
        paymentDue: invoice.paymentDue,
        items: invoice.items,
        total: invoice.total,
        status: invoice.status,
      },
    },
    revalidate: 1,
  };
}
