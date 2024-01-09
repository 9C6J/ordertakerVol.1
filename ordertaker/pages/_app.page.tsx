import React from "react";
import type { AppProps } from 'next/app'
import Head from "next/head";
import '~/styles/globals.css';
import Layout from "./src/root/main-layout"; 
import { MessageProvider } from "../src/common/message";
import { AuthProvider } from "../src/common/auth";
import { RecoilRoot } from 'recoil';


function MyApp({ Component, pageProps}: AppProps) {
  
  return (
    <RecoilRoot>
        <Head>
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>
        <MessageProvider>
          <AuthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
              {/* <Component {...pageProps} /> */}
          </AuthProvider>
        </MessageProvider>
    </RecoilRoot>
  );
}

export default MyApp;
