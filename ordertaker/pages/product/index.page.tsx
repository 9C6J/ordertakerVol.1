import { GetServerSideProps } from 'next';
import ProductList from './src/ui/ProductList';
import { Product } from '~/types/product';
import { supabase } from '~/api/supabase';

const ProductPage = ({ products }: { products: Product[] }) => {
  return <ProductList products={products} />;
};

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

export default ProductPage;