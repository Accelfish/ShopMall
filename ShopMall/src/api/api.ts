import axios from 'axios';
import {useEnv} from "@/compositions/useEnv";
import type ProductInst from "@/entities/productInst";

const {VITE_BASE_API} = useEnv();
const productRequest = axios.create({baseURL: VITE_BASE_API});

const getProductList = (queryObj?: object): Promise<ProductInst[]> => new Promise((resolve, reject) => {
    productRequest.get('/data.json', {params: queryObj})
        .then((res) => {
            console.log(res.data)
            resolve(res.data)
        })
        .catch((err) => reject(err));
});

const getProductDetail = (id: number): Promise<ProductInst> => new Promise((resolve, reject) => {
    productRequest.get('/data.json', {params: {id: id}})
        .then((res) => resolve(res.data.find((item: any) => item.id === id)))
        .catch((err) => reject(err));
});

export default {
    getProductList,
    getProductDetail,
}