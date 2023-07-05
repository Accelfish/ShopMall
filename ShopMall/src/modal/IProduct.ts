export interface IStore {
    id: number;
    name: string;
    description?: string;
    rating: number;
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
    additionPrice: number;
    image?: string;
    inventory: number;
    description?: string;
    rating: number;
    store: IStore;
    onSell: boolean;
}
