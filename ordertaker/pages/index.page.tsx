// pages/index.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import MainLayout from '~/layouts/MainLayout';
import Orange from '~/components/Orange';

import {Props} from "~/types/common";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>🍊</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-6xl font-bold">
        <a className="text-blue-600" href="https://nextjs.org">
        </a>
      </h1>

      <Orange />
    </MainLayout>
  );
};

export default Home;