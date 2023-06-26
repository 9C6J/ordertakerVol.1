import React, { useState, useEffect} from "react";

import { supabase } from '../api/supabase';
import Image from 'next/image'

import { cn } from "../../lib/utils";
import ProductItem from "../../components/ProductItem";

// 서버로부터 완전하게 만들어진 html파일을 받아와 페이지 전체를 렌더링 하는 방식
// 남용시 서버에 부담을 줄 수 있다.
export const getServerSideProps = async () => {
  const { data: products, error } = await supabase.from('product').select('*');

  if(error){
    console.error(error);
    return {
      redirect: {
          destination: '/',
          statusCode: 307
      }
    }
  }else{
    return {
      props: {
        products
      }
    };
  }
}

type Product = {
  id: number;
  created_at: string;
  title: string;
  imageSrc : string;
  price : number;
};

// const Gallery = (props : Image|Image[]) => {
function ProductList({products} : { products : Product[]}){
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