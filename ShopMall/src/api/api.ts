import axios from 'axios';
import {useEnv} from "@/compositions/useEnv";
import type ProductInst from "@/entities/productInst";
import type StoreInst from "@/entities/storeInst";

const {VITE_BASE_API} = useEnv();
const productRequest = axios.create({baseURL: VITE_BASE_API});

const getProductList = (queryObj?: object): Promise<ProductInst[]> => new Promise((resolve, reject) => {
    productRequest.get('/data.json', {params: queryObj})
        .then((res) => {
            resolve(res.data)
        })
        .catch((err) => reject(err));
});

const getProductDetail = (id: number): Promise<ProductInst> => new Promise((resolve, reject) => {
    productRequest.get('/data.json', {params: {id: id}})
        .then((res) => resolve(res.data.find((item: any) => item.id === id)))
        .catch((err) => reject(err));
const getStore = (id: number): Promise<StoreInst> => new Promise((resolve, reject) => {
    productRequest.get('/data.json', {params: {storeId: id}})
        .then((res) => {
            const data:StoreInst[] = [...new Set(res.data.map((item:ProductInst) => item.store))] as StoreInst[];
            const store = data.find((item: any) => item.id === id);
            if(store) resolve(store);
            reject('store not found');
        })
        .catch((err) => reject(err));
});

const createOrder = (order: object): Promise<any> => new Promise((resolve, reject) => {
    if (!order) reject('order is empty');
    resolve({data: {order, orderId:1}});
});

export default {
    getProductList,
    getProductDetail,
    getStore,
    createOrder,
}
