import type {IStore} from "@/modal/IProduct";

export interface ICartItem {
    isCheck: boolean,
    productId: number;
    name: string;
    price: number;
    quantity: number;
    store: IStore;
    onSell: boolean;
    inventory?: number;
    id?: number;
    image?: string;
}

export interface ICart {
    items: ICartItem[];
}
