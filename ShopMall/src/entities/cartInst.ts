import type {ICart, ICartItem} from '../modal/ICart';
import type {IStore} from "@/modal/IProduct";
import axios from "axios";
import type {IProduct} from "@/modal/IProduct";
import api from "@/api/api";

export class CartInst implements ICart {
    items: ICartItem[];
    inventoryApi: string;

    constructor(items: ICartItem[], inventoryApi?: string) {
        this.items = items;
        this.inventoryApi = '/data.json';
    }

    async addItem(cartItem: ICartItem): Promise<void> {
        let inventory = 0;

        const productData: IProduct= await api.getProductDetail(cartItem.productId);
        if (productData) {
            inventory = productData.inventory;
        } else {
            throw new Error(
                'ProductInst Not Found',
            );
        }

        const item = this.items.find((item) => item.productId === cartItem.productId);
        if (inventory > 0) {
            if (item) {
                if (inventory >= item.quantity + cartItem.quantity) {
                    item.quantity += cartItem.quantity;
                }
            } else {
                if (inventory >= cartItem.quantity) {
                    this.items.push({
                        ...cartItem,
                        id: this.items.length + 1,
                    });
                }
            }
        } else {
            throw new Error(
                'Inventory Not Enough',
            );
        }
    }

    minusItem(cartItem: ICartItem, quantity: number) {
        const target = this.items.find((item) => item.productId === cartItem.productId);
        if (target) {
            target.quantity -= quantity;
            if (target.quantity === 0) {
                this.removeItem(cartItem);
            }
        }
    };

    removeItem(cartItem: ICartItem) {
        const index = this.items.findIndex((item) =>
            item.productId === cartItem.productId);

        if (index !== -1) {
            this.items.splice(index, 1);
        }
    };

    setItem(cartItem: ICartItem) {
        const itemIndex = this.items.findIndex((item) => item.productId === cartItem.productId);
        if (itemIndex !== -1) {
            this.items[itemIndex] = cartItem;
        }
    };

    getCart() {
        return this.items;
    }
}

export class CartItem implements ICartItem {
    isCheck: boolean;
    productId: number;
    name: string;
    price: number;
    quantity: number;
    store: IStore;
    onSell: boolean;
    inventory?: number;
    id?: number;
    image?: string;

    constructor(
        isCheck: boolean,
        productId: number,
        name: string,
        price: number,
        quantity: number,
        store: IStore,
        onSell: boolean,
        inventory?: number,
        image?: string,
        id?: number,
    ) {
        this.isCheck = isCheck;
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.onSell = onSell;
        this.inventory = inventory;
        this.store = store;
        this.id = id;
        this.image = image;
    }

    getImage(): string {
        return this.image || '';
    }

    setIsCheck(isCheck: boolean): void {
        this.isCheck = isCheck;
    }
}

export default {
    Cart: CartInst,
    CartItem,
}
