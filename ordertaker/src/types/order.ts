// 주문
export type PurchaseOrder = {
    // id: string;
    customer_id: string | null
    // order_at: Date;
    ,total_price: number // 주문총금액
    ,address: string    // 받을주소
    ,payment_method: string // 주문방법
    ,status: string // 주문상태
    ,purchaser_name : string // 구매자이름
    ,recipient_name : string // 수령인이름
    ,purchaser_phoneNumber : string // 구매자연락처
    ,recipient_phoneNumber : string // 수령인연락처
    ,order_request : string // 배송요청사항
  }