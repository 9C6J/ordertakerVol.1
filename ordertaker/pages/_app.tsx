import React from "react";
import type { AppProps } from 'next/app'
import Head from "next/head";
import '../styles/globals.css'
import Layout from "../components/Layout";
import { MessageProvider } from "../lib/message";


function MyApp({ Component, pageProps}: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <MessageProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MessageProvider>

    </React.Fragment>
  );
}

export default MyApp;