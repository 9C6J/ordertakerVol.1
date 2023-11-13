import { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
}

export type CartCookie = {
  product_id: string;
  quantity: number;
};

export type CartCookies = CartCookie[];