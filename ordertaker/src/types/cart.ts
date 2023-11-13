import { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
}

export type CartCookie = {
  product_id: string;
  quantity: number;
};

export type CartCookies = CartCookie[];


// createProduct.page
  // type Product = {
  //   id : String;// 상품번호 
  //   title : string;// 상품제목 
  //   price : number;// 상품가격 
  //   imageSrc : string | null;// 상품이미지 
  //   size : number | null;// 상품사이즈
  //   order_qunatity_limit : number;// 1회구매시 최대수량 
  //   content : string;// 상품설명 
  // };

// productList.page
// type Product = {
//     id: number;
//     created_at: string;
//     title: string;
//     imageSrc : string;
//     price : number;
//   };