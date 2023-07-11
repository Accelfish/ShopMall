import {defineStore} from "pinia";
import {computed, reactive} from "vue";
import {CartInst, CartItem} from "@/entities/cartInst";

export const useCart =
    defineStore('cart',
        () => {
            const cartData: CartInst = reactive(new CartInst([]));
            const cart = computed(() => cartData.getCart());
            const addProduct = async (product: CartItem) => {
                try {
                    await cartData.addItem(product);
                } catch(e: any) {
                    throw new Error(
                        e.message
                    );
                }
            }

            const minusProduct = (product: CartItem, quantity: number) => {
                cartData.minusItem(product, quantity);
            }

            const removeProduct = (product: CartItem) => {
                cartData.removeItem(product);
            }

            const setProduct = (product: CartItem) => {
                cartData.setItem(product);
            }

            return {
                cart,
                addProduct,
                minusProduct,
                removeProduct,
                setProduct
            }
        }
    );
