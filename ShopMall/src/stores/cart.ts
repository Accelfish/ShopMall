import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import type {ICartItem, ICart} from "../modal/ICart";

export const useCart =
    defineStore('cart',
        () => {
            const cartData: ICart = reactive({
                items: [],
            });
            const cart = computed(() => cartData.items);
            const addProduct = (product: ICartItem) => {
                console.log(product);
                const item = cartData.items.find((item) => item.productId === product.productId);
                console.log(item, product);
                if (item) {
                    item.quantity += product.quantity;
                } else {
                    cartData.items.push({
                        ...product,
                    });
                }
            };
            const minusProduct = (product: ICartItem, quantity: number) => {
                const item = cartData.items.find((item) => item.productId === product.productId);
                if (item) {
                    item.quantity -= quantity;
                    if (item.quantity === 0) {
                        removeProduct(product);
                    }
                }
            };
            const removeProduct = (product: ICartItem) => {
                const index = cartData.items.findIndex((item) => item.productId === product.productId);
                if (index !== -1) {
                    cartData.items.splice(index, 1);
                }
            };

            return {
                cart,
                addProduct,
                minusProduct,
                removeProduct,
            }
        }
    );
