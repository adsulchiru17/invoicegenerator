import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        theme="light"
        pauseOnHover={false}
      ></ToastContainer>
      <Component {...pageProps} />
    </Layout>
  );
}
