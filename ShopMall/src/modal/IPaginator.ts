import type {ComputedRef, Ref} from "vue";

export interface IOptions {
    currentPage?: number | Ref<number>;
    pageSize?: number | Ref<number>;
    totalItems?: number | Ref<number>;
    totalButtons?: number | Ref<number>;
}

export interface IPagination {
    currentPage: Ref<number>
    pageSize: Ref<number>
    totalItems: Ref<number>
    totalButtons: Ref<number>
    totalPages: ComputedRef<number>
    slice: ComputedRef<[number, number]>
    buttons: ComputedRef<IPaginatorButton[]>
    hasPrev: ComputedRef<boolean>
    hasNext: ComputedRef<boolean>
    goPrev: () => number
    goNext: () => number
    goStart: () => 1
    goEnd: () => number
}

interface IButton {
    page: number
}

export interface IPageButton extends IButton {
    active: boolean
    ellipsis: false
}

export interface IEllipsisButton extends IButton {
    active: false
    ellipsis: true
}

export type IPaginatorButton = IPageButton | IEllipsisButton
