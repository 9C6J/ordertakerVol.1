// pages/index.tsx

import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import MainLayout from '~/layouts/MainLayout';
import Orange from '~/components/Orange';
import Test from './index2';

import Purchase from './purchase/index.page';
import ProductPage from './product/index.page';
import { supabase } from '~/api/supabase';
import { Product } from '~/types/product';

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: products, error } = await supabase.from('product').select('*');

  if (error) {
    console.error(error);
    return {
      redirect: {
        destination: '/',
        statusCode: 307,
      },
    };
  } else {
    return {
      props: {
        products,
      },
    };
  }
};

const Home = ({ products }: { products: Product[] }) => {

  return (
    <MainLayout>
      <Head>
        <title>🍊</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Orange />

      <Test />

      <ProductPage products={products} />

      {/* <Purchase/> */}
    </MainLayout>
  );
};

export default Home;