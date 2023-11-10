
import { Product } from '~/types/product';
import ProductItem from './ProductItem';

interface ProductListProps {
  products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="container px-5 py-10 mx-auto w-2/3">
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products?.map((product) => (
          <ProductItem key={product.id} product={product} linkOption={true} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;