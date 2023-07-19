import {ref, computed, watch} from 'vue';
import type {IOptions, IPageButton, IPagination, IPaginatorButton} from '@/modal/IPaginator';

const defaultOptions: Required<IOptions> = {
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalButtons: 5,
};

function usePaginator (userOptions: IOptions): IPagination {
    const options: Required<IOptions> = {...defaultOptions, ...userOptions}
    const _currentPage = ref(options.currentPage)
    const pageSize = ref(options.pageSize)
    const totalItems = ref(options.totalItems)
    const totalButtons = ref(options.totalButtons)

    const currentPage = computed({
        get: () => _currentPage.value,
        set: val => {
            if (val > 0 && val <= totalPages.value) {
                _currentPage.value = val
            }
        }
    })

    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

    watch([pageSize, totalItems], () => {
        if (currentPage.value > totalPages.value) {
            currentPage.value = totalPages.value
        }
    })

    const slice = computed((): [number, number] => {
        const start = (currentPage.value - 1) * pageSize.value
        const end = Math.min(start + pageSize.value, totalItems.value)
        return [start, end]
    })

    const hasPrev = computed(() => currentPage.value > 1)
    const hasNext = computed(() => currentPage.value < totalPages.value)

    const goPrev = () => {
        console.log(currentPage.value, hasPrev.value);
        if (hasPrev.value) {
            return currentPage.value - 1;
        }
        return currentPage.value
    }

    const goNext = () => {
        if (hasNext.value) {
            return currentPage.value + 1;
        }
        return currentPage.value
    }

    const goStart = (): 1 => {
        currentPage.value = 1
        return 1
    }

    const goEnd = () => {
        currentPage.value = totalPages.value
        return totalPages.value
    }

    const buttons = computed<Array<IPaginatorButton>>(() => {
        if (totalPages.value <= totalButtons.value) {
            return fullButtons(currentPage.value, totalPages.value)
        } else {
            return partialButtons(currentPage.value, totalPages.value, totalButtons.value)
        }
    })

    return {
        currentPage,
        pageSize,
        totalItems,
        totalButtons,
        totalPages,
        slice,
        hasPrev,
        hasNext,
        goPrev,
        goNext,
        goStart,
        goEnd,
        buttons,
    }
}


function fullButtons(page: number, totalPages: number): Array<IPaginatorButton> {
    return consecutiveSlots(1, page)
        .concat({page, active: true, ellipsis: false})
        .concat(consecutiveSlots(page + 1, totalPages + 1))
}


function partialButtons(
    page: number, totalPages: number, totalButtons: number
): Array<IPaginatorButton> {
    let slotsLeft = 0, slotsRight = 0
    const halvedButtons = Math.floor(totalButtons / 2)

    // check if either side can be filled with pages up to active page
    if (page <= halvedButtons) {
        slotsLeft = page - 1
        slotsRight = totalButtons - slotsLeft - 1

    } else if (page >= totalPages - halvedButtons) {
        slotsRight = totalPages - page
        slotsLeft = totalButtons - slotsRight - 1

        // page sits in center and has 1 or 2 adjacent ellipsis
    } else if (totalButtons % 2 === 0) {
        slotsLeft = halvedButtons - 1
        slotsRight = halvedButtons
    } else {
        slotsLeft = halvedButtons
        slotsRight = halvedButtons
    }

    const pagesPrev = page - 1
    const pagesNext = totalPages - page

    let list: Array<IPaginatorButton> = []

    if (pagesPrev <= slotsLeft) {
        list = consecutiveSlots(1, pagesPrev + 1)

    } else if (slotsLeft > 0) {
        const ellipsis = slotsLeft === 2 ? 2 : Math.ceil(slotsLeft / 2)
        const remaining = slotsLeft - ellipsis
        let ellipsisPage = Math.ceil(pagesPrev / 2)
        if (pagesPrev % 2 === 0) {
            ellipsisPage++
        }

        list = (consecutiveSlots(1, ellipsis) as Array<IPaginatorButton>)
            .concat({page: ellipsisPage, active: false, ellipsis: true})
            .concat(consecutiveSlots(page - remaining, page))
    }

    list.push({page, active: true, ellipsis: false})

    if (pagesNext <= slotsRight) {
        list = list.concat(consecutiveSlots(page + 1, totalPages + 1))

    } else if (slotsRight > 0) {
        const ellipsis = slotsRight === 2 ? 1 : Math.floor(slotsRight / 2) + 1
        const remaining = slotsRight - ellipsis
        const ellipsisPage = page + Math.ceil(pagesNext / 2)

        list = list.concat(consecutiveSlots(page + 1, page + ellipsis))
            .concat({page: ellipsisPage, active: false, ellipsis: true})
            .concat(consecutiveSlots(totalPages - remaining + 1, totalPages + 1))
    }

    return list
}

function consecutiveSlots(startIdx: number, endIdx: number): Array<IPageButton> {
    const result: Array<IPageButton> = []
    for (let idx = startIdx; idx < endIdx; idx++) {
        result.push({page: idx, active: false, ellipsis: false})
    }
    return result
}

export {usePaginator}
