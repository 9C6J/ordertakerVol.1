// 주문
export type PurchaseOrder = {
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
  }

  // export interface PurchaseOrderDetails extends PurchaseOrder {
  //   quantity: number;
  // }

  {
    "id": 33,
    "customer_id": "test",
    "order_at": "2023-11-14T04:59:31.550643+00:00",
    "total_price": 7113536,
    "address": "주소입니다",
    "payment_method": "무통장",
    "status": "주문요청",
    "purchaser_name": "구매자이름",
    "recipient_name": "수령인이름",
    "purchaser_phoneNumber": "01012341234",
    "recipient_phoneNumber": "01023452345",
    "order_request": "요청사항입니다",
    "created_at": "2023-11-14T04:59:31.550643+00:00",
    "orderDetail": [
        {
            "id": 19,
            "size": null,
            "price": 2314512,
            "order_id": 33,
            "product_id": 22,
            "quantity": 3,
            "title": "ㅅㄷㄴㅅㅅㄷ"
        },
        {
            "id": 20,
            "size": null,
            "price": 35000,
            "order_id": 33,
            "product_id": 14,
            "quantity": 2,
            "title": "제주산 한라봉"
        },
        {
            "id": 21,
            "size": null,
            "price": 25000,
            "order_id": 33,
            "product_id": 13,
            "quantity": 4,
            "title": "제주산 귤"
        }
    ]
}


export type PurchaseOrders = PurchaseOrder[];



