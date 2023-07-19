import type {IStore} from '../modal/IProduct';

export default class StoreInst implements IStore {
    id: number;
    name: string;
    rating?: number;
    description?: string;
    image?: string;
    constructor(
        id: number,
        name: string,
        rating?: number,
        description?: string,
        image?: string,
    ) {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.description = description;
        this.image = image;
    }
    getImage(): string {
        return this.image || '';
    }
}
