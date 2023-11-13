
export type Product = {
    id?: number;
    title: string;
    price : number;
    imageSrc : string | null;
    size: number | null;
    created_at?: string | null;
    content : string;
    order_qunatity_limit : number;
  };
