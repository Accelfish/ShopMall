export interface IStore {
    id: number;
    name: string;
    rating?: number;
    description?: string;
    image?: string;
}

export interface IGift {
    list: string;
    conditions: object;
}

export interface IPromotion {
    conditionAmount: number
    discount: number
}

export interface IProduct {
    id: number;
    name: string;
    price: number;
    sellPrice: number;
    additionPrice?: number;
    image?: string;
    inventory: number;
    description?: string;
    rating: number;
    store: IStore;
    onSell: boolean;
    getImage(): string;
}

export interface IMessage {
    id: number,
    name: string,
    message: string,
    rating: number,
    productId: number,
}
