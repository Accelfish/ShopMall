import type { IProduct, IStore } from '../modal/IProduct';

export default class Product implements IProduct {
    // 編號
    id: number;
    // 名稱
    name: string;
    // 原價
    price: number;
    // 售價
    sellPrice: number;
    // 加購價
    additionPrice: number;
    // 評分
    rating: number;
    // 庫存
    inventory: number;
    // 店家
    store: IStore;
    // 是否上架
    onSell: boolean;
    // 圖片
    image?: string;
    // 描述
    description?: string;
    // 網址
    url?: string;

    constructor(
        id: number,
        name: string,
        price: number,
        sellPrice: number,
        additionPrice: number,
        inventory: number,
        rating: number,
        store: IStore,
        onSell: boolean,
        image?: string,
        description?: string,
        url?: string,
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
        this.onSell = onSell;
        this.url = url;
    }
}
