export interface ICartItem {
    //id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

export interface ICart {
    items: ICartItem[];
}
