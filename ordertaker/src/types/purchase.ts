import { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
}

export type CartCookie = {
  product_id: string;
  quantity: number;
};

export type CartCookies = CartCookie[];

export type Purchase = {
    id?: string
    ,customer_id?: string
    ,order_at?: Date
    ,total_price: number // 주문총금액
    ,address: string    // 받을주소
    ,payment_method: string // 주문방법
    ,status: string // 주문상태
    ,purchaser_name : string // 구매자이름
    ,recipient_name : string // 수령인이름
    ,purchaser_phoneNumber : string // 구매자연락처
    ,recipient_phoneNumber : string // 수령인연락처
    ,order_request : string // 배송요청사항
    ,created_at?: Date
};

export type OrderDetail = {
    id: number,
    imageSrc?: string,
    order_id: number,
    price: number,  
    product_id: number,
    quantity: number,
    size?: number,
    title: string,
}

export type PurchaseHistory = {
    id?: string
    ,customer_id?: string
    ,order_at?: Date
    ,total_price: number // 주문총금액
    ,address: string    // 받을주소
    ,payment_method: string // 주문방법
    ,status: string // 주문상태
    ,purchaser_name : string // 구매자이름
    ,recipient_name : string // 수령인이름
    ,purchaser_phoneNumber : string // 구매자연락처
    ,recipient_phoneNumber : string // 수령인연락처
    ,order_request : string // 배송요청사항
    ,created_at?: Date
    ,orderDetail: OrderDetail[];
  }





