import {computed} from 'vue';

interface Pos {
    posX: number,
    posY: number
}

function useCursorPosinEle(htmlEle: HTMLElement, event: MouseEvent):Pos {
    //get cursor position in htmlEle
    const pos = computed(() => {
        let x = 0;
        let y = 0;
        /* Get the x and y positions of the image: */
        const htmlEleBoundingClientRect = htmlEle.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the ele and pageOffset: */
        x = event.pageX - htmlEleBoundingClientRect.left - window.pageXOffset;
        y = event.pageY - htmlEleBoundingClientRect.top - window.pageYOffset;
        return {
            posX: x,
            posY: y
        }
    })

    return {
        posX: pos.value.posX,
        posY: pos.value.posY
    }
}

export {useCursorPosinEle};
