<script setup lang="ts">
import placeholderImage from '@/assets/images/online-shopping.png';
interface ICard {
    title:  string,
    img?:  string,
    url: string,
    price: number,
    rating?: number,
    isLazyLoading: boolean,
}

const props = withDefaults(defineProps<ICard>(), {
    title: '',
    img: undefined,
    url: '',
    price: 0,
    rating: undefined,
    isLazyLoading: true,


});

const handleReplaceLazyLoadingImage = function(event: { target: { src: string; onerror: null; }; }) {
    event.target.src = placeholderImage;
    event.target.onerror = null;
}

</script>
<template>
    <a :href="url" v-if="url">
        <div class="card">
            <div class="card__head">
                <slot name="head">
                    <div class="card__img">
                        <picture>
                            <img @error="handleReplaceLazyLoadingImage"
                                 :src="img ? img : ''"
                                 :alt="title"
                                 :loading="isLazyLoading? 'lazy' : 'auto'">
                            <source :srcset="img">
                        </picture>
                    </div>
                </slot>
            </div>
            <div class="card__body">
                <slot name="body">
                    <div class="card__title">
                        {{props.title}}
                    </div>
                    <div class="card__price">
                        {{ props.price }}
                    </div>
                    <div class="card__rating" v-if="props?.rating > 0">
                        {{ props?.rating }}
                    </div>
                </slot>
            </div>
            <div class="card__footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </a>
    <div class="card" v-else>
        <div class="card__head">
            <slot name="head">
                <div class="card__img">
                    <picture>
                        <img @error="handleReplaceLazyLoadingImage"
                             :src="img ? img : ''"
                             :alt="title"
                             :loading="isLazyLoading? 'lazy' : 'auto'">
                        <source :srcset="img"
                                media="(orientation: portrait)"
                        >
                    </picture>
                </div>
            </slot>
        </div>
        <div class="card__body">
            <slot name="body">
                <div class="card__title">
                    {{props.title}}
                </div>
                <div class="card__price">
                    {{ props.price }}
                </div>
                <div class="card__rating" v-if="props?.rating > 0">
                    {{ props?.rating }}
                </div>
            </slot>
        </div>
        <div class="card__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<style scoped lang="scss">
.card {}
.card__head {}
.card__img img {
  width:100%;
}
.card__body {}
.card__title {}
.card__price {}
.card__rating {}
.card__footer {}

</style>
