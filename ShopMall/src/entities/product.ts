import type { IProduct, IStore } from '../modal/IProduct';

export default class Product implements IProduct {
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

    constructor(
        id: number,
        name: string,
        price: number,
        sellPrice: number,
        additionPrice: number,
        inventory: number,
        rating: number,
        store: IStore,
        image?: string,
        description?: string
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.sellPrice = sellPrice;
        this.additionPrice = additionPrice;
        this.inventory = inventory;
        this.rating = rating;
        this.store = store;
        this.image = image;
        this.description = description;
    }
}
